import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faCompass, faGlasses, faFolder, faUserGroup, faAward, faGear, faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { NavLink, useLocation } from 'react-router-dom';
import supabase from '../config/supabaseClient';
import logo from '../assets/logo.png';
import { useNavigate } from "react-router-dom";
import "./theme.css";

const Sidebar = () => {
  
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [currentPixels, setCurrentPixels] = useState(192); // Initial position
  const [loading, setLoading] = useState(true); // Loading state
  const location = useLocation(); // Get current location

  // Map page paths to page indices
  const pageMappings = {
    '/homePage': 0,
    '/discover': 1,
    '/watched': 2,
    '/playlists': 3,
    '/friends': 4,
    '/challenges': 5,
    '/settings': 6,
  };

  const updateIndicatorPosition = (page) => {
    switch (page) {
      case 0:
        setCurrentPixels(192);
        break;
      case 1:
        setCurrentPixels(225);
        break;
      case 2:
        setCurrentPixels(320);
        break;
      case 3:
        setCurrentPixels(355);
        break;
      case 4:
        setCurrentPixels(450);
        break;
      case 5:
        setCurrentPixels(482);
        break;
      case 6:
        setCurrentPixels(576);
        break;
      default:
        setCurrentPixels(192);
        break;
    }
  };

  // Update the current page indicator based on URL path
  useEffect(() => {
    const currentPage = pageMappings[location.pathname] || 0; // Default to 0 if no match
    updateIndicatorPosition(currentPage);
    setLoading(false); // Set loading to false once the effect runs
  }, [location]); // Run this effect whenever the URL changes

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      document.documentElement.setAttribute('data-theme', 'light');
      // Optionally, redirect the user after logout
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleLogoutClick = () => {
    setIsModalOpen(true); // Show the modal when the logout button is clicked
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Hide the modal
  };

  const handleConfirmLogout = () => {
    handleLogout(); // Proceed with logout
    setIsModalOpen(false); // Hide modal after logout
  };

  return (
    <div>
      {/* Main content */}
      <div>
        <div className={`fixed left-0 top-0 h-screen w-[100px] accent `}>

          {/* Logo */}
          <div onClick={() => {navigate("/home")}} className="flex justify-center mt-4 cursor-pointer">
            <img src={logo} className="mt-4 h-24 w-24" alt="logo" />
          </div>

          {/* Current Page Indicator (only show when not loading) */}
          {!loading && (
            <div 
              className={`fixed transition-all left-0 h-8 w-2 rounded-tr-lg rounded-br-lg indicator `}
              style={{ top: `${currentPixels}px` }} // Dynamic inline style for position
            />
          )}

          <nav className="flex flex-col items-center justify-center">
            <ul className="space-y-6 mt-6 text-center">

              <li className={`font-body text-theme `}>Explore</li>
              <div className="space-y-2" >
                {/* Home and Discover Icons */}
                <li>
                  <NavLink className={`text-theme`} to="/homePage">
                    <FontAwesomeIcon icon={faHouse} />
                  </NavLink>
                </li>
                <li>
                  <NavLink className={`text-theme`} to="/discover">
                    <FontAwesomeIcon icon={faCompass} />
                  </NavLink>
                </li>
              </div>

              <li className={`font-body text-theme `}>Discover</li>
              <div className="space-y-2" >
                {/* Watched and Playlists Icons */}
                <li>
                  <NavLink className={`text-theme`} to="/watched">
                    <FontAwesomeIcon icon={faGlasses} />
                  </NavLink>
                </li>
                <li>
                  <NavLink className={`text-theme`} to="/playlists">
                    <FontAwesomeIcon icon={faFolder} />
                  </NavLink>
                </li>
              </div>

              <li className={`font-body text-theme `}>Library</li>
              <div className="space-y-2" >
                {/* Friends and Challenges Icons */}
                <li>
                  <NavLink className={`text-theme`} to="/friends">
                    <FontAwesomeIcon icon={faUserGroup} />
                  </NavLink>
                </li>
                <li>
                  <NavLink className={`text-theme`} to="/challenges">
                    <FontAwesomeIcon icon={faAward} />
                  </NavLink>
                </li>
              </div>

              <li className={`font-body text-theme `}>Settings</li>
              <div className="space-y-2" >
                {/* Settings and Logout Icons */}
                <li>
                  <NavLink className={`text-theme`} to="/settings">
                    <FontAwesomeIcon icon={faGear} />
                  </NavLink>
                </li>
                <li>
                  <button className={`text-theme`} onClick={handleLogoutClick}>
                    <FontAwesomeIcon icon={faArrowRightFromBracket} />
                  </button>
                </li>
              </div>

            </ul>
          </nav>
        </div>

        {/* Modal for confirming logout */}
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
            <div className="bg-theme p-6 rounded-xl shadow-md w-[380px] text-center">
              <h2 className="text-3xl text-theme mb-4 font-body">Confirm Logout</h2>
              <p className="text-theme mb-6 font-body">Are you sure you want to log out?</p>
              <div className="flex justify-between px-4 ">
                <button 
                  onClick={handleCloseModal} 
                  className="px-6 py-3 rounded-lg cursor-pointer border-none font-body accent"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleConfirmLogout} 
                  className="px-6 py-3 rounded-lg cursor-pointer border-none font-body bg-[#0376F2]"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
