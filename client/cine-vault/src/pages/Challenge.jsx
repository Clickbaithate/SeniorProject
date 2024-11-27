import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import supabase from "../config/supabaseClient";
import "./theme.css";
import MovieChallengeCard from "../components/ChallengeMovieCard";

const Challenge = () => {
  const { id } = useParams(); // Challenge ID from the URL
  const navigate = useNavigate();
  const [challenge, setChallenge] = useState(null); // Current challenge details
  const [movies, setMovies] = useState(null); // Movies in the challenge
  const [userId, setUserId] = useState(null); // User ID from session

  // Apply the theme based on stored preference
  const applyTheme = (theme) => {
    document.documentElement.setAttribute("data-theme", theme);
  };

  const toggleWatchedStatus = async (movieId) => {
    try {
      // Check if the movie is already marked as watched
      const { data, error } = await supabase
        .from("Watched_Movies")
        .select("*")
        .match({ user_id: userId, movie_id: movieId });

      if (error) {
        console.error("Error fetching watched movies:", error);
        return;
      }

      if (data.length > 0) {
        // If already watched, remove it
        await supabase
          .from("Watched_Movies")
          .delete()
          .match({ user_id: userId, movie_id: movieId });
      } else {
        // Mark the movie as watched
        await supabase
          .from("Watched_Movies")
          .insert({ user_id: userId, movie_id: movieId });
      }

      // Refresh challenge details
      await fetchChallengeDetails();
    } catch (error) {
      console.error("Error toggling watched status:", error);
    }
  };

  // Retrieve theme and user session on component mount
  useEffect(() => {
    const fetchSessionAndTheme = async () => {
      const storedTheme = localStorage.getItem("theme");
      if (storedTheme) {
        applyTheme(storedTheme);
      } else {
        applyTheme("light");
      }

      // Fetch user session
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
      if (error) {
        console.warn("Error fetching session:", error);
        return;
      }
      setUserId(session.user.id); // Set the user ID
    };

    fetchSessionAndTheme();
  }, []);

  // Fetch challenge details and recalculate percent
  const fetchChallengeDetails = async () => {
    try {
      // Fetch the challenge data
      const { data: challengeData, error: challengeError } = await supabase
        .from("Challenges")
        .select("*")
        .eq("challenge_id", id)
        .single();

      if (challengeError) {
        console.error("Error fetching challenge:", challengeError);
        return;
      }

      if (!userId) {
        console.error("User ID is not set");
        return;
      }

      // Fetch watched movies in this challenge
      const { data: watchedMovies, error: watchedError } = await supabase
        .from("Watched_Movies")
        .select("movie_id")
        .eq("user_id", userId)
        .in("movie_id", challengeData.media);

      if (watchedError) {
        console.error("Error fetching watched movies:", watchedError);
        return;
      }

      // Calculate progress
      const progress = Math.min(
        Math.round((watchedMovies.length / challengeData.media.length) * 100),
        100
      );

      // Update the challenge data with the new percent
      setChallenge({
        ...challengeData,
        percent: progress,
      });

      // Optionally, update the percent in the database
      const { error: updateError } = await supabase
        .from("Challenges")
        .update({ percent: progress })
        .eq("challenge_id", challengeData.challenge_id);

      if (updateError) {
        console.error("Error updating challenge progress:", updateError);
      }
    } catch (error) {
      console.error("Error fetching challenge details:", error);
    }
  };

  // Fetch challenge details when the component mounts or userId changes
  useEffect(() => {
    if (userId) {
      fetchChallengeDetails();
    }
  }, [id, userId]);

  // Fetch movies for the challenge when the challenge data changes
  useEffect(() => {
    const fetchMovies = async () => {
      if (challenge && challenge.media && challenge.media.length > 0) {
        const { data, error } = await supabase
          .from("Movies")
          .select("*")
          .in("movie_id", challenge.media);

        if (error) {
          console.error("Error fetching movies:", error);
          return;
        }

        setMovies(data);
      }
    };

    fetchMovies();
  }, [challenge]);

  // Refetch challenge details when the window regains focus
  useEffect(() => {
    const handleFocus = () => {
      if (userId) {
        fetchChallengeDetails();
      }
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [userId]);

  const onBack = () => {
    navigate(-1); // Navigate back to the previous page
  };

  return (
    <div className="bg-theme">
      {challenge ? (
        <div>
          {/* Challenge Title */}
          <div className="flex justify-between px-16 pt-12 pb-6 text-theme text-4xl font-body">
            <div>{challenge.title}</div>
            <button
              onClick={onBack}
              className="w-24 h-10 flex items-center justify-center rounded-lg accent text-xl"
            >
              Back
            </button>
          </div>

          {/* Challenge Progress */}
          <div className="ml-16 font-body pt-6 pb-10">
            You have watched{" "}
            <span className="text-red-500">{challenge.percent || 0}%</span> of
            this challenge!
          </div>

          {/* Movies in the Challenge */}
          <div className="flex flex-col items-center ml-96 space-y-6">
            {movies ? (
              movies.map((movie, i) => (
                <div key={i} className="w-[100%]">
                  <MovieChallengeCard
                    movie={movie}
                    index={i}
                    toggleWatchedStatus={() => toggleWatchedStatus(movie.movie_id)}
                  />
                  <div className="w-[75%] h-1 opacity-25 bg-gray-500 mt-2 rounded-full" />
                </div>
              ))
            ) : (
              <p>Loading movies...</p>
            )}
          </div>

          <div className="h-12" />
        </div>
      ) : (
        <h1>Loading challenge...</h1>
      )}
    </div>
  );
};

export default Challenge;
