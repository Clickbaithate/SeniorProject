import React from "react";
import { useNavigate } from "react-router-dom";
import placeholder from "../assets/placeholder.jpg";
import supabase from "../config/supabaseClient"; // Assuming you have supabase client set up

const UserCard = ({ user, index }) => {
  const navigate = useNavigate();

  const handleOnClick = (username) => {
    // Navigate to the user's profile page using their user ID
    navigate(`/user/${username}`);
    console.log(username);
  };

  return (
    <div
      key={index}
      onClick={() => handleOnClick(user.username)} // Use user.id for navigation
      className="transition-all ease-in-out duration-500 transform hover:scale-110 min-w-[175px] max-w-[175px] bg-transparent flex-shrink-0 cursor-pointer"
    >
      <img
        src={user.profile_picture || placeholder} // Use a fallback image if profile_picture is missing
        alt="user profile"
        className="h-44 w-64 object-cover mb-2 rounded-full"
      />
      <h2 className="text-md truncate mx-2 font-body font-semibold text-theme">
        {user.username}
      </h2>
    </div>
  );
};

export default UserCard;
