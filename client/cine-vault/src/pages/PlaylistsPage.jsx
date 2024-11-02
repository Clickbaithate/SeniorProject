import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import SearchBar from '../components/SearchBar';
import supabase from '../config/supabaseClient';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import "./theme.css";
import HorizontalList from '../components/HorizontalList';
import PlaylistCard from '../components/PlaylistCard';
import CreatePlaylist from '../components/CreatePlaylist'; // Import the modal
import create from "../assets/create.jpg";

const PlaylistPage = () => {
  const [searchText, setSearchText] = useState("");
  const [filterCount, setFilterCount] = useState(0);
  const [playlist, setPlaylist] = useState([]);
  const [popularPlaylists, setPopularPlaylists] = useState([]);
  const [user, setUser] = useState(null);
  const [showCreatePlaylist, setShowCreatePlaylist] = useState(false);
  const [filteredPlaylists, setFilteredPlaylists] = useState([]);

  const handleSearch = (text) => {
    setFilteredPlaylists(
      text.trim()
        ? playlist.filter((item) =>
            item.title.toLowerCase().includes(text.toLowerCase())
          )
        : playlist
    );
  };

  const handleFilter = () => {
    console.log("FILTER BUTTON!");
    if (filterCount == 0) setFilterCount((prevCount) => prevCount + 1);
    else setFilterCount((prevCount) => prevCount - 1);
  };

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) {
        console.warn(sessionError);
        return;
      }
      if (session) {
        const { data, error } = await supabase.from('Users').select().eq('user_id', session.user.id).single();
        if (error) {
          console.warn('Error fetching profile:', error);
        } else if (data) {
          setUser(data.user_id);
        }
      }
    };
    fetchProfile();
  });

  useEffect(() => {
    const fetchPlaylists = async () => {
      if (user) {
        const { data, error } = await supabase.from('Playlists').select();
        if (error) {
          console.warn('Error fetching Playlists:', error);
        } else if (data) {
          setPlaylist(data);
        }
      }
    };
    fetchPlaylists();
  }, [user, showCreatePlaylist]);

  useEffect(() => {
    const fetchPopularPlaylists = async () => {
      if (user) {
        const { data, error } = await supabase.from('Playlists').select().gt('likes', 0);
        if (error) {
          console.warn('Error fetching Playlists:', error);
        } else if (data) {
          setPopularPlaylists(data);
        }
      }
    };
    fetchPopularPlaylists();
  }, [user]);

  return (
    <div className="min-h-screen ml-[100px] bg-theme">
      <Sidebar />
      <SearchBar />

      <h1 className="text-4xl font-body py-2 ml-12">Movie Playlists</h1>

      <div className="flex items-center justify-between px-16 font-body pt-4">
        <h1 className="font-body text-xl">Popular Playlists</h1>
        <div className="flex items-center space-x-4">
          <div className="h-8 w-8 flex items-center justify-center border rounded-full font-body shadow-[rgba(0,0,15,0.5)_10px_5px_4px_0px]">
            {filterCount}
          </div>
          <div
            onClick={handleFilter}
            className="font-body cursor-pointer border w-18 h-10 p-4 flex items-center justify-center rounded-lg shadow-[rgba(0,0,15,0.5)_10px_5px_4px_0px]"
          >
            Add Filter
          </div>
          <form className="flex border items-center rounded-lg p-2 w-64 shadow-[rgba(0,0,15,0.5)_10px_5px_4px_0px]">
            <button type="button" onClick={handleSearch} className="mr-2">
              <FontAwesomeIcon icon={faSearch} className="text-gray-500" />
            </button>
            <input
              type="text"
              placeholder="Search your playlists..."
              className="w-full focus:outline-none bg-transparent font-body"
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value); 
                handleSearch(e.target.value);
              }}
            />
          </form>
        </div>
      </div>

      <HorizontalList playlists={popularPlaylists} />

      <div className="flex items-center justify-between px-16">
        <h1 className="font-body pt-8 pb-8 text-xl">Your Playlists</h1>
        <div
          onClick={() => setShowCreatePlaylist(true)} // Open modal
          className="font-body text-lg bg-theme p-2 rounded-lg border cursor-pointer shadow-[rgba(0,0,15,0.5)_10px_5px_4px_0px]"
        >
          Create New Playlist
        </div>
      </div>

      <div className="grid grid-cols-4 gap-y-16 ml-16">
        {(filteredPlaylists.length > 0 ? filteredPlaylists : playlist).map((playlist, index) => (
          <PlaylistCard playlist={playlist} key={index} />
        ))}
      </div>

      {showCreatePlaylist && (
        <CreatePlaylist onClose={() => setShowCreatePlaylist(false)} userId={user} /> // Render modal
      )}

      <div className="h-16" />
    </div>
  );
};

export default PlaylistPage;
