import React from "react";
import { useNavigate } from "react-router-dom";
import placeholder from "../assets/placeholder.jpg";
import '../pages/theme.css';

const PlaylistCard = ({ playlist, index }) => {
  const navigate = useNavigate();

  const handleOnClick = (id) => {
    navigate(`/playlist/${id}`);
  };

  return (
    <div
      key={index}
      onClick={() => handleOnClick(playlist.playlist_id)}
      className="transition-all ease-in-out duration-500 transform hover:scale-105 w-[350px] h-56 bg-transparent flex-shrink-0 cursor-pointer"
    >
      <img
        src={playlist.image || placeholder}
        className="w-full h-full object-cover mb-2 rounded-3xl"
        alt={`${playlist.title} cover`}
      />
      <h2 className="text-md truncate mx-2 font-body font-semibold text-theme">
        {playlist.title}
      </h2>
    </div>
  );
};

export default PlaylistCard;
