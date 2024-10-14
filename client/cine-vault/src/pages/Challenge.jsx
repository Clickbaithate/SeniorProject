import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import supabase from "../config/supabaseClient";
import "./theme.css";
import MovieCard from "../components/movieCard";
import { useNavigate } from "react-router-dom";
import MovieChallengeCard from "../components/ChallengeMovieCard";

const Challenge = () => {

  const { id } = useParams();
  const [challenge, setChallenge] = useState(null);
  const [movies, setMovies] = useState(null);
  const navigate = useNavigate();

  // Apply the theme based on stored preference
  const applyTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
  };

  // Retrieve theme from localStorage on component mount
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      applyTheme(storedTheme);
    } else {
      // Default theme if not set in localStorage
      applyTheme('light'); 
    }
  }, []);

  useEffect(() => {
    const fetchChallenge = async () => {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();
      if (sessionError) {
        console.warn("Session Error: ", sessionError);
        return;
      }

      const { data, error } = await supabase
        .from("Challenges")
        .select('*')
        .eq("challenge_id", id);

      if (error) {
        console.warn("Error fetching challenge:", error);
      } else if (data) {
        setChallenge(data[0]);
      }
    };
    fetchChallenge();
  }, [id]);

  useEffect(() => {
    const fetchMovies = async () => {
      if (challenge && challenge.media && challenge.media.length > 0) {
        const { data: theta, error: err } = await supabase
          .from("Movies")
          .select('*')
          .in("movie_id", challenge.media);

        if (err) {
          console.log("Error Fetching Movies: ", err);
        } else {
          setMovies(theta);
        }
      }
    };
    fetchMovies();
  }, [challenge]);

  const onBack = () => {
    navigate(-1);
  }

  return (
    <div className="bg-theme">
      {challenge ? (
        <div>

          <div className="flex justify-between px-16 pt-12 pb-6 text-theme text-4xl font-body ">
            <div>{challenge.title}</div>
            <button onClick={() => onBack()} className="w-24 h-10 flex items-center justify-center rounded-lg accent text-xl" >
              Back
            </button>
          </div>

          <div className="ml-16 font-body pt-6 pb-10 " > You have watched {challenge.percent}% of this challenge! </div>

          <div>
            <div className="flex flex-col items-center ml-96 space-y-6 ">
              {movies ? (
                movies.map((movie, i) => (
                  <div key={i} className="w-[100%]">
                    <MovieChallengeCard movie={movie} index={i} />
                    <div className="w-[75%] h-1 opacity-25 bg-gray-500 mt-2 rounded-full" />
                  </div>
                ))
              ) : (
                <p>Loading</p>
              )}
            </div>
          </div>

          <div className="h-12" />

        </div>
      ) : (
        <h1>Loading</h1>
      )}
    </div>
  );
};

export default Challenge;
