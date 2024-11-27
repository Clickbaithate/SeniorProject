import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import supabase from "../config/supabaseClient";
import Sidebar from './Sidebar';
import SearchBar from '../components/SearchBar.jsx';
import HorizontalList from '../components/HorizontalList';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const UserProfile = () => {
  const { id } = useParams(); // Get user_id from URL params
  const [user, setUser] = useState(null);
  const [watchedMovies, setWatchedMovies] = useState([]);
  const [watchedShows, setWatchedShows] = useState([]);
  const [theme, setTheme] = useState('light'); // Default theme
  const [thisUser, setThisUser] = useState(null);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [friends, setFriends] = useState([]);

  // Fetch Pending Friend Requests
  const fetchPendingRequests = async (userId) => {
    try {
      const { data, error } = await supabase
        .from("Friends")
        .select("relationship_id, user_id, friend_id, added")
        .eq("friend_id", userId)
        .eq("status", "pending");

      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error("Error fetching pending requests:", err.message);
      return [];
    }
  };

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

  // Fetch User Profile Data
  useEffect(() => {
    const fetchProfileData = async () => {
      if (!id) return;

      try {
        const { data: userData, error: userError } = await supabase
          .from("Users")
          .select("user_id, username, profile_picture, bio, theme_settings")
          .eq("username", id)
          .single();

        if (userError) {
          console.error("Error fetching user data:", userError);
          return;
        }

        setUser(userData);

        // Apply theme settings
        const userTheme = userData.theme_settings ? 'dark' : 'light';
        setTheme(userTheme);
        document.body.classList.toggle('dark', userTheme === 'dark');

        // Fetch Watched Movies
        const { data: watchedMoviesData, error: moviesError } = await supabase
          .from("Watched_Movies")
          .select("movie_id")
          .eq("user_id", userData.user_id);

        if (moviesError) console.error("Error fetching watched movies:", moviesError);
        else {
          const movieIds = watchedMoviesData.map((movie) => movie.movie_id);
          const { data: movieDetails, error: movieError } = await supabase
            .from("Movies")
            .select("*")
            .in("movie_id", movieIds);

          if (!movieError) setWatchedMovies(movieDetails);
        }

        // Fetch Watched Shows
        const { data: watchedShowsData, error: showsError } = await supabase
          .from("Watched_Shows")
          .select("show_id")
          .eq("user_id", userData.user_id);

        if (showsError) console.error("Error fetching watched shows:", showsError);
        else {
          const showIds = watchedShowsData.map((show) => show.show_id);
          const { data: showDetails, error: showError } = await supabase
            .from("Shows")
            .select("*")
            .in("show_id", showIds);

          if (!showError) setWatchedShows(showDetails);
        }
      } catch (err) {
        console.error("Error fetching profile data:", err);
      }
    };

    fetchProfileData();
  }, [id]);

  // Fetch Authenticated User and Friends
  useEffect(() => {
    const fetchAuthenticatedUser = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error || !session) {
          console.warn("Error fetching session:", error);
          return;
        }

        const { data, error: userError } = await supabase
          .from("Users")
          .select("user_id")
          .eq("user_id", session.user.id)
          .single();

        if (!userError) setThisUser(data.user_id);
      } catch (err) {
        console.error("Error fetching authenticated user:", err);
      }
    };

    const fetchFriendsAndRequests = async () => {
      if (user) {
        const friendsList = await fetchFriendsList(user.user_id);
        const requests = await fetchPendingRequests(thisUser);
        setFriends(friendsList);
        setPendingRequests(requests);
      }
    };

    fetchAuthenticatedUser();
    fetchFriendsAndRequests();
  }, [user]);

  const sendFriendRequest = async (currentUserId, targetUserId) => {
    try {
      const { data, error } = await supabase
        .from("Friends")
        .insert([{ user_id: currentUserId, friend_id: targetUserId, status: "pending" }]);
  
      if (error) {
        console.error("Error sending friend request:", error.message);
        return;
      }
  
      console.log("Friend request sent successfully:", data);
      // Optionally update the UI or state
    } catch (err) {
      console.error("Error:", err.message);
    }
  };
  

  // Render Loading State
  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <DotLottieReact
          src="https://lottie.host/beb1704b-b661-4d4c-b60d-1ce309d639d5/7b3aX5rJYc.json"
          loop
          autoplay
          className="w-12 h-12"
        />
      </div>
    );
  }
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
  

  return (
    <div className={`ml-[100px] min-h-screen ${theme === 'dark' ? 'bg-theme ' : 'bg-theme '}`}>
      <Sidebar />
      <SearchBar placeholder="SEARCH..." />
      <div className="max-w-3xl mx-auto py-8">
        {/* User Profile Header */}
        <header className={`p-4 mb-8 ${theme === 'dark' ? 'bg-theme' : 'bg-theme'} text-center`}>
          <h1 className="text-xl font-bold">{user.username}</h1>
        </header>

        {/* Profile Picture and Username */}
        <div className="flex justify-center items-center flex-col mb-8">
          <img
            src={user.profile_picture || "https://via.placeholder.com/150"}
            alt="Profile"
            className="rounded-full h-40 w-40 object-cover mb-4"
          />
          <h2 className="text-2xl font-semibold mb-2">{user.username}</h2>
          {/* Display Bio */}
          <p className="text-lg text-center mb-4">{user.bio || "No bio available."}</p>
           {/* Add Friend Button */}
           {
  user.user_id !== thisUser && (
    <button
      onClick={() => sendFriendRequest(thisUser, user.user_id)}
      className="px-4 py-2 mt-4 text-white bg-blue-500 rounded-full hover:bg-blue-600 focus:outline-none"
    >
      Add Friend
    </button>
  )
}
          <div className="flex justify-around w-full max-w-3xl">
            <div className="text-center">
              <h3 className="text-xl font-semibold">Movies</h3>
              <p className="text-lg">{watchedMovies.length}</p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold">Shows</h3>
              <p className="text-lg">{watchedShows.length}</p>
            </div>
          </div>
        </div>

        <h3 className="text-2xl font-semibold mb-4 flex justify-around">Friends</h3>
        {friends.length > 0 ? (
          <ul className="flex justify-around">
            {friends.map((friend) => (
              <li key={friend.user_id} className="flex flex-col items-center">
                <img src={friend.profile_picture} alt={friend.username} className="w-8 h-8 rounded-full" />
                {friend.username}
              </li>
            ))}
          </ul>
        ) : (
          <p className="flex justify-around">No friends yet.</p>
        )}

{pendingRequests.length > 0 ? (
  <div>
    <h3 className="flex justify-center">Pending Friend Requests</h3>
    {pendingRequests.map((request) => (
      <div className="flex flex-col items-center mb-4" key={request.relationship_id}>
        <p>Request from: {request.user_id}</p>
        <div className="flex justify-center gap-4 mt-2">
          <button 
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
            onClick={() => respondToFriendRequest(request.relationship_id, "accepted")}
          >
            Accept
          </button>
          <button 
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
            onClick={() => respondToFriendRequest(request.relationship_id, "rejected")}
          >
            Reject
          </button>
        </div>
      </div>
    ))}
  </div>
) : (
  <p className="flex justify-around">No pending requests.</p>
)}


        {/* Watched Movies */}
        <h3 className="text-2xl font-semibold mb-4">Watched Movies</h3>
        {watchedMovies.length > 0 ? (
          <HorizontalList movies={watchedMovies} />
        ) : (
          <p>No movies watched yet.</p>
        )}

        {/* Watched Shows */}
        <h3 className="text-2xl font-semibold mb-4 mt-8">Watched Shows</h3>
        {watchedShows.length > 0 ? (
          <HorizontalList shows={watchedShows} />
        ) : (
          <p>No shows watched yet.</p>
        )}
      </div>
      <div>
      <div>
  </div>
  </div>
    </div>
  );
};

export default UserProfile;
