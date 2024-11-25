import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../config/supabaseClient";

const HomeMovieCard = ({ movie }) => {

  const [movieDetails, setMovieDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("Movies")
          .select("*")
          .eq("movie_id", movie) // Fetch movie by ID
          .single();

        if (error) {
          console.error("Error fetching movie details:", error);
          setError("Failed to fetch movie details");
        } else {
          setMovieDetails(data);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
        setError("An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };

    if (movie) {
      fetchMovieDetails();
    }
  }, [movie]);

  const handleClick = (id) => {
    navigate(`/movie/${id}`);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error || !movieDetails) {
    return <div className="text-red-500">Failed to load movie details</div>;
  }

  return (
    <div className="flex items-center justify-evenly">
      <img src={movieDetails.image} alt="Movie Poster" className="w-[80px] rounded-xl" />
      <div className="flex flex-col justify-center ml-6 space-y-2">
        <div className="font-body w-40 truncate overflow-hidden">{movieDetails.title}</div>
        <div className="font-body">{movieDetails.release_date}</div>
        <div className="font-body">{movieDetails.rating} / 10 ⭐</div>
      </div>
      <button
        onClick={() => handleClick(movieDetails.movie_id)}
        className="w-24 h-10 font-body bg-theme rounded-xl ml-12 shadow-[rgba(0,0,15,0.5)_10px_5px_4px_0px] hover:scale-110 duration-500"
      >
        View Movie
      </button>
    </div>
  );
};

export default HomeMovieCard;
