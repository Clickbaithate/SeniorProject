import React from "react";
import lightsaber from "../assets/lightsaber.png";
import comedy from "../assets/comedy.png";
import oscar from "../assets/oscar.png";
import "../pages/theme.css";
import { useNavigate } from "react-router-dom";


const ChallengeCard = ({ progress, challenge }) => {

  const navigate = useNavigate();
  let asset;
  let color;
  if (challenge === "Sci-Fi"){
    asset = lightsaber;
    color = "red";
  } else if (challenge === "Comedy"){
    asset = comedy;
    color = "purple";
  } else{
    asset = oscar;
    color = "blue";
  }
   
  const handleClick = () => {
    navigate("/challenges");
  }

  return(
    <div className="w-72 h-[400px] accent rounded-xl flex flex-col items-center justify-center space-y-6 shadow-[rgba(0,0,15,0.5)_10px_5px_4px_0px] " >

      {/* Title */}
      <div className="text-center font-body text-theme" >Top 100 {challenge} Movies</div>

      {/* Image */}
      <img src={asset} className="w-36" />

      {/* Progress Bar */}
      <div className="w-56 h-2 bg-gray-300 rounded-full" >
        <div className={`h-full bg-${color}-500 rounded-full`} style={{ width: `${progress}%` }} />
      </div>

      {/* Progress Text */}
      <div className="text-center font-body text-theme" >You have completed <span className="text-red-500" >{progress}%</span> of this challenge!</div>
      
      {/* Button */}
      <button onClick={() => handleClick()} className="bg-theme font-body text-theme w-36 h-10 rounded-xl shadow-[rgba(0,0,15,0.5)_10px_5px_4px_0px] hover:scale-110 duration-500 " >
        View Challenge
      </button>

    </div>
  );

}

export default ChallengeCard;