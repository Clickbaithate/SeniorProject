import React from 'react';
import Sidebar from './Sidebar';
import SearchBar from '../components/SearchBar';
import { useEffect, useState } from 'react';
import supabase from '../config/supabaseClient';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import "./theme.css";

const popularPlaylists = [
  {
    image: "https://static.displate.com/1200x857/displate/2023-02-20/ce0823168185db6a7d1285bb195e2e8c_44f10645b8dea479c868ff4057d55105.jpg",
    title: "Everything Marvel"
  },
  {
    image: "https://pbs.twimg.com/media/FvnRS1tXwAMZTN-.jpg",
    title: "Christopher Nolan Movies"
  },
  {
    image: "https://cdna.artstation.com/p/assets/images/images/003/205/438/large/anderson-vieira-banner-starwars.jpg?1471027030",
    title: "Star Wars Saga"
  },
  {
    image: "https://i.pinimg.com/736x/99/9f/03/999f03d2cf0fdf405dcb2d6e6641a0ad.jpg",
    title: "Horror Films"
  },
  {
    image: "https://static.vecteezy.com/system/resources/previews/001/821/684/non_2x/christmas-banner-for-present-product-with-christmas-tree-on-red-background-text-merry-christmas-and-happy-new-year-free-vector.jpg",
    title: "Christmas Vibes"
  }
];

const PlaylistPage = () => {

  const [searchText, setSearchText] = useState("");
  const [filterCount, setFilterCount] = useState(0);

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
        }
    }

    };

    fetchProfile();
  }, []);

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
      <div className={`flex items-center justify-end px-12 font-body  `}>
        <div className="flex items-center justify-center space-x-4 " >
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

      <h1 className={`font-body ml-20 pt-8 `} >Popular Playlists</h1>

      <div className="flex cursor-pointer items-center justify-start ml-20 space-x-10 overflow-x-auto py-8 scrollbar-thin scrollbar-track-[#FFFFFF] scrollbar-thumb-[#2D2E39] scrollbar-corner-yellow-500">
        {popularPlaylists.map((playlist, index) => (
          <div onClick={() => handlePlaylistClick(playlist.title)} key={index} className="min-w-96 max-w-96">
            <div className="h-56 rounded-2xl flex-shrink-0" style={{ background: `url(${playlist.image})`, backgroundSize: "cover", backgroundPosition: "center" }} />
            <p className={`mt-2 font-body text-center `}>{playlist.title}</p>
          </div>
        ))}
      </div>


    </div>

  );
};

export default PlaylistPage;