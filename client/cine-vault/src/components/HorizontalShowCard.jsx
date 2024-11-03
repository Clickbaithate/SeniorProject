import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import placeholder from "../assets/placeholder.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import supabase from "../config/supabaseClient";
import '../pages/theme.css';

const HorizontalShowCard = ({ show, index, onRemove, playlistId }) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  const handleOnClick = (id) => {
    navigate(`/show/${id}`);
  };

  const handleMenu = (event) => {
    event.stopPropagation();
    setMenuVisible(!menuVisible);
  };

  const handleRemove = async (event) => {
    event.stopPropagation();
    try {
      const { error } = await supabase
        .from('Playlists_Shows')
        .delete()
        .eq('show_id', show.show_id)
        .eq('playlist_id', playlistId); 

      if (error) throw error;

      if (onRemove) {
        onRemove(show.show_id);
      }
    } catch (error) {
      console.error('Error removing show:', error);
    } finally {
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
    <div key={index} onClick={() => handleOnClick(show.show_id)} className="relative h-42 w-full cursor-pointer">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <img src={show.image ? show.image : placeholder} alt={show.title} className="h-48 w-42 object-cover mb-2 rounded-xl" />
          <div className="font-body">
            <div>{show.title}</div>
            <div>{show.date}</div>
            <div>{show.rating} / 10</div>
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

export default HorizontalShowCard;
