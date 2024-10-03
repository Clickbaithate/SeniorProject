import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

// Dark #2D2E39
// Dark Contrast #25262F

// Light #FFFFFF
// Light Contrast #E4E4E4

// You have to at least pass in a theme parameter
const SearchBar = ({ placeholder = "Search...", theme }) => {
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();

  // Here we would navigate to the search page by passing in the query thing
  const handleSearch = (e) => {
    e.preventDefault();
    console.log(searchText);
  };

  const handleProfileClick = () => {
    navigate("/settings");
  }

  return (
    <div className={`flex items-center justify-end p-6 mr-6 ${theme === "light" ? "bg-[#FFFFFF]" : "bg-[#2D2E39]"}`}>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className={`flex items-center ${theme === "light" ? "bg-[#E4E4E4]" : "bg-[#25262F]"} rounded-xl p-4 w-1/4 mr-96`}>
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
      <div onClick={handleProfileClick} className={`cursor-pointer flex items-center p-2 rounded-xl shadow-md ml-4 ${theme === "light" ? "bg-[#E4E4E4]" : "bg-[#25262F]"} `}>
        <img src="https://cdn.marvel.com/content/1x/301kng_com_crd_01.jpg" alt="Avatar" className="w-10 h-10 rounded-full" />
        <span className={`text-sm font-body ml-2 m-2 ${theme === "light" ? "text-[#2D2E39]" : "text-[#FFFFFF]"} `}>Jonathan Myers</span>
      </div>
      {/* Profile Button */}

    </div>
  );
};

export default SearchBar;
