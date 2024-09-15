import React from 'react';
import './Sidebar.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faCompass, faGlasses, faFolder, faUserGroup, faAward, faGear, faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          🍿
        </div>
      </div>
      <nav className="sidebar-nav">
        <ul>
          <li>
            <NavLink exact to="/homePage" activeClassName="active-link">
            <FontAwesomeIcon icon={faHouse} />
            </NavLink>
            </li>
          <li>
          <NavLink to="/discover" activeClassName="active-link">
            <FontAwesomeIcon icon={faCompass} />
            </NavLink>
            </li>
          <li><FontAwesomeIcon icon={faGlasses} /></li>
          <li><FontAwesomeIcon icon={faFolder} /></li>
          <li><FontAwesomeIcon icon={faUserGroup} /></li>
          <li><FontAwesomeIcon icon={faAward} /></li>
          <li><FontAwesomeIcon icon={faGear} /></li>
          <li><FontAwesomeIcon icon={faArrowRightFromBracket} /></li>
        </ul>
      </nav>
      <div className="sidebar-footer">
      </div>
    </div>
  );
};

export default Sidebar;
