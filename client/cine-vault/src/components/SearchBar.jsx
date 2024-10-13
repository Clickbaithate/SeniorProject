import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import supabase from '../config/supabaseClient';
import errorImage from '../assets/placeholder.jpg'
import "../pages/theme.css";

// Dark #2D2E39
// Dark Contrast #25262F

// Light #FFFFFF
// Light Contrast #E4E4E4

// You have to at least pass in a theme parameter
const SearchBar = ({ placeholder = "Search..." }) => {
 
    const [loading, setLoading] = useState(true);
    const [username, setUsername] = useState('');
    const [profilePicture, setProfilePicture] = useState('');
    
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();

  // Navigate to the search page by passing in the query
  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/searchPage/${searchText}`)
  };

  const handleProfileClick = () => {
    navigate("/settings");
  }

  useEffect(() => {
    // Check for a stored theme preference in local storage
    const savedTheme = localStorage.getItem('theme');

    // Set the theme to light mode if no preference is found
    if (!savedTheme) {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.setAttribute('data-theme', savedTheme);
    }
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError) {
        console.warn(sessionError);
        setLoading(false);
        return;
      }

      if (session) {
        const { data, error } = await supabase
          .from('Users')
          .select('username, bio, profile_picture')
          .eq('user_id', session.user.id)
          .single();

        if (error) {
          console.warn('Error fetching profile:', error);
        } else if (data) {
          setUsername(data.username);
          setProfilePicture(data.profile_picture);
        }
      }
      setLoading(false);
    };

    fetchProfile();
  }, []);

  return (
    <div className={`flex items-center justify-end p-6 bg-theme `}>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className={`flex items-center shadow-[rgba(0,0,15,0.5)_10px_5px_4px_0px] border-[3px] accent-border rounded-xl p-4 w-1/4 mr-96`}>
        <button type="button" onClick={handleSearch}>
          <FontAwesomeIcon icon={faSearch} className={`ml-2 text-gray-500`} />
        </button>
        <input
          type="text"
          placeholder={placeholder}
          className={`bg-transparent font-body ml-4 text-sm outline-none w-full `}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)} 
        />
      </form>
      {/* Search Bar */}

      {/* Profile Button */}
      <div 
        onClick={handleProfileClick} 
        className={`transition-all ease-in-out duration-500 border-[3px] accent-border transform hover:scale-110 cursor-pointer flex items-center mr-6 p-2 px-4 rounded-xl shadow-[rgba(0,0,15,0.5)_10px_5px_4px_0px] ml-4 `}
      >
        <img 
          src={profilePicture || errorImage} 
          className="w-10 h-10 rounded-full mr-2" 
        />
        <span 
          className={`text-sm font-body ml-2 m-2 `}
        >
          {username || ""}
        </span>
      </div>
      {/* Profile Button */}
    </div>
  );
};

export default SearchBar;
