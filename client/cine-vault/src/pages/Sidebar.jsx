import React, { useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faCompass, faGlasses, faFolder, faUserGroup, faAward, faGear, faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { NavLink, useNavigate } from 'react-router-dom';
import supabase from '../config/supabaseClient';
import logo from '../assets/logo.png';
import "./theme.css";

const Sidebar = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      document.documentElement.setAttribute('data-theme', 'light');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleLogoutClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleConfirmLogout = () => {
    handleLogout();
    setIsModalOpen(false);
  };

  return (
    <div>
      {/* Background Blur Overlay */}
      <div
        className={`fixed inset-0 transition-all duration-300 ease-in-out bg-black ${isHovered ? 'bg-opacity-50 backdrop-blur-sm' : 'bg-opacity-0 backdrop-blur-0'} z-39`}
      ></div>

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-screen accent ${isHovered ? 'w-[150px] rounded-tr-2xl rounded-br-2xl' : 'w-[100px]'} z-20 transition-all duration-300 ease-in-out `}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >

        <div onClick={() => navigate("/home")} className="flex justify-center mt-4 cursor-pointer">
          <img src={logo} className="mt-4 h-24 w-24" alt="logo" />
        </div>

        <nav className="flex flex-col justify-center">
          <ul className="space-y-4 mt-6 text-center">
            <li className="mx-2 rounded-md hover:bg-gray-500 hover:bg-opacity-50 bg-transparent">
              <NavLink className="flex items-center justify-center font-body" to="/homePage">
                <div className="p-2 rounded-full">
                  <FontAwesomeIcon icon={faHouse} className="text-blue-500" />
                </div>
                {isHovered && (
                  <span className="bg-transparent text-theme px-2 whitespace-nowrap">Home</span>
                )}
              </NavLink>
            </li>

            <li className="mx-2 rounded-md hover:bg-gray-500 hover:bg-opacity-50 bg-transparent">
              <NavLink className="flex items-center justify-center font-body" to="/discover">
                <div className="p-2 rounded-full">
                  <FontAwesomeIcon icon={faCompass} className="text-orange-500" />
                </div>
                {isHovered && (
                  <span className="bg-transparent text-theme px-2 whitespace-nowrap">Discover</span>
                )}
              </NavLink>
            </li>

            <li className="mx-2 rounded-md hover:bg-gray-500 hover:bg-opacity-50 bg-transparent">
              <NavLink className="flex items-center justify-center font-body" to="/watched">
                <div className="p-2 rounded-full">
                  <FontAwesomeIcon icon={faGlasses} className="text-red-500" />
                </div>
                {isHovered && (
                  <span className="bg-transparent text-theme px-2 whitespace-nowrap">Watched</span>
                )}
              </NavLink>
            </li>

            <li className="mx-2 rounded-md hover:bg-gray-500 hover:bg-opacity-50 bg-transparent">
              <NavLink className="flex items-center justify-center font-body" to="/playlists">
                <div className="p-2 rounded-full">
                  <FontAwesomeIcon icon={faFolder} className="text-green-500" />
                </div>
                {isHovered && (
                  <span className="bg-transparent text-theme px-2 whitespace-nowrap">Playlists</span>
                )}
              </NavLink>
            </li>

            <li className="mx-2 rounded-md hover:bg-gray-500 hover:bg-opacity-50 bg-transparent">
              <NavLink className="flex items-center justify-center font-body" to="/friends">
                <div className="p-2 rounded-full">
                  <FontAwesomeIcon icon={faUserGroup} className="text-pink-500" />
                </div>
                {isHovered && (
                  <span className="bg-transparent text-theme px-2 whitespace-nowrap">Friends</span>
                )}
              </NavLink>
            </li>

            <li className="mx-2 rounded-md hover:bg-gray-500 hover:bg-opacity-50 bg-transparent">
              <NavLink className="flex items-center justify-center font-body" to="/challenges">
                <div className="p-2 rounded-full">
                  <FontAwesomeIcon icon={faAward} className="text-purple-500" />
                </div>
                {isHovered && (
                  <span className="bg-transparent text-theme px-2 whitespace-nowrap">Challenges</span>
                )}
              </NavLink>
            </li>

            <li className="mx-2 rounded-md hover:bg-gray-500 hover:bg-opacity-50 bg-transparent">
              <NavLink className="flex items-center justify-center font-body" to="/settings">
                <div className="p-2 rounded-full">
                  <FontAwesomeIcon icon={faGear} className="text-gray-500" />
                </div>
                {isHovered && (
                  <span className="bg-transparent text-theme px-2 whitespace-nowrap">Settings</span>
                )}
              </NavLink>
            </li>

            <li className="mx-2 rounded-md hover:bg-gray-500 hover:bg-opacity-50 bg-transparent">
              <div
                className="flex items-center justify-center font-body cursor-pointer"
                onClick={handleLogoutClick}
              >
                <div className="p-2 ">
                  <FontAwesomeIcon icon={faArrowRightFromBracket} className="text-rose-500" />
                </div>
                {isHovered && (
                  <span className="bg-transparent text-theme px-2 whitespace-nowrap">Logout</span>
                )}
              </div>
            </li>
          </ul>
        </nav>
      </div>

      {/* Logout Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
          <div className="bg-theme p-6 rounded-xl shadow-md w-[380px] text-center">
            <h2 className="text-3xl text-theme mb-4 font-body">Confirm Logout</h2>
            <p className="text-theme mb-6 font-body">Are you sure you want to log out?</p>
            <div className="flex justify-between px-4">
              <button onClick={handleCloseModal} className="px-6 py-2 bg-theme-light text-theme bg-gray-500 border-2 border-transparent hover:border-black rounded-md font-body">
                Cancel
              </button>
              <button onClick={handleConfirmLogout} className="px-6 py-2 bg-blue-500 text-theme bg-transparent hover:bg-blue-500 rounded-md font-body">
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
