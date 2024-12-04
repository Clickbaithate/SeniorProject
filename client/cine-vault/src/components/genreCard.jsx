import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";

const GenreCard = ({ genre, index }) => {

  const navigate = useNavigate();

  // Dark #2D2E39
  // Dark Contrast #25262F

  // Light #FFFFFF
  // Light Contrast #E4E4E4

  const handleClick = (title) => {
    navigate(`/genre/${title}`)
  }

  return (
    <div onClick={() => handleClick(genre.name)} className={`transition-all ease-in-out duration-500 hover:bg-opacity-5 transform hover:scale-105 min-w-48 h-24 flex items-center justify-center p-4 rounded-2xl cursor-pointer shadow-[rgba(0,0,15,0.5)_10px_5px_4px_0px] accent`}>
      <FontAwesomeIcon icon={genre.icon} className={`pl-2 text-theme`} />
      <h3 className={`px-2 text-lg font-bold text-theme`}>
        {genre.name}
      </h3>
    </div>
  );
}

export default GenreCard;