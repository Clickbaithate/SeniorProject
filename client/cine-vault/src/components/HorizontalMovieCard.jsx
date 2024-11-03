import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import placeholder from "../assets/placeholder.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import supabase from "../config/supabaseClient";
import '../pages/theme.css';

const HorizontalMovieCard = ({ movie, index, onRemove, playlistId }) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  const handleOnClick = (id) => {
    navigate(`/movie/${id}`);
  };

  const handleMenu = (event) => {
    event.stopPropagation();
    setMenuVisible(!menuVisible);
  };

  const handleRemove = async (event) => {
    event.stopPropagation();
    const { error } = await supabase
      .from('Playlists_Movies') // Ensure this is your correct table name
      .delete()
      .eq('movie_id', movie.movie_id)
      .eq('playlist_id', playlistId); // Adjust if necessary

    if (error) {
      console.error("Error removing movie:", error);
    } else {
      // Call onRemove to notify the parent component to update its state
      if (onRemove) {
        onRemove(movie.movie_id);
      }
      setMenuVisible(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuVisible && menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuVisible]);

  return (
    <div key={index} onClick={() => handleOnClick(movie.movie_id)} className="h-42 w-full cursor-pointer">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <img src={movie.image ? movie.image : placeholder} alt={movie.title} className="h-48 w-42 object-cover mb-2 rounded-xl" />
          <div className="font-body">
            <div>{movie.title}</div>
            <div>{movie.release_date}</div>
            <div>{movie.rating} / 10</div>
          </div>
        </div>
        <button onClick={handleMenu}>
          <FontAwesomeIcon className="w-6 h-6" icon={faEllipsisV} />
        </button>
      </div>
      {menuVisible && (
        <div ref={menuRef} className="absolute accent shadow-lg rounded-lg mt-2 p-2 z-10">
          <button onClick={handleRemove} className="block w-full text-left p-2 hover:opacity-50 rounded-lg">
            Remove from Playlist
          </button>
        </div>
      )}
    </div>
  );
};

export default HorizontalMovieCard;
