import React from "react";

const MovieCard = ({movie, theme, index}) => {

  const handleOnClick = (title) => {
    console.log(title);
  }

  return (
    <div key={index} onClick={() => handleOnClick(movie.title)} className="max-w-[175px] bg-transparent flex-shrink-0 cursor-pointer ">
      <img src={movie.poster} alt={movie.title} className="w-full h-64 object-cover rounded-3xl mb-2" />
      <h2 className={`text-md truncate mx-2 font-body font-semibold ${theme === "light" ? "text-black" : "text-white"}`}> {movie.title} </h2>
    </div>
  );
}

export default MovieCard;