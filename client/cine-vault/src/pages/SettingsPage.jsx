import React, { useEffect, useState } from 'react';
import supabase from '../config/supabaseClient';
import Sidebar from './Sidebar';
import Switch from '../components/Switch.jsx';
import "../App.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons";
import "./theme.css";

const SettingsPage = ({ onProfileComplete }) => {

  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const [message, setMessage] = useState('');
  const [isToggled, setIsToggled] = useState(localStorage.getItem('theme') === 'dark');
  const [sidebarKey, setSidebarKey] = useState(0); // State to force sidebar re-render
  const [pendingRequests, setPendingRequests] = useState([]);
  const [friends, setFriends] = useState([]);

  // Fetch Friends List
  const fetchFriendsList = async (userId) => {
    try {
      const { data, error } = await supabase
        .from("Friends")
        .select("friend_id, user_id")
        .or(`user_id.eq.${userId},friend_id.eq.${userId}`)
        .eq("status", "accepted");

      if (error) throw error;

      const friendIds = data.map((row) => (row.friend_id === userId ? row.user_id : row.friend_id));
      const { data: friends, error: friendError } = await supabase
        .from("Users")
        .select("user_id, username, profile_picture")
        .in("user_id", friendIds);

      if (friendError) throw friendError;
      return friends || [];
    } catch (err) {
      console.error("Error fetching friends list:", err.message);
      return [];
    }
  };

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
        return;
      }
  
      console.log(`Friend request ${status} successfully.`);
      
      // Optionally update the UI
      setPendingRequests((prevRequests) =>
        prevRequests.filter((request) => request.relationship_id !== relationshipId)
      );
  
      if (status === "accepted") {
        // Optionally add the accepted friend to the friends list
        const updatedRequest = pendingRequests.find(
          (request) => request.relationship_id === relationshipId
        );
        if (updatedRequest) {
          setFriends((prevFriends) => [
            ...prevFriends,
            {
              user_id: updatedRequest.user_id,
              username: "New Friend Username", // You can fetch or update the friend's username
              profile_picture: "New Friend Picture", // Update the profile picture if available
            },
          ]);
        }
      }
    } catch (err) {
      console.error("Error responding to friend request:", err.message);
    }
  };

  // Fetch profile and theme settings from Supabase
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
          .select('user_id, username, bio, profile_picture, theme_settings')
          .eq('user_id', session.user.id)
          .single();

        if (error) {
          console.warn('Error fetching profile:', error);
        } else if (data) {
          setUsername(data.username);
          setBio(data.bio);
          setProfilePicture(data.profile_picture);
          fetchFriendsList(data.user_id).then(setFriends);
          fetchPendingRequests(data.user_id).then(setPendingRequests);
          setIsToggled(data.theme_settings); // Set the toggle state based on database value
          const theme = data.theme_settings ? 'dark' : 'light';
          document.documentElement.setAttribute('theme-data', theme);
          localStorage.setItem('theme', theme); // Sync local storage with database value
        }
      }
      setLoading(false);
    };

    fetchProfile();
  }, []);

  const fetchPendingRequests = async (userId) => {
    try {
      const { data, error } = await supabase
        .from("Friends")
        .select("relationship_id, user_id, friend_id")
        .eq("friend_id", userId)
        .eq("status", "pending");

      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error("Error fetching pending requests:", err.message);
      return [];
    }
  };

  // Update the theme on the page when the toggle changes
  useEffect(() => {
    const theme = isToggled ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme); // Save the theme preference
  }, [isToggled]);

  // Update theme settings in Supabase when toggled
  const handleThemeToggle = async () => {
    setIsToggled((prev) => {
      const newToggle = !prev;
      setSidebarKey((key) => key + 1); // Update sidebar key to trigger re-render
      return newToggle;
    });

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const { error } = await supabase
        .from('Users')
        .update({ theme_settings: !isToggled }) // Update the theme setting in the database
        .eq('user_id', session.user.id);

      if (error) {
        console.error('Error updating theme settings:', error);
      }
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  // Handle profile update
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError) {
        console.warn('Session error:', sessionError);
        setMessage(`Error: ${sessionError.message}`);
        setLoading(false);
        return;
      }

      const email = session.user.email;  // Get email from session

      const { error } = await supabase
        .from('Users')
        .upsert({
          user_id: session.user.id,
          email: email,
          username: username,
          bio: bio,
          profile_picture: profilePicture,
        });

      if (error) throw error;

      setMessage('Profile updated successfully!');
      onProfileComplete();
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`flex min-h-screen flex-col ml-[100px] pt-4 overflow-hidden bg-theme`}>
      <Sidebar key={sidebarKey} /> {/* Force sidebar re-render when theme changes */}
      <div className="flex flex-1">
        <div className="flex flex-col w-4/12 pl-10 justify-start text-theme">
          <h2 className="text-4xl font-body mb-6 pt-6">Settings</h2>
          <h2 className="text-xl mb-4 ml-8 font-body">Basic Details</h2>
          <h2 className="text-xl mb-2 ml-8 absolute top-3/4 font-body">Theme Settings</h2>
        </div>

        <div className="flex flex-1 justify-end pr-20 mt-24">
          <div className="w-full max-w-lg">
            <div className="flex mb-6">
              <img
                src={profilePicture || 'https://via.placeholder.com/100'}
                alt="Profile"
                className="w-24 h-24 rounded-full border-2 border-blue-400 object-cover"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="profilePicture" className="block text-sm font-medium mb-1">
                Profile Picture URL
              </label>
              <input
                id="profilePicture"
                type="url"
                value={profilePicture}
                onChange={(e) => setProfilePicture(e.target.value)}
                className={`h-10 w-full rounded-md px-3 text-theme accent`}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="username" className="block text-sm font-medium mb-1 text-theme">
                Username
              </label>
              <input
                id="username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={`h-10 w-full rounded-md px-3 text-theme accent`}
              />
            </div>

            <div className="">
              <label htmlFor="bio" className="block text-sm font-medium mb-1 text-theme">
                Bio
              </label>
              <textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className={`h-24 w-full rounded-md px-3 py-2 text-theme accent`}
              />
            </div>

            {
              !username && !profilePicture && !bio
              ?
              <div className="flex flex-col font-body my-2 items-center">
                <p>You're almost there!</p>
                <p>Enter a username, pfp link, and bio to finalize your account setup.</p>
              </div>
              : 
              ""
            }

            <div className="flex justify-end">
              <button
                type="submit"
                onClick={handleProfileUpdate}
                className={`px-4 py-2 rounded-md text-theme accent font-body`}
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Profile'}
              </button>
            </div>

            {/* Toggle Switch */}
            <div className={`h-10 font-body flex items-center justify-between p-6 w-full relative top-[165px] rounded-md ${isToggled ? "bg-[#25262F] text-white " : "bg-[#E4E4E4] text-black "} `}>
            <h2 className="flex pl-[5px] items-center">
              {isToggled ? (
                <FontAwesomeIcon icon={faMoon} className="mr-2 transition-all ease-in-out duration-1000 text-blue-300 h-6 " />
              ) : (
                <FontAwesomeIcon icon={faSun} className="mr-2 transition-all ease-in-out duration-1000 text-yellow-500 h-6 " />
              )}
              {isToggled ? 'Dark Mode' : 'Light Mode'}
            </h2>
            <Switch isToggled={isToggled} onToggled={handleThemeToggle} />
            </div>
            
          </div>
        </div>
      </div>
      <div className="flex justify-center mt-4 mb-4">
        {message && <p className="text-green-500">{message}</p>}
      </div>
    </div>
  );
};

export default SettingsPage;


