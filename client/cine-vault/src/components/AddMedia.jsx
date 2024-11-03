import React, { useState, useRef, useEffect } from "react";
import supabase from "../config/supabaseClient";

const AddMedia = ({ onClose, playlistId }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState({ movies: [], shows: [] });
  const inputRef = useRef(null); // Create a ref for the input field

  // Focus on the input field when the component mounts
  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const handleSearch = async () => {
    try {
      // Search for movies
      const { data: movieData, error: movieError } = await supabase
        .from("Movies")
        .select()
        .eq("title", searchQuery) // Using ilike for case-insensitive search
        .limit(3); // Limit results to 3
      if (movieError) throw new Error(movieError.message);

      // Search for shows
      const { data: showData, error: showError } = await supabase
        .from("Shows")
        .select()
        .eq("title", searchQuery) // Using ilike for case-insensitive search
        .limit(3); // Limit results to 3
      if (showError) throw new Error(showError.message);

      // Set the search results
      setSearchResults({
        movies: movieData, // Set all found movies
        shows: showData, // Set all found shows
      });
    } catch (error) {
      console.log("Error fetching search results:", error.message);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch(); // Call the search function when Enter is pressed
    }
  };

  const addMediaToPlaylist = async (media, isMovie) => {
    try {
      const mediaId = isMovie ? media.movie_id : media.show_id;

      // Prepare the insert data object based on media type
      const insertData = {
        playlist_id: playlistId,
      };

      if (isMovie) {
        insertData.movie_id = mediaId; // Add the movie_id to the object
      } else {
        insertData.show_id = mediaId; // Add the show_id to the object
      }

      // Insert into Playlists_Movies or Playlists_Shows based on media type
      const { data, error } = await supabase
        .from(isMovie ? "Playlists_Movies" : "Playlists_Shows")
        .insert([insertData]);

      if (error) {
        console.error("Error adding media to playlist:", error);
      } else {
        console.log("Media added to playlist:", data);
      }

      onClose(); // Close the modal after adding
    } catch (error) {
      console.log("Error adding media to playlist:", error.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-theme p-6 rounded-lg shadow-lg w-96 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500"
        >
          ✕
        </button>
        <h2 className="text-2xl font-semibold text-font mb-4">Add Media</h2>

        <input
          type="text"
          placeholder="Search for a movie or show"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          ref={inputRef} // Attach the ref to the input
          onKeyDown={handleKeyDown} // Add the onKeyDown event handler
          className="w-full p-2 rounded mb-4 accent"
        />
        <button onClick={handleSearch} className="px-4 py-2 bg-blue-500 text-white rounded">
          Search
        </button>

        {/* Display search results here */}
        <div className="mt-4 max-h-48 overflow-y-auto">
          {searchResults.movies.length > 0 && (
            <div>
              <h3 className="font-semibold text-lg mb-2">Movies</h3>
              {searchResults.movies.map((movie) => (
                <div 
                  key={movie.movie_id} 
                  className="flex items-center mb-2 cursor-pointer" 
                  onClick={() => addMediaToPlaylist(movie, true)}
                >
                  <img
                    src={movie.image}
                    alt={movie.title}
                    className="w-24 h-36 rounded mr-2"
                  />
                  <span>{movie.title}</span>
                </div>
              ))}
            </div>
          )}
          {searchResults.shows.length > 0 && (
            <div className="mt-4">
              <h3 className="font-semibold text-lg mb-2">Shows</h3>
              {searchResults.shows.map((show) => (
                <div 
                  key={show.show_id} 
                  className="flex items-center mb-2 cursor-pointer" 
                  onClick={() => addMediaToPlaylist(show, false)}
                >
                  <img
                    src={show.image}
                    alt={show.title}
                    className="w-24 h-36 rounded mr-2"
                  />
                  <span>{show.title}</span>
                </div>
              ))}
            </div>
          )}
          {searchResults.movies.length === 0 && searchResults.shows.length === 0 && (
            <p className="text-center text-gray-500">No results found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddMedia;
