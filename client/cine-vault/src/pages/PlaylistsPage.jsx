import React from 'react';
import Sidebar from './Sidebar';
import SearchBar from '../components/SearchBar';
import { useEffect, useState } from 'react';
import supabase from '../config/supabaseClient';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import "./theme.css";
import HorizontalList from '../components/HorizontalList';
import PlaylistCard from '../components/PlaylistCard';
import create from "../assets/create.jpg";

const popularPlaylists = [
  {
    id: 1, 
    image: "https://static.displate.com/1200x857/displate/2023-02-20/ce0823168185db6a7d1285bb195e2e8c_44f10645b8dea479c868ff4057d55105.jpg",
    title: "Everything Marvel"
  },
  {
    id: 2, 
    image: "https://pbs.twimg.com/media/FvnRS1tXwAMZTN-.jpg",
    title: "Christopher Nolan Movies"
  },
  {
    id: 3,
    image: "https://cdna.artstation.com/p/assets/images/images/003/205/438/large/anderson-vieira-banner-starwars.jpg?1471027030",
    title: "Star Wars Saga"
  },
  {
    id: 4,
    image: "https://i.pinimg.com/736x/99/9f/03/999f03d2cf0fdf405dcb2d6e6641a0ad.jpg",
    title: "Horror Films"
  },
  {
    id: 5,
    image: "https://static.vecteezy.com/system/resources/previews/001/821/684/non_2x/christmas-banner-for-present-product-with-christmas-tree-on-red-background-text-merry-christmas-and-happy-new-year-free-vector.jpg",
    title: "Christmas Vibes"
  },
];

const PlaylistPage = () => {

  const [searchText, setSearchText] = useState("");
  const [filterCount, setFilterCount] = useState(0);
  const [playlist, setPlaylist] = useState([]);
  const [user, setUser] = useState(null);

  const handleSearch = () => {
    console.log(searchText);
  }

  const handleFilter = () => {
    console.log("FILTER BUTTON!");
  }

  const incrementFilterCount = () => {
    setFilterCount(prevCount => prevCount + 1);
  }

  const decrementFilterCount = () => {
    setFilterCount(prevCount => prevCount - 1);
  }

  const handlePlaylistClick = (playlist) => {
    console.log(playlist);
  }

  useEffect(() => {
    const fetchProfile = async () => {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError) {
        console.warn(sessionError);
        return;
    }

    if (session) {
        const { data, error } = await supabase
        .from('Users')
        .select()
        .eq('user_id', session.user.id)
        .single();

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
        const { data, error } = await supabase
          .from('Playlists')
          .select();
  
        if (error) {
          console.warn('Error fetching Playlists:', error);
        } else if (data) {
          console.log("Playlist Data:", data);
          setPlaylist(data);
        }
      }
    };
    fetchPlaylists();
  }, [user]); // only runs when user changes
  

  // Dark #2D2E39
  // Dark Contrast #25262F

  // Light #FFFFFF
  // Light Contrast #E4E4E4

  return (

    <div className={`min-h-screen ml-[100px] bg-theme `}>

      <Sidebar></Sidebar>
      <SearchBar></SearchBar>
      {/* Page Title */}
      <h1 className={`text-4xl font-body py-2 ml-12  `}>Movie Playlists</h1>
      {/* Filters, etc */}
      <div className={`flex items-center justify-between px-16 font-body pt-4`}>
        <h1 className={`font-body text-xl `} >Popular Playlists</h1>
        <div className="flex items-center space-x-4 " >
          {/* Filter Counter */}
          <div className={`h-8 w-8 flex items-center justify-center border rounded-full font-body shadow-[rgba(0,0,15,0.5)_10px_5px_4px_0px]  `} >
            {filterCount}
          </div>
          {/* Filter Button */}
          <div onClick={handleFilter} className={`font-body cursor-pointer border w-18 h-10 p-4 flex items-center justify-center rounded-lg shadow-[rgba(0,0,15,0.5)_10px_5px_4px_0px]  `} >
            Add Filter
          </div>
          {/* Filter Search */}
          <form onSubmit={handleSearch} className={`flex border items-center rounded-lg p-2 w-64 shadow-[rgba(0,0,15,0.5)_10px_5px_4px_0px] `}>
            <button type="button" onClick={handleSearch} className="mr-2">
              <FontAwesomeIcon icon={faSearch} className="text-gray-500" />
            </button>
            <input
              type="text"
              placeholder="Search your playlists..."
              className={`w-full focus:outline-none bg-transparent font-body `}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </form>

        </div>
      </div>

      <HorizontalList playlists={playlist} />

      <div className="flex items-center justify-between px-16">
        <h1 className={`font-body pt-8 pb-8 text-xl `} >Your Playlists</h1>
        <div onClick={() => {console.log("Creating new playlist...")}} className="font-body text-lg bg-theme p-2 rounded-lg border cursor-pointer shadow-[rgba(0,0,15,0.5)_10px_5px_4px_0px] ">
          Create New Playlist
        </div>
      </div>

      <div className="grid grid-cols-4 gap-y-16 ml-16 pr-6 ">
        
        <div
        className="transition-all ease-in-out duration-500 transform hover:scale-105 w-[350px] h-56 bg-transparent flex-shrink-0 cursor-pointer"
      >
        <img
          src={create}
          className="w-full h-full object-fit mb-2 rounded-2xl"
        />
        <h2 className="text-md truncate mx-2 font-body font-semibold text-theme">
          Create New Playlist
        </h2>
      </div>

        {playlist.map((playlist, index) => (
          <PlaylistCard playlist={playlist} key={index} />
        ))}
      </div>

      <div className="h-16" />


    </div>

  );
};

export default PlaylistPage;