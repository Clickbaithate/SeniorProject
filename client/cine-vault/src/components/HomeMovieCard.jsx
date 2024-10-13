import React from "react";
import { useNavigate } from "react-router-dom";

const HomeMovieCard = ({ movie }) => {

  const navigate = useNavigate();

  const handleClick = (id) => {
    navigate(`/movie/${id}`);
  }

  return (

    <div className="flex items-center justify-evenly " >
      <img 
        src={movie.image} 
        className="w-[80px] rounded-xl"
      />
      <div className="flex flex-col justify-center ml-6 space-y-2" >
        <div className="font-body w-40 truncate overflow-hidden " >{movie.title}</div>
        <div className="font-body" >{movie.release_date}</div>
        <div className="font-body" >{movie.rating} / 10 ⭐ </div>
      </div>
      <button onClick={() => handleClick(movie.movie_id)} className="w-24 h-10 font-body bg-theme rounded-xl ml-12 shadow-[rgba(0,0,15,0.5)_10px_5px_4px_0px] hover:scale-110 duration-500 " >
        View Movie
      </button>
    </div>
  
  );

}

export default HomeMovieCard;