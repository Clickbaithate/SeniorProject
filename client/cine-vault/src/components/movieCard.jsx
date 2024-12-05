import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../config/supabaseClient"; // Assuming you have supabase client set up
import placeholder from "../assets/placeholder.jpg";
import '../pages/theme.css';

const MovieCard = ({ movie, index }) => {

  const navigate = useNavigate();
  const [fetchedMovie, setFetchedMovie] = useState(null);
  
  useEffect(() => {
    // If no movie is passed as a prop, fetch it from Supabase
    if (!movie || index !== -1) {
      const fetchMovie = async () => {
        const { data, error } = await supabase
          .from("Movies")
          .select("*")
          .eq("movie_id", index) // Assuming the 'index' or another unique field is used to fetch the movie
          .single();
        
        if (error) {
          console.error("Error fetching movie:", error);
        } else {
          setFetchedMovie(data);
        }
      };
      fetchMovie();
    }
  }, [movie, index]); // Only run the effect if 'movie' is not passed or 'index' changes

  const handleOnClick = (id) => {
    navigate(`/movie/${id}`);
  };

  // Use fetchedMovie if no movie prop is provided
  const displayMovie = movie || fetchedMovie;

  if (index === -1) {
    return (
      <div key={index} className="transition-all ease-in-out duration-500 transform hover:scale-110 min-w-[175px] max-w-[175px] bg-transparent flex-shrink-0 cursor-pointer ">
      <img 
        src={placeholder}
        className={`w-full object-cover mb-2 rounded-3xl h-64`} 
      />
      <h2 className={`text-md truncate mx-2 font-body font-semibold text-theme`}> 
        loading
      </h2>
    </div>
    )
  }

  return (
    <div key={index} onClick={() => handleOnClick(displayMovie.movie_id ? displayMovie.movie_id : displayMovie.id)} className="transition-all ease-in-out duration-500 transform hover:scale-110 min-w-[175px] max-w-[175px] bg-transparent flex-shrink-0 cursor-pointer ">
      <img 
        src={displayMovie?.poster ? displayMovie.poster : (displayMovie?.image ? displayMovie.image : (displayMovie?.profile_picture ? displayMovie.profile_picture : placeholder))} 
        alt={displayMovie?.title} 
        className={`w-full object-cover mb-2 ${displayMovie?.profile_picture ? "rounded-full" : "rounded-3xl h-64"}`} 
      />
      <h2 className={`text-md truncate mx-2 font-body font-semibold text-theme`}> 
        {displayMovie?.title || "Unknown Title"} 
      </h2>
    </div>
  );
};

export default MovieCard;
