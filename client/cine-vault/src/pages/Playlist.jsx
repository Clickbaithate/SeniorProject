import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import supabase from "../config/supabaseClient";
import PlaylistCard from "../components/PlaylistCard";
import "./theme.css";
import MovieCard from "../components/movieCard";

const Playlist = () => {

  const { id } = useParams();
  const [playlist, setPlaylist] = useState([]);
  const [movies, setMovies] = useState([]);
  const [shows, setShows] = useState([]);
  const [creator, setCreator] = useState();

  // Apply the theme based on stored preference
  const applyTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
  };

  // Retrieve theme from localStorage on component mount
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      applyTheme(storedTheme);
    } else {
      // Default theme if not set in localStorage
      applyTheme('light'); 
    }
  }, []);

  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        const { data, error } = await supabase.from("Playlists").select().eq("playlist_id", id).single();
        if (data) setPlaylist(data);
        if (error) throw new Error(error.message);
      } catch (e) {
        console.log(e);
      }
    }
    fetchPlaylist();
  }, []);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const { data, error } = await supabase.from('Movies').select().in('movie_id', playlist.movies);
          if (playlist.movies && data) setMovies(data);
          if (error) throw new Error(error.message);
      } catch (e) {
        console.log(e);
      }
    }
    fetchMovies();
  }, []);

  useEffect(() => {
    const fetchShows = async () => {
      try {
        const { data, error } = await supabase.from('Shows').select().in('show_id', playlist.shows);
          if (data) setMovies(data);
          if (error) throw new Error(error.message);
      } catch (e) {
        console.log(e);
      }
    }
    fetchShows();
  }, []);

  useEffect(() => {
    const fetchCreator = async () => {
      if (playlist?.user_id) {
        try {
          const { data, error } = await supabase.from('Users').select("username").eq("user_id", playlist.user_id).single();
            if (data) setCreator(data.username);
            if (error) throw new Error(error.message);
        } catch (e) {
          console.log(e);
        }
      }
    }
    fetchCreator();
  }, [playlist]);

  return(
    <div className={`flex flex-col h-screen bg-theme `}>
      <div className={`w-full h-1/2 rounded-bl-2xl rounded-br-2xl `} style={{ backgroundImage: `url(${playlist?.image})`, backgroundSize: 'cover', backgroundPosition: 'center',  }} />
      <div className="w-full h-1/2 bg-theme">
        <div className="font-body text-4xl ml-16 pt-12 flex justify-between mr-32">

          <div>
            <div>
              {playlist ? playlist.title : "loading"}
            </div>
            <div  className="text-lg py-4 opacity-50">
              Created by {creator ? creator : ""} on {playlist?.created_at ? playlist.created_at.split("T")[0] : ""}
            </div>
            <div className="opacity-50 text-lg">{playlist.likes !== null ? (playlist.likes === 1 ? `${playlist.likes} like` : `${playlist.likes} likes`) : "Loading..."}</div>
          </div>
          <div className="flex items-center" >
            <div className="w-48 h-12 accent rounded-2xl flex justify-center items-center cursor-pointer text-xl">
              Add Playlist
            </div>
          </div>

        </div>

        <div className="grid grid-cols-6 gap-y-16 ml-16 pr-6 py-12 ">
          {
            movies 
            ? 
            movies.map((playlist, index) => (
              <MovieCard movie={playlist} />
            )) 
            : 
            <h1>No Movies</h1>
          }
        </div>

      </div>
    </div>
  );

}

export default Playlist;