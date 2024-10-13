import React from "react";
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

  const onClick = (challenge) => {
    console.log(`ID: ${challenge.id}`);
  }

  return (
    <div onClick={() => onClick(challenge)} className="w-56 h-64 accent flex flex-col justify-around items-center rounded-3xl shadow-[rgba(0,0,15,0.5)_10px_5px_4px_0px] hover:scale-110 duration-500 cursor-pointer" >
      <h1 className="font-body text-theme text-center px-4 " >{challenge.title}</h1>
      <img src={asset} className="w-24 h-24" />
      <div className="w-[90%] h-2 bg-gray-300 rounded-full" >
        <div className={`h-full ${color} rounded-full flex items-end justify-start`} style={{ width: `${challenge.percentage}%` }} >
          <div className="mb-2 ml-2 font-body text-theme " >{challenge.percentage}%</div>
        </div>
      </div>
    </div>
  );

};

export default ChallengeCard;