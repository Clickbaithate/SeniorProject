import React, { useState, useEffect, useRef } from 'react';
import { faB, faSearch } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import supabase from '../config/supabaseClient';
import errorImage from '../assets/placeholder.jpg';
import "../pages/theme.css";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const SearchBar = ({ placeholder = "Search...", handleNotificationUpdate }) => {
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();
  
  const [usernames, setUsernames] = useState({}); // all usernames of people requesting you
  const [profilePictures, setProfilePictures] = useState({});
  const [showDropdown, setShowDropdown] = useState(false); // Dropdown visibility
  const dropdownRef = useRef(null); // Reference for click outside handling

  const handleNotificationClick = () => {
    setShowDropdown((prev) => !prev); // Toggle dropdown visibility
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchPendingRequests = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError || !session) return;
  
        const authenticatedUserId = session.user.id;
  
        // Fetch all rows where the user is either user_id or friend_id
        const { data: friendRequestData, error: friendRequestError } = await supabase
          .from("Friends")
          .select("status, user_id, friend_id, relationship_id") // Include relationship_id
          .or(`user_id.eq.${authenticatedUserId},friend_id.eq.${authenticatedUserId}`);
  
        if (friendRequestError) {
          console.error("Error fetching friend requests:", friendRequestError);
          return;
        }
  
        const groupedRequests = {};
  
        // Group by unique friendship (unordered pair of user_id and friend_id)
        friendRequestData.forEach((row) => {
          const key =
            row.user_id < row.friend_id
              ? `${row.user_id}-${row.friend_id}`
              : `${row.friend_id}-${row.user_id}`;
          if (!groupedRequests[key]) groupedRequests[key] = [];
          groupedRequests[key].push(row);
        });
  
        const validPendingNotifications = [];
  
        Object.values(groupedRequests).forEach((relationship) => {
          const hasAcceptedOrRejected = relationship.some(
            (row) => row.status === "accepted" || row.status === "rejected"
          );
  
          if (hasAcceptedOrRejected) {
            // Skip this friendship if accepted or rejected
            return;
          }
  
          // Check if there is a pending request where the authenticated user is the receiver
          const pendingRequests = relationship.filter(
            (row) => row.status === "pending" && row.friend_id === authenticatedUserId
          );
  
          validPendingNotifications.push(...pendingRequests);
        });
  
        setNotifications(validPendingNotifications);
      } catch (err) {
        console.error("Error fetching pending requests:", err.message);
      }
    };
  
    fetchPendingRequests();
  }, []);
  
  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/searchPage/${searchText}`)
  };

  const handleProfileClick = () => {
    navigate("/settings");
  };

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

  const fetchUsernameAndPicture = async (id) => {
    const { data, error } = await supabase
      .from("Users")
      .select("username, profile_picture")
      .eq("user_id", id)
      .single();
    if (error) console.error("Error Fetching Username & Picture: ", error);
    else if (data) return data;
  };

  useEffect(() => {
    const fetchUsernames = async () => {
      const usernamesMap = {};
      const profilePicturesMap = {};

      for (const notification of notifications) {
        const userData = await fetchUsernameAndPicture(notification.user_id);
        if (userData) {
          usernamesMap[notification.user_id] = userData.username || "Unknown User";
          profilePicturesMap[notification.user_id] = userData.profile_picture || errorImage;
        }
      }

      setUsernames(usernamesMap);
      setProfilePictures(profilePicturesMap);
    };

    if (notifications.length > 0) {
      fetchUsernames();
    }
  }, [notifications]);

  const respondToFriendRequest = async (relationshipId, action) => {
    try {
      const status = action === "accepted" ? "accepted" : "rejected";
  
      // Update the relationship status in the Supabase table
      const { error } = await supabase
        .from("Friends")
        .update({ status })
        .eq("relationship_id", relationshipId);
  
      if (error) {
        console.error("Error updating friend request status:", error.message);
        console.log("ID: ", relationshipId, "Action: ", action)
        return;
      }
  
      console.log(`Friend request ${status} successfully.`);
      
      setNotifications((prevNotifications) =>
        prevNotifications.filter((notification) => notification.relationship_id !== relationshipId)
      );
      handleNotificationUpdate(status);
      console.log(status);
    } catch (err) {
      console.error("Error responding to friend request:", err.message);
    }
  };

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

  return (
    <div className="flex items-center justify-end p-6 bg-theme">
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex items-center shadow-[rgba(0,0,15,0.5)_10px_5px_4px_0px] border-[3px] accent-border rounded-xl p-4 w-1/4 mr-96">
        <button type="button" onClick={handleSearch}>
          <FontAwesomeIcon icon={faSearch} className="ml-2 text-gray-500" />
        </button>
        <input
          type="text"
          placeholder={placeholder}
          className="bg-transparent font-body ml-4 text-sm outline-none w-full"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </form>

      {/* Profile & Notifications */}
      <div className="flex items-center">
        {/* Profile Button */}
        <div 
          onClick={handleProfileClick} 
          className="transition-all ease-in-out duration-500 border-[3px] accent-border transform hover:scale-105 cursor-pointer 
            flex items-center mr-6 p-2 px-4 rounded-xl shadow-[rgba(0,0,15,0.5)_10px_5px_4px_0px] ml-4"
        >
          <img src={profilePicture || errorImage} className="w-10 h-10 rounded-full mr-2" />
          <span className="text-sm font-body ml-2 m-2">{username || "......"}</span>
        </div>

        {/* Notifications */}
        <div ref={dropdownRef} className="relative">
          <div
            onClick={handleNotificationClick}
            className="transition-all ease-in-out duration-500 border-[3px] accent-border transform hover:scale-105 cursor-pointer 
              flex items-center justify-center mr-2 w-14 h-14 rounded-xl shadow-[rgba(0,0,15,0.5)_10px_5px_4px_0px] noti"
          >
            <div className="flex">
              <FontAwesomeIcon icon={faBell} />
              <span className={`absolute top-2 right-3 flex h-2 w-2 ${notifications.length > 0 ? "visible" : "invisible"}`}>
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
            </div>
          </div>

          {/* Dropdown Menu */}
          {showDropdown && (
            <div className="absolute right-0 mt-4 mr-2 w-80 rounded-tl-md rounded-bl-md rounded-br-md bg-theme accent-border border-2 shadow-lg z-50">
              {notifications.length > 0 ? (
                <ul className="">
                  {notifications.map((notification, i) => (
                    <li key={i} className="p-2 flex rounded-md items-center justify-between">
                      <div onClick={() => {if (username){navigate(`/user/${usernames[notification.user_id]}`);}}} className="flex items-center cursor-pointer">
                        <img src={profilePictures[notification.user_id] || errorImage} className="w-10 h-10 rounded-full mr-2" />
                        <p className="font-body text-sm text-theme">{usernames[notification.user_id] || "Loading..."}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div onClick={() => respondToFriendRequest(notification.relationship_id, "accepted")} className="bg-green-500 p-1 rounded-md font-body text-theme text-sm cursor-pointer hover:bg-green-600">
                          Accept
                        </div>
                        <div onClick={() => respondToFriendRequest(notification.relationship_id, "rejected")} className="bg-red-500 p-1 rounded-md font-body text-theme text-sm cursor-pointer hover:bg-red-600">
                          Reject
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="p-4 text-sm text-gray-500">No new notifications</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
