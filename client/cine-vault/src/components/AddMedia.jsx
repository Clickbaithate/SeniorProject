import React, { useState } from "react";
import supabase from "../config/supabaseClient";

const AddMedia = ({ onClose, playlistId }) => {

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState({ movie: null, show: null });

  const handleSearch = async () => {
    try {
      // Search for a movie
      const { data: movieData, error: movieError } = await supabase
        .from("Movies")
        .select()
        .eq("title", searchQuery)
        .limit(1);
      if (movieError) throw new Error(movieError.message);
  
      // Search for a show
      const { data: showData, error: showError } = await supabase
        .from("Shows")
        .select()
        .eq("title", searchQuery)
        .limit(1);
      if (showError) throw new Error(showError.message);
  
      // Set the search results (if found)
      setSearchResults({
        movie: movieData.length ? movieData[0] : null,
        show: showData.length ? showData[0] : null,
      });
    } catch (error) {
      console.log("Error fetching search results:", error.message);
    }
  };
  
  // Usage
  const addMediaToPlaylist = async (media, isMovie) => {
    try {
        const mediaId = isMovie ? media.movie_id : media.show_id;
        // Call the RPC function
        const { data, error } = await supabase.rpc('update_playlist_media', {
            input_playlist_id: playlistId,
            media_id: mediaId,
            is_movie: isMovie,
        });
        if (error) {
            console.error("Error updating playlist:", error);
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
          className="w-full p-2 rounded mb-4 accent"
        />
        <button onClick={handleSearch} className="px-4 py-2 bg-blue-500 text-white rounded">
          Search
        </button>

        {/* Display search results here */}
        <div className="mt-4">
          {searchResults.movie && (
            <div className="flex items-center mb-2 cursor-pointer" onClick={() => addMediaToPlaylist(searchResults.movie, true)}>
              <img
                src={searchResults.movie.image}
                alt={searchResults.movie.title}
                className="w-24 h-36 rounded mr-2"
              />
              <span>{searchResults.movie.title}</span>
            </div>
          )}
          {searchResults.show && (
            <div className="flex items-center mb-2 cursor-pointer" onClick={() => addMediaToPlaylist(searchResults.show, false)}>
              <img
                src={searchResults.show.image}
                alt={searchResults.show.title}
                className="w-24 h-36 rounded mr-2"
              />
              <span>{searchResults.show.title}</span>
            </div>
          )}
          {!searchResults.movie && !searchResults.show && (
            <p className="text-center text-gray-500">No results found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddMedia;
