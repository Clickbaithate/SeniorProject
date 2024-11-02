import React from "react";
import { useNavigate } from "react-router-dom";
import placeholder from "../assets/placeholder.jpg"
import '../pages/theme.css';

const ShowCard = ({show, index}) => {

  const navigate = useNavigate();

  const handleOnClick = (id) => {
    navigate(`/show/${id}`)
  }

  return (
    <div key={index} onClick={() => handleOnClick(show.show_id)} className="transition-all ease-in-out duration-500 transform hover:scale-110 min-w-[175px] max-w-[175px] bg-transparent flex-shrink-0 cursor-pointer ">
      <img src={show.image ? show.image : placeholder} alt={show.title} className={`w-full object-cover mb-2 ${show.profile_picture ? "rounded-full" : "rounded-3xl h-64"} `} />
      <h2 className={`text-md truncate mx-2 font-body font-semibold text-theme`}> {show.title} </h2>
    </div>
  );
}

export default ShowCard;