import React from "react";
import { useNavigate } from "react-router-dom";

const HomeshowCard = ({ show }) => {

  const navigate = useNavigate();

  const handleClick = (id) => {
    navigate(`/show/${id}`);
  }

  return (

    <div className="flex items-center justify-evenly " >
      <img 
        src={show.image} 
        className="w-[80px] rounded-xl"
      />
      <div className="flex flex-col justify-center ml-6 space-y-2" >
        <div className="font-body w-40 truncate overflow-hidden " >{show.title}</div>
        <div className="font-body" >{show.release_date}</div>
        <div className="font-body" >{show.rating} / 10 ⭐ </div>
      </div>
      <button onClick={() => handleClick(show.show_id)} className="w-24 h-10 font-body bg-theme rounded-xl ml-12 shadow-[rgba(0,0,15,0.5)_10px_5px_4px_0px] hover:scale-110 duration-500 " >
        View Show
      </button>
    </div>
  
  );

}

export default HomeshowCard;