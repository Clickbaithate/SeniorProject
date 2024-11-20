import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import supabase from "../config/supabaseClient";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark, faFolderPlus, faEye, faEnvelope, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import bannerPlaceholder from "../assets/placeholder.jpg";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import axios from "axios"; // Import axios for making HTTP requests
import "./theme.css";
import MovieCard from "../components/movieCard";

const MoviePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isToggled, setIsToggled] = useState(localStorage.getItem("theme") === "dark");
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true); // Set loading to true initially
  const [trendingArray, setTrendingArray] = useState([]);
  const [hasWatched, setHasWatched] = useState(false);

  // Fetch user profile and movie details
  useEffect(() => {
    setMovie(null);
    setLoading(true);
    setTrendingArray([]);  // Reset trending array on movie change

    const fetchProfileAndMovie = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) {
          console.warn(sessionError);
          return;
        }

        if (session) {
          const { data, error } = await supabase
            .from("Users")
            .select()
            .eq("user_id", session.user.id)
            .maybeSingle();
          if (data) {
            setUser(data);
            setIsToggled(data.theme_settings);
          }
        }

        // Fetch recommended movies based on the movie ID
        const { data: movieData, error: movieError } = await supabase
          .from('Movies')
          .select('*')
          .eq("movie_id", id)
          .maybeSingle();

        if (movieData) {
          setMovie(movieData); // Set the movie
        } else {
          console.error(movieError);
        }

        // Check if the user has watched this movie
        if (session) {
          const { data: watchedData } = await supabase
            .from("Watched_Movies")
            .select("*")
            .eq("user_id", session.user.id)
            .eq("movie_id", id)
            .maybeSingle();
          setHasWatched(Boolean(watchedData));
        }

      } catch (error) {
        console.error("Error fetching movie data:", error);
      }
    };

    fetchProfileAndMovie();
  }, [id]);

  // Fetch recommendations only when movie data is available and loading is complete
  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!movie) return; // If movie data is not available, do not call the API

      try {
        const mid = Number(id);
        const data = { data: [mid] }
        const headers = { 'Content-Type': 'application/json' };
        const response = await axios.post(
          `https://gaelguzman.us-east-1.aws.modelbit.com/v1/get_recommendations_chunked/latest`,
          data,
          { headers }
        );

        // Make sure the response data is an array before setting it
        if (Array.isArray(response.data.data)) {
          setTrendingArray(response.data.data);
        } else {
          console.error("Received data is not an array", response.data);
          setTrendingArray([]);  // Set it to an empty array in case of invalid data
        }
      } catch (error) {
        console.error("Error fetching recommendations:", error);
        setTrendingArray([]); // In case of error, set it to an empty array
      }
    };

    if (loading && movie) { // Only fetch recommendations when movie is available
      fetchRecommendations();
    }
  }, [id, movie, loading]); // Add `loading` and `movie` as dependencies

  const handleClose = () => {
    navigate(-1);
  };

  //keeps track of movies visited locally
  // keeps track of recently visited locally
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (!savedTheme) {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.setAttribute('data-theme', savedTheme);
    }
  }, []);

  const toggleWatchedStatus = async () => {
    if (!user) return;

    if (hasWatched) {
      await supabase
        .from("Watched_Movies")
        .delete()
        .eq("user_id", user.user_id)
        .eq("movie_id", id);
      setHasWatched(false);
    } else {
      await supabase.from("Watched_Movies").insert({
        user_id: user.user_id,
        movie_id: id,
      });
      setHasWatched(true);
    }
  };

  useEffect(() => {
    if (movie && movie.movie_id) {
      const visitedItems = JSON.parse(localStorage.getItem("recentlyVisitedItems")) || [];
      const updatedItems = [
        { id: movie.movie_id, type: 'movie', title: movie.title, image: movie.image, release_date: movie.release_date, rating: movie.rating },
        ...visitedItems.filter(item => item.id !== movie.movie_id || item.type !== 'movie')
      ];
      localStorage.setItem("recentlyVisitedItems", JSON.stringify(updatedItems.slice(0, 3))); // Limit to the last 5 items
    }
  }, [movie]);
  

  return (
    loading ? (
      <div className="">
        <div className="relative h-[1000px] flex flex-col">
          <div className="relative flex flex-1 justify-end items-start rounded-br-3xl rounded-bl-3xl">
            <div
              className="opacity-25 w-full h-full rounded-br-3xl rounded-bl-3xl"
              style={{
                backgroundImage: `url(${movie?.banner || bannerPlaceholder})`,
                backgroundSize: "contain", // Separate backgroundSize from background shorthand
                backgroundPosition: "center",
              }}
            ></div>

            <button onClick={handleClose} className="absolute top-8 right-12 z-20">
              <FontAwesomeIcon
                className="w-12 h-12 transition-all ease-in-out duration-500 transform hover:scale-125"
                icon={faCircleXmark}
              />
            </button>
          </div>

          <div className="flex flex-col flex-1 overflow-hidden">
            <div className="flex-1 flex items-center overflow-y-auto">
              <div className="absolute left-0 top-1/2 transform -translate-y-1/2 flex items-center">
                <img
                  src={movie?.image || bannerPlaceholder}
                  className="shadow-[rgba(0,0,15,0.5)_10px_15px_4px_0px] min-h-[540px] max-h-[540px] max-w-[380px] rounded-2xl ml-20"
                />
                <div className={`flex flex-col ml-10 mr-4 font-body ${movie?.overview?.length > 440 ? "mt-96" : "mt-72"}`}>

                  <div className="flex items-center space-x-12">
                    <div className="text-5xl max-w-[600px]">{movie?.title}</div>
                    <button onClick={toggleWatchedStatus} className="transition-all ease-in-out duration-500 transform hover:scale-110 px-3 py-3 flex rounded-full shadow-[rgba(0,0,0,0.5)_5px_10px_4px_0px]">
                      <FontAwesomeIcon className="w-6 h-6" icon={hasWatched ? faEyeSlash : faEye} />
                      <span className="ml-2">{hasWatched ? "Has Watched" : "Watch"}</span>
                    </button>
                    <button className="transition-all ease-in-out duration-500 transform hover:scale-110 px-3 py-3 flex rounded-full shadow-[rgba(0,0,0,0.5)_5px_10px_4px_0px]">
                      <FontAwesomeIcon className="w-6 h-6" icon={faFolderPlus} />
                    </button>
                    <button className="transition-all ease-in-out duration-500 transform hover:scale-110 px-3 py-3 flex rounded-full shadow-[rgba(0,0,0,0.5)_5px_10px_4px_0px]">
                      <FontAwesomeIcon className="w-6 h-6" icon={faEnvelope} />
                    </button>
                  </div>
                  <div className="flex items-center space-x-4 mt-8">
                    <div>{movie?.release_date}</div>
                    <div>*</div>
                    <div>{movie?.genres}</div>
                    <div>*</div>
                    <div>{movie?.runtime} Minutes</div>
                    <div>*</div>
                    <div>{movie?.rating} / 10 ⭐</div>
                  </div>
                  <div className="text-gray-400 py-2">{movie?.tagline}</div>
                  <div className="text-2xl">Overview</div>
                  <div className="text-wrap py-2">{movie?.overview}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 mt-[-100px] pl-3.5">
          <h1 className="text-4xl font-body ml-16">Similar Movies</h1>
          {trendingArray && trendingArray.length > 0 ? (
            <div className="flex overflow-x-auto space-x-4 ml-16 mt-4">
              {trendingArray.map((recommendedMovie) => (
                <MovieCard key={recommendedMovie} index={recommendedMovie} />
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <DotLottieReact
                src="https://lottie.host/beb1704b-b661-4d4c-b60d-1ce309d639d5/7b3aX5rJYc.json"
                loop
                autoplay
                className="w-32 h-32"
              />
            </div>
          )}
        </div>
      </div>
    ) : null
  );
};

export default MoviePage;
