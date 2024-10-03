import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const GenreCard = ({ genre, theme, index }) => {

  // Dark #2D2E39
  // Dark Contrast #25262F

  // Light #FFFFFF
  // Light Contrast #E4E4E4

  const handleClick = (title) => {
    console.log(title);
  }

  return (
    <div onClick={() => handleClick(genre.name)} className={`transition-all ease-in-out duration-500 transform hover:scale-105 hover:bg-gray-900 min-w-48 h-24 flex items-center justify-center p-4 rounded-2xl cursor-pointer shadow-[rgba(0,0,15,0.5)_10px_5px_4px_0px] ${theme === "light" ? "bg-[#E4E4E4]" : "bg-[#25262F]"}`}>
      <FontAwesomeIcon icon={genre.icon} className={`pl-2 ${theme === "light" ? "text-black" : "text-white"}`} />
      <h3 className={`px-2 text-lg font-bold ${theme === "light" ? "text-black" : "text-white"}`}>
        {genre.name}
      </h3>
    </div>
  );
}

export default GenreCard;