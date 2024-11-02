import React from "react";
import { useNavigate } from "react-router-dom";
import placeholder from "../assets/placeholder.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import '../pages/theme.css';

const HorizontalShowCard = ({show, index}) => {

  const navigate = useNavigate();

  const handleOnClick = (id) => {
    navigate(`/show/${id}`)
  }

  return (
    <div key={index} onClick={() => handleOnClick(show.show_id)} className="h-42 w-full cursor-pointer">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <img src={show.image ? show.image : placeholder} alt={show.title} className={`h-48 w-42 object-cover mb-2 rounded-xl`} />
          <div className="font-body">
            <div>{show.title}</div>
            <div>{show.date}</div>
            <div>{show.rating} / 10</div>
          </div>
        </div>
        <button>
          <FontAwesomeIcon className={`w-6 h-6`} icon={faEllipsisV} />
        </button>
      </div>
    </div>
  );
}

export default HorizontalShowCard;