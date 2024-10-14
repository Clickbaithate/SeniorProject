import React from "react";
import { useNavigate } from "react-router-dom";
import placeholder from "../assets/placeholder.jpg";
import '../pages/theme.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEyeSlash, faEye } from "@fortawesome/free-solid-svg-icons";

const MovieChallengeCard = ({ movie, index }) => {

  const navigate = useNavigate();

  const handleOnClick = (id) => {
    navigate(`/movie/${id}`);
  }

  return (
    <div key={index} onClick={() => handleOnClick(movie.movie_id)} className="transition-all ease-in-out duration-500 transform hover:translate-x-2 min-w-24 w-[75%] cursor-pointer flex justify-between items-center">

      <div className="flex" >
        {/* Image */}
        <img src={movie.image ? movie.image : placeholder} 
            alt={movie.title} 
            className="w-36 object-cover mb-2 rounded-2xl" />

        {/* Text container */}
        <div className="flex flex-col space-y-1 justify-center mx-2 ml-6">
          <h2 className="text-2xl truncate font-body">
            {index + 1}: {movie.title}
          </h2>
          <h2 className="text-sm font-body">
            {movie.release_date.slice(-4)}
          </h2>
          <h2 className="text-sm font-body">
            {movie.runtime} minutes
          </h2>
          <h2 className="text-sm font-body">
            {movie.rating} / 10 ⭐
          </h2>
        </div>
      </div>

      {/* Eye Icon */}
      <FontAwesomeIcon className="w-8 h-8 mr-12"  icon={faEye} />
    </div>
  );
}

export default MovieChallengeCard;
