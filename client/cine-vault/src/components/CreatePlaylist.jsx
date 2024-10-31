import React, { useState } from "react";
import supabase from '../config/supabaseClient';

const CreatePlaylist = ({ onClose, userId }) => {
  const [playlistDetails, setPlaylistDetails] = useState({
    title: "",
    imageUrl: "",
    description: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPlaylistDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleCreatePlaylist = async () => {
    if (!playlistDetails.title || !playlistDetails.imageUrl || !playlistDetails.description) {
      alert("Please fill in all fields");
      return;
    }

    const { data, error } = await supabase.from('Playlists').insert([
      {
        user_id: userId, // user ID passed as prop
        title: playlistDetails.title,
        description: playlistDetails.description,
        image: playlistDetails.imageUrl,
      },
    ]);

    if (error) {
      console.error('Error creating playlist:', error);
    } else {
      console.log('Playlist created successfully:', data);
      onClose(); // Close modal on success
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-theme p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-semibold text-font mb-4">Create New Playlist</h2>
        
        {/* Title Input */}
        <input
          type="text"
          name="title"
          placeholder="Playlist Title"
          value={playlistDetails.title}
          onChange={handleInputChange}
          className="w-full p-2 rounded mb-4 accent"
        />

        {/* Image URL Input */}
        <input
          type="text"
          name="imageUrl"
          placeholder="Image URL"
          value={playlistDetails.imageUrl}
          onChange={handleInputChange}
          className="w-full p-2 rounded mb-4 accent"
        />

        {/* Description Input */}
        <textarea
          name="description"
          placeholder="Description"
          value={playlistDetails.description}
          onChange={handleInputChange}
          className="w-full p-2 rounded mb-4 accent"
          rows="3"
        />

        {/* Action Buttons */}
        <div className="flex justify-end space-x-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
            Cancel
          </button>
          <button
            onClick={handleCreatePlaylist}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePlaylist;
