import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import supabase from "../config/supabaseClient";
import HorizontalMovieCard from "../components/HorizontalMovieCard";
import HorizontalShowCard from "../components/HorizontalShowCard";
import AddMedia from "../components/AddMedia";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp, faPlus, faTrash, faSave, faEdit } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import "./theme.css";

const Playlist = () => {
  const { id } = useParams();
  const [playlist, setPlaylist] = useState({});
  const [movies, setMovies] = useState([]);
  const [shows, setShows] = useState([]);
  const [creator, setCreator] = useState();
  const [showAddMedia, setShowAddMedia] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const navigate = useNavigate();

  // Apply theme
  const applyTheme = (theme) => {
    document.documentElement.setAttribute("data-theme", theme);
  };

  // Retrieve theme
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    applyTheme(storedTheme || "light");
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch the current user
        const { data: { user } } = await supabase.auth.getUser();
        setCurrentUser(user);

        // Fetch the playlist
        const { data: playlistData, error: playlistError } = await supabase
          .from("Playlists")
          .select("*")
          .eq("playlist_id", id)
          .single();
        if (playlistError) throw new Error(playlistError.message);
        setPlaylist(playlistData);
        setNewTitle(playlistData.title);
        setNewDescription(playlistData.description);

        // Fetch movies
        const { data: moviesData, error: moviesError } = await supabase
          .from("Playlists_Movies")
          .select("movie_id")
          .eq("playlist_id", id);
        if (moviesError) throw new Error(moviesError.message);

        const movieIds = moviesData.map((movie) => movie.movie_id);
        if (movieIds.length > 0) {
          const { data: movies, error: movieFetchError } = await supabase
            .from("Movies")
            .select("*")
            .in("movie_id", movieIds);
          if (movieFetchError) throw new Error(movieFetchError.message);
          setMovies(movies);
        }

        // Fetch shows
        const { data: showsData, error: showsError } = await supabase
          .from("Playlists_Shows")
          .select("show_id")
          .eq("playlist_id", id);
        if (showsError) throw new Error(showsError.message);

        const showIds = showsData.map((show) => show.show_id);
        if (showIds.length > 0) {
          const { data: shows, error: showFetchError } = await supabase
            .from("Shows")
            .select("*")
            .in("show_id", showIds);
          if (showFetchError) throw new Error(showFetchError.message);
          setShows(shows);
        }

        // Fetch creator
        if (playlistData.user_id) {
          const { data: creatorData, error: creatorError } = await supabase
            .from("Users")
            .select("username")
            .eq("user_id", playlistData.user_id)
            .single();
          if (creatorError) throw new Error(creatorError.message);
          setCreator(creatorData?.username);
        }
      } catch (e) {
        console.log(e);
      }
    };

    fetchData();
  }, [id, showAddMedia]);

  const handleSave = async () => {
    try {
      const { error } = await supabase
        .from("Playlists")
        .update({ title: newTitle, description: newDescription })
        .eq("playlist_id", id);
      if (error) throw new Error(error.message);

      setPlaylist((prev) => ({
        ...prev,
        title: newTitle,
        description: newDescription,
      }));
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating playlist:", error.message);
    }
  };

  const handleRemoveMovie = (movieId) => {
    setMovies((prevMovies) => prevMovies.filter((movie) => movie.movie_id !== movieId));
  };

  const handleRemoveShow = (showId) => {
    setShows((prevShows) => prevShows.filter((show) => show.show_id !== showId));
  };

  const handleClose = () => {
    setShowAddMedia(false);
  };

  const handleDeletePlaylist = async () => {
    try {
      const { error: deleteMoviesError } = await supabase
        .from("Playlists_Movies")
        .delete()
        .eq("playlist_id", id);
      if (deleteMoviesError) throw new Error(deleteMoviesError.message);

      const { error: deleteShowsError } = await supabase
        .from("Playlists_Shows")
        .delete()
        .eq("playlist_id", id);
      if (deleteShowsError) throw new Error(deleteShowsError.message);

      const { error: deletePlaylistError } = await supabase
        .from("Playlists")
        .delete()
        .eq("playlist_id", id);
      if (deletePlaylistError) throw new Error(deletePlaylistError.message);

      console.log("Playlist and all associated media deleted successfully");
      navigate("/Playlists");
    } catch (error) {
      console.error("Error deleting playlist:", error.message);
    }
  };

  return (
    <div className="flex h-screen bg-theme">
      <div className="w-1/2 h-full flex flex-col justify-center items-center p-4" style={{ position: "sticky", top: 0 }}>
        <div
          className="h-72 w-full mx-4 rounded-xl"
          style={{
            backgroundImage: `url(${playlist?.image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="font-body text-4xl space-y-2 py-8 text-center">
          {isEditing ? (
            <>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="text-4xl w-full font-bold rounded-xl p-2 mb-4 accent text-center"
                placeholder="Playlist Title"
              />
              <textarea
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                className="text-lg w-[75%] h-1/5 p-2 accent rounded-xl text-center scrollbar scrollbar-transparent scrollbar-track-transparent"
                placeholder="Playlist Description"
              />
            </>
          ) : (
            <>
              <div>{playlist ? playlist.title : "Loading..."}</div>
              <div className="text-lg opacity-85">{playlist ? playlist.description : "Loading..."}</div>
            </>
          )}
          <div className="text-lg">
            Created by <span className="italic text-blue-300 cursor-pointer">{creator || ""}</span> on {playlist?.created_at?.split("T")[0]}
          </div>
        </div>
        <div className="flex items-center space-x-2 mt-4">
          <div onClick={() => setShowAddMedia(true)} className="w-24 h-12 accent rounded-xl flex justify-center items-center cursor-pointer text-xl">
            <FontAwesomeIcon className="w-6 h-6" icon={faPlus} />
          </div>
          {currentUser?.id === playlist.user_id && (
            <>
              {isEditing ? (
                <button onClick={handleSave} className="w-24 h-12 bg-green-500 rounded-xl flex justify-center items-center cursor-pointer text-xl text-white">
                  <FontAwesomeIcon className="w-6 h-6" icon={faSave} />
                </button>
              ) : (
                <button onClick={() => setIsEditing(true)} className="w-24 h-12 bg-blue-500 rounded-xl flex justify-center items-center cursor-pointer text-xl text-white">
                  <FontAwesomeIcon className="w-6 h-6" icon={faEdit} />
                </button>
              )}
              <button onClick={handleDeletePlaylist} className="w-24 h-12 bg-red-500 rounded-xl flex justify-center items-center cursor-pointer text-xl text-white">
                <FontAwesomeIcon className="w-6 h-6" icon={faTrash} />
              </button>
            </>
          )}
        </div>
      </div>
  
      <div className="w-1/2 h-full overflow-y-auto py-2">
        <div>
          <h2 className="text-2xl font-semibold mb-6">Movies</h2>
          <div className="flex flex-wrap gap-4">
            {movies.map((movie) => (
              <HorizontalMovieCard key={movie.movie_id} movie={movie} onRemove={handleRemoveMovie} />
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-semibold mt-8 mb-6">Shows</h2>
          <div className="flex flex-wrap gap-4">
            {shows.map((show) => (
              <HorizontalShowCard key={show.show_id} show={show} onRemove={handleRemoveShow} />
            ))}
          </div>
        </div>
      </div>
  
      {showAddMedia && (
        <AddMedia
          playlistId={playlist.playlist_id}
          handleClose={handleClose}
          setMovies={setMovies}
          setShows={setShows}
        />
      )}
    </div>
  );
  

  
};

export default Playlist;
