import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import supabase from "../config/supabaseClient";
import MovieCard from "../components/movieCard";
import AddMedia from "../components/AddMedia";
import HorizontalMovieCard from "../components/HorizontalMovieCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp, faPlus } from "@fortawesome/free-solid-svg-icons";
import "./theme.css";

const Playlist = () => {
  const { id } = useParams();
  const [playlist, setPlaylist] = useState([]);
  const [movies, setMovies] = useState([]);
  const [shows, setShows] = useState([]);
  const [creator, setCreator] = useState();
  const [showAddMedia, setShowAddMedia] = useState(false); // State for overlay visibility

  // Apply theme
  const applyTheme = (theme) => {
    document.documentElement.setAttribute("data-theme", theme);
  };

  // Retrieve theme from localStorage on mount
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    applyTheme(storedTheme || "light");
  }, []);

  // Fetch playlist, movies, and shows data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: playlistData, error: playlistError } = await supabase
          .from("Playlists")
          .select()
          .eq("playlist_id", id)
          .single();
        if (playlistError) throw new Error(playlistError.message);

        setPlaylist(playlistData);

        if (playlistData?.movies?.length) {
          const { data: moviesData, error: moviesError } = await supabase
            .from("Movies")
            .select()
            .in("movie_id", playlistData.movies);
          if (moviesError) throw new Error(moviesError.message);
          setMovies(moviesData);
        } else {
          setMovies([]);
        }

        if (playlistData?.shows?.length) {
          const { data: showsData, error: showsError } = await supabase
            .from("Shows")
            .select()
            .in("show_id", playlistData.shows);
          if (showsError) throw new Error(showsError.message);
          setShows(showsData);
        } else {
          setShows([]);
        }

        if (playlistData?.user_id) {
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

  return (
    <div className="flex h-screen bg-theme">
  {/* Left Column: Playlist Info */}
  <div className="w-1/2 h-full flex flex-col justify-center items-center p-4" style={{ position: "sticky", top: 0 }}>
    <div className="h-72 w-full mx-4 rounded-xl" style={{ backgroundImage: `url(${playlist?.image})`, backgroundSize: "cover", backgroundPosition: "center" }} />
    <div className="font-body text-4xl space-y-2 py-8 text-center">
      <div>{playlist ? playlist.title : "Loading..."}</div>
      <div className="text-lg opacity-85">{playlist ? playlist.description : "Loading..."}</div>
      <div className="text-lg">
        Created by <span className="italic text-blue-300 cursor-pointer">{creator || ""}</span> on {playlist?.created_at?.split("T")[0]}
      </div>
      <div className="flex items-center justify-center space-x-4">
        <div className="opacity-50 text-lg">
          {playlist.likes !== null
            ? `${playlist.likes} ${playlist.likes === 1 ? "like" : "likes"}`
            : "Loading..."}
        </div>
        <div className="w-12 h-12 rounded-full accent text-sm flex items-center justify-center cursor-pointer">
          <FontAwesomeIcon className={`w-6 h-6`} icon={faThumbsUp} />
        </div>
      </div>
    </div>
    <div className="flex items-center space-x-2 mt-4">
      <div onClick={() => setShowAddMedia(true)} className="w-24 h-12 accent rounded-xl flex justify-center items-center cursor-pointer text-xl">
        <FontAwesomeIcon className={`w-6 h-6`} icon={faPlus} />
      </div>
    </div>
  </div>

  {/* Right Column: Movies and Shows */}
  <div className="w-1/2 h-full overflow-y-auto py-2">
    {/* Movies Section */}
    <div>
      <h2 className="text-2xl font-semibold mb-6">Movies</h2>
      <div className="grid grid-cols-1 gap-y-2 pr-6">
        {movies.length > 0
          ? movies.map((movie) => <HorizontalMovieCard key={movie.movie_id} movie={movie} />)
          : <p>No Movies</p>}
      </div>
    </div>

    {/* Shows Section */}
    <div className="pt-2">
      <h2 className="text-2xl font-semibold mb-6">Shows</h2>
      <div className="grid grid-cols-1 gap-y-2 pr-6">
        {shows.length > 0
          ? shows.map((show) => <HorizontalMovieCard key={show.show_id} movie={show} />)
          : <p>No Shows</p>}
      </div>
    </div>
  </div>

  {/* AddMedia Overlay */}
  {showAddMedia && (
    <AddMedia onClose={() => setShowAddMedia(false)} playlistId={id} />
  )}
</div>

  );
};

export default Playlist;
