import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../config/supabaseClient";
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
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);
  const [percent, setPercent] = useState(0);

  // Determine the asset and color based on challenge title
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
    asset = thriller;
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

  // Fetch user session and calculate percent
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Get user session
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();
        if (sessionError || !session) {
          console.warn("Error fetching session:", sessionError);
          return;
        }
        const userId = session.user.id;
        setUserId(userId);

        // Fetch the challenge data based on title
        const { data: challengeData, error: challengeError } = await supabase
          .from("Challenges")
          .select("*")
          .eq("title", challenge.title)
          .single();

        if (challengeError) {
          console.error("Error fetching challenge:", challengeError);
          return;
        }

        // Fetch watched movies in this challenge
        const { data: watchedMovies, error: watchedError } = await supabase
          .from("Watched_Movies")
          .select("movie_id")
          .eq("user_id", userId)
          .in("movie_id", challengeData.media);

        if (watchedError) {
          console.error("Error fetching watched movies:", watchedError);
          return;
        }

        // Calculate progress
        const progress = Math.min(
          Math.round((watchedMovies.length / challengeData.media.length) * 100),
          100
        );

        setPercent(progress);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchUserData();
  }, [challenge.title]);

  return (
    <div
      onClick={() => onClick(challenge.challenge_id)}
      className="w-72 h-[350px] accent rounded-xl flex flex-col items-center justify-center space-y-6 shadow-[rgba(0,0,15,0.5)_10px_5px_4px_0px] hover:scale-110 duration-500 cursor-pointer"
    >
      <h1 className="font-body text-theme text-center px-4">
        {challenge.title}
      </h1>
      <img src={asset} className="w-24 h-24" alt="Challenge" />
      <div className="w-[90%] h-2 bg-gray-300 rounded-full relative">
        <div
          className={`h-full ${color} rounded-full`}
          style={{ width: `${percent}%` }}
        />
        <div className="absolute top-[-1.5rem] left-0 w-full flex justify-start">
          <span className="font-body text-theme">{percent || 0}%</span>
        </div>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onClick(challenge.challenge_id);
        }}
        className="bg-theme font-body text-theme w-36 h-10 rounded-xl shadow-lg hover:scale-110 duration-500 mt-4"
      >
        View Challenge
      </button>
    </div>
  );
};

export default ChallengeCard;
