import React from "react";
import { useNavigate } from "react-router-dom";

const MovieCard = ({movie, theme, index}) => {

  const navigate = useNavigate();

  const handleOnClick = (id) => {
    navigate(`/movie/${id}`)
  }

  return (
    <div key={index} onClick={() => handleOnClick(movie.id)} className="transition-all ease-in-out duration-500 transform hover:scale-110 min-w-[175px] max-w-[175px] bg-transparent flex-shrink-0 cursor-pointer ">
      <img src={movie.poster ? movie.poster : movie.image} alt={movie.title} className="w-full h-64 object-cover rounded-3xl mb-2" />
      <h2 className={`text-md truncate mx-2 font-body font-semibold ${theme === "light" ? "text-black" : "text-white"}`}> {movie.title} </h2>
    </div>
  );
}

export default MovieCard;