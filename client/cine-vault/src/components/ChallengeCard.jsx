import React from "react";
import { useNavigate } from "react-router-dom";
import lightsaber from "../assets/lightsaber.png";
import comedy from "../assets/comedy.png";
import oscar from "../assets/oscar.png";
import nine from "../assets/90s.png";
import action from "../assets/action.png";
import animation from "../assets/animation.png";
import christmas from "../assets/christmas.png";
import documentary from "../assets/documentary.png";
import family from "../assets/family.png";
import horror from "../assets/horror.png";
import romance from "../assets/romance.png";
import sport from "../assets/sport.png";
import summer from "../assets/summer.png";
import superhero from "../assets/superhero.png";
import thriller from "../assets/thriller.png";

const ChallengeCard = ({ challenge }) => {
  let asset;
  let color;
  const navigate = useNavigate();

  if (challenge.title.includes("Sci-Fi")) {
    asset = lightsaber;
    color = "bg-blue-500";
  } else if (challenge.title.includes("Comedy")) {
    asset = comedy;
    color = "bg-red-500";
  } else if (challenge.title.includes("Action")) {
    asset = action;
    color = "bg-orange-500";
  } else if (challenge.title.includes("Animated")) {
    asset = animation;
    color = "bg-purple-500";
  } else if (challenge.title.includes("Horror")) {
    asset = horror;
    color = "bg-yellow-500";
  } else if (challenge.title.includes("Romance")) {
    asset = romance;
    color = "bg-pink-500";
  } else if (challenge.title.includes("Thriller")) {
    asset = action;
    color = "bg-sky-500";
  } else if (challenge.title.includes("Sports")) {
    asset = sport;
    color = "bg-green-500";
  } else if (challenge.title.includes("Oscar")) {
    asset = oscar;
    color = "bg-amber-500";
  } else if (challenge.title.includes("Documentaries")) {
    asset = documentary;
    color = "bg-red-500";
  } else if (challenge.title.includes("Christmas")) {
    asset = christmas;
    color = "bg-gradient-to-r from-red-500 to-green-600";
  } else if (challenge.title.includes("Family")) {
    asset = family;
    color = "bg-violet-500";
  } else if (challenge.title.includes("Superhero")) {
    asset = superhero;
    color = "bg-gradient-to-r from-blue-500 to-red-600";
  } else if (challenge.title.includes("90")) {
    asset = nine;
    color = "bg-emerald-500";
  } else {
    asset = summer;
    color = "bg-indigo-500";
  }

  const onClick = (id) => {
    navigate(`/challenges/${id}`);
  };

  return (
    <div onClick={() => onClick(challenge.challenge_id)} className="w-72 h-[350px] accent rounded-xl flex flex-col items-center justify-center space-y-6 shadow-[rgba(0,0,15,0.5)_10px_5px_4px_0px] hover:scale-110 duration-500 cursor-pointer">
      <h1 className="font-body text-theme text-center px-4">{challenge.title}</h1>
      <img src={asset} className="w-24 h-24" alt="Challenge" />
      <div className="w-[90%] h-2 bg-gray-300 rounded-full">
        <div className={`h-full ${color} rounded-full flex items-end justify-start`} style={{ width: `${challenge.percent}%` }}>
          <div className="mb-2 ml-2 font-body text-theme">{challenge.percent}%</div>
        </div>
      </div>

      <button 
        onClick={(e) => {
          e.stopPropagation();
          onClick(challenge.challenge_id);
        }}
        className="bg-theme font-body text-theme w-36 h-10 rounded-xl shadow-[rgba(0,0,15,0.5)_10px_5px_4px_0px] hover:scale-110 duration-500 mt-4"
      >
        View Challenge
      </button>
    </div>
  );
};

export default ChallengeCard;
