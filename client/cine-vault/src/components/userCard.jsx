import React from "react";
import { useNavigate } from "react-router-dom";
import placeholder from "../assets/placeholder.jpg"

const UserCard = ({user, theme, index}) => {

  const navigate = useNavigate();

  const handleOnClick = (username) => {
    console.log(username);
  }

  return (
    <div key={index} onClick={() => handleOnClick(user.username)} className="transition-all ease-in-out duration-500 transform hover:scale-110 min-w-[175px] max-w-[175px] bg-transparent flex-shrink-0 cursor-pointer ">
      <img src={user.profile_picture} alt="" className={`h-44 w-64 object-fit mb-2 rounded-full `} />
      <h2 className={`text-md truncate mx-2 font-body font-semibold ${theme === "light" ? "text-black" : "text-white"}`}> {user.username} </h2>
    </div>
  );
}

export default UserCard;