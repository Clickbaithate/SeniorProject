import React from "react";
import { useNavigate } from "react-router-dom";
import placeholder from "../assets/placeholder.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import '../pages/theme.css';

const HorizontalMovieCard = ({movie, index}) => {

  const navigate = useNavigate();

  const handleOnClick = (id) => {
    navigate(`/movie/${id}`)
  }

  return (
    <div key={index} onClick={() => handleOnClick(movie.movie_id)} className="h-42 w-full cursor-pointer">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <img src={movie.image ? movie.image : placeholder} alt={movie.title} className={`h-48 w-42 object-cover mb-2 rounded-xl`} />
          <div className="font-body">
            <div>{movie.title}</div>
            <div>{movie.release_date}</div>
            <div>{movie.rating} / 10</div>
          </div>
        </div>
        <button>
          <FontAwesomeIcon className={`w-6 h-6`} icon={faEllipsisV} />
        </button>
      </div>
    </div>
  );
}

export default HorizontalMovieCard;