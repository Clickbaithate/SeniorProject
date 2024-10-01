import React, { useState } from 'react';
import './Sidebar.css'; // Import your existing sidebar styles
import './Logout_Model.css'; // Import the new modal CSS file
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faCompass, faGlasses, faFolder, faUserGroup, faAward, faGear, faArrowRightFromBracket, faUser } from "@fortawesome/free-solid-svg-icons";
import { NavLink } from 'react-router-dom';
import supabase from '../config/supabaseClient';

const Sidebar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
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
        <div className="sidebar">
          <div className="sidebar-header">
            <div className="sidebar-logo">
              🍿
            </div>
          </div>
          <nav className="sidebar-nav">
            <ul>
              <li>
                <NavLink to="/homePage" className="active-link">
                  <FontAwesomeIcon icon={faHouse} />
                </NavLink>
              </li>
              <li>
                <NavLink to="/discover" className="active-link">
                  <FontAwesomeIcon icon={faCompass} />
                </NavLink>
              </li>
              <li><FontAwesomeIcon icon={faGlasses} /></li>
              <li><FontAwesomeIcon icon={faFolder} /></li>
              <li>
                <NavLink to="/friendsPage" className="active-link">
                  <FontAwesomeIcon icon={faUserGroup} />
                </NavLink>
              </li>
              <li><FontAwesomeIcon icon={faAward} /></li>
              <li>
                <NavLink to="/settings" className="active-link">
                  <FontAwesomeIcon icon={faGear} />
                </NavLink>
              </li>
              <li>
                <button onClick={handleLogoutClick} className="logout-icon">
                  <FontAwesomeIcon icon={faArrowRightFromBracket} />
                </button>
              </li>
            </ul>
          </nav>
          <div className="sidebar-footer"></div>
        </div>

        {/* Modal for confirming logout */}
        {isModalOpen && (
          <div className="modal-overlay">
            <div className="modal-box">
              <h2 className="modal-title">Confirm Logout</h2>
              <p className="modal-text">Are you sure you want to log out?</p>
              <div className="button-container">
                <button 
                  onClick={handleCloseModal} 
                  className="modal-button cancel-button"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleConfirmLogout} 
                  className="modal-button logout-button"
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
