import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import supabase from '../config/supabaseClient';

// Dark #2D2E39
// Dark Contrast #25262F

// Light #FFFFFF
// Light Contrast #E4E4E4

// You have to at least pass in a theme parameter
const SearchBar = ({ placeholder = "Search...", theme }) => {
 
    const [loading, setLoading] = useState(true);
    const [username, setUsername] = useState('');
    const [bio, setBio] = useState('');
    const [profilePicture, setProfilePicture] = useState('');
    const [message, setMessage] = useState('');
    const [isToggled, setIsToggled] = useState(
      localStorage.getItem('theme') === 'dark'
    );
    
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();

  // Here we would navigate to the search page by passing in the query thing
  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/searchPage/${searchText}`)
  };

  const handleProfileClick = () => {
    navigate("/settings");
  }
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
          .select('username, bio, profile_picture, theme_settings')
          .eq('user_id', session.user.id)
          .single();

        if (error) {
          console.warn('Error fetching profile:', error);
        } else if (data) {
          setUsername(data.username);
          setBio(data.bio);
          setProfilePicture(data.profile_picture);
          setIsToggled(data.theme_settings); // Set the toggle state based on database value
          const theme = data.theme_settings ? 'dark' : 'light';
          document.documentElement.setAttribute('data-theme', theme);
          localStorage.setItem('theme', theme); // Sync local storage with database value
        }
      }
      setLoading(false);
    };

    fetchProfile();
  }, []);
  return (
    <div className={`flex items-center justify-end p-6 mr-6 ${theme === "light" ? "bg-[#FFFFFF]" : "bg-[#2D2E39]"}`}>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className={`flex items-center shadow-[rgba(0,0,15,0.5)_10px_5px_4px_0px] ${theme === "light" ? "bg-[#E4E4E4]" : "bg-[#25262F]"} rounded-xl p-4 w-1/4 mr-96`}>
        <button type="button" onClick={handleSearch}>
          <FontAwesomeIcon icon={faSearch} className={`ml-2 text-gray-500 `} />
        </button>
        <input
          type="text"
          placeholder={placeholder}
          className={`bg-transparent font-body ml-4 text-sm outline-none w-full ${theme === "light" ? "text-[#2D2E39]" : "text-[#FFFFFF]"} `}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)} 
        />
      </form>
      {/* Search Bar */}
      
      {/* Profile Button */}
      <div 
  onClick={handleProfileClick} 
  className={`transition-all ease-in-out duration-500 transform hover:scale-110 cursor-pointer flex items-center p-2 rounded-xl shadow-[rgba(0,0,15,0.5)_10px_5px_4px_0px] ml-4 ${theme === "light" ? "bg-[#E4E4E4]" : "bg-[#25262F]"}`}
>
  <img 
    src={profilePicture || "https://cdn.marvel.com/content/1x/301kng_com_crd_01.jpg"} 
    alt="Avatar" 
    className="w-10 h-10 rounded-full" 
  />
  <span 
    className={`text-sm font-body ml-2 m-2 ${theme === "light" ? "text-[#2D2E39]" : "text-[#FFFFFF]"}`}
  >
    {username || "Jonathan Myers"}
  </span>
</div>
      {/* Profile Button */}

    </div>
  );
};

export default SearchBar;
