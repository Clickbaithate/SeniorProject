import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import supabase from "../config/supabaseClient";
import "./theme.css";
import MovieChallengeCard from "../components/ChallengeMovieCard";

const Challenge = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [challenge, setChallenge] = useState(null);
  const [movies, setMovies] = useState(null);
  const [userId, setUserId] = useState(null);

  const applyTheme = (theme) => {
    document.documentElement.setAttribute("data-theme", theme);
  };

  const toggleWatchedStatus = async (movieId) => {
    try {
      const { data, error } = await supabase
        .from("Watched_Movies")
        .select("*")
        .match({ user_id: userId, movie_id: movieId });

      if (error) {
        console.error("Error fetching watched movies:", error);
        return;
      }

      if (data.length > 0) {
        await supabase
          .from("Watched_Movies")
          .delete()
          .match({ user_id: userId, movie_id: movieId });
      } else {
        await supabase
          .from("Watched_Movies")
          .insert({ user_id: userId, movie_id: movieId });
      }

      await fetchChallengeDetails();
    } catch (error) {
      console.error("Error toggling watched status:", error);
    }
  };

  useEffect(() => {
    const fetchSessionAndTheme = async () => {
      const storedTheme = localStorage.getItem("theme");
      applyTheme(storedTheme || "light");

      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
      if (error) {
        console.warn("Error fetching session:", error);
        return;
      }
      setUserId(session.user.id);
    };

    fetchSessionAndTheme();
  }, []);

  const fetchChallengeDetails = async () => {
    try {
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

      const { data: watchedMovies, error: watchedError } = await supabase
        .from("Watched_Movies")
        .select("movie_id")
        .eq("user_id", userId)
        .in("movie_id", challengeData.media);

      if (watchedError) {
        console.error("Error fetching watched movies:", watchedError);
        return;
      }

      const progress = Math.min(
        Math.round((watchedMovies.length / challengeData.media.length) * 100),
        100
      );

      setChallenge({
        ...challengeData,
        percent: progress,
      });

      await supabase
        .from("Challenges")
        .update({ percent: progress })
        .eq("challenge_id", challengeData.challenge_id);
    } catch (error) {
      console.error("Error fetching challenge details:", error);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchChallengeDetails();
    }
  }, [id, userId]);

  const fetchMovies = async () => {
    if (challenge?.media?.length > 0) {
      const { data, error } = await supabase
        .from("Movies")
        .select("*")
        .in("movie_id", challenge.media);

      if (error) {
        console.error("Error fetching movies:", error);
        return;
      }

      const { data: watchedMovies, error: watchedError } = await supabase
        .from("Watched_Movies")
        .select("movie_id")
        .eq("user_id", userId);

      if (watchedError) {
        console.error("Error fetching watched movies:", watchedError);
        return;
      }

      const moviesWithWatchedStatus = data.map((movie) => ({
        ...movie,
        watched: watchedMovies.some(
          (watchedMovie) => watchedMovie.movie_id === movie.movie_id
        ),
      }));

      setMovies(moviesWithWatchedStatus);
    }
  };

  useEffect(() => {
    if (challenge) {
      fetchMovies();
    }
  }, [challenge]);

  const onBack = () => {
    navigate(-1);
  };

  return (
    <div className="bg-theme">
      {challenge ? (
        <div>
          <div className="flex justify-between px-16 pt-12 pb-6 text-theme text-4xl font-body">
            <div>{challenge.title}</div>
            <button
              onClick={onBack}
              className="w-24 h-10 flex items-center justify-center rounded-lg accent text-xl"
            >
              Back
            </button>
          </div>

          <div className="ml-16 font-body pt-6 pb-10">
            You have watched{" "}
            <span className="text-red-500">{challenge.percent || 0}%</span> of
            this challenge!
          </div>

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
