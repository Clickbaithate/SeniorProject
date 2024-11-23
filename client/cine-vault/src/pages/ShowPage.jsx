import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import supabase from "../config/supabaseClient";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark, faFolderPlus, faEye, faEyeSlash, faEnvelope, faPlaceOfWorship } from "@fortawesome/free-solid-svg-icons";
import HorizontalList from "../components/HorizontalList";
import bannerPlaceholder from "../assets/placeholder.jpg";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import placeholder from "../assets/placeholder.jpg";
import axios from "axios";
import "./theme.css";
import ShowCard from "../components/showCard";

const ShowPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isToggled, setIsToggled] = useState(localStorage.getItem("theme") === "dark");
  const [show, setShow] = useState(null);
  const [loading, setLoading] = useState(false);
  const [trendingShows, setTrendingShows] = useState(null);
  const [hasWatched, setHasWatched] = useState(false);

  useEffect(() => {
    setShow(null);
    setLoading(false);
    setTrendingShows(null);

    const fetchProfileAndShow = async () => {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) {
        console.warn(sessionError);
        return;
      }

      if (session) {
        const { data, error } = await supabase
          .from("Users")
          .select()
          .eq("user_id", session.user.id)
          .single();
        if (data) {
          setUser(data);
          setIsToggled(data.theme_settings);
        }
      }

      const { data: showData, error: showError } = await supabase
        .from("Shows")
        .select("*")
        .eq("show_id", id)
        .single();
      if (showData) {
        setShow(showData);
        setLoading(true);
      }

      // Check if the user has watched this show
      if (session) {
        const { data: watchedData } = await supabase
          .from("Watched_Shows")
          .select("*")
          .eq("user_id", session.user.id)
          .eq("show_id", id)
          .maybeSingle();
        setHasWatched(Boolean(watchedData));
      }
    };

    fetchProfileAndShow();
  }, [id]);

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!show) return; // If movie data is not available, do not call the API

      try {
        const sid = Number(id);
        const data = { data: [sid] }
        const headers = { 'Content-Type': 'application/json' };
        const response = await axios.post(
          `https://gaelguzman.us-east-1.aws.modelbit.com/v1/get_show_recommendations/latest`,
          data,
          { headers }
        );

        // Make sure the response data is an array before setting it
        if (Array.isArray(response.data.data)) {
          setTrendingShows(response.data.data);
        } else {
          console.error("Received data is not an array", response.data);
          setTrendingShows([]);
        }
      } catch (error) {
        console.error("Error fetching recommendations:", error);
        setTrendingShows([]);
      }
    };

    if (loading && show) {
      fetchRecommendations();
    }
  }, [id, show]);

  const handleClose = () => {
    navigate(-1);
  };

  const toggleWatchedStatus = async () => {
    if (!user) return;

    if (hasWatched) {
      await supabase
        .from("Watched_Shows")
        .delete()
        .eq("user_id", user.user_id)
        .eq("show_id", id);
      setHasWatched(false);
    } else {
      await supabase.from("Watched_Shows").insert({
        user_id: user.user_id,
        show_id: id,
      });
      setHasWatched(true);
    }
  };

  useEffect(() => {
    if (show && show.show_id) {
      const visitedItems = JSON.parse(localStorage.getItem("recentlyVisitedItems")) || [];
      const updatedItems = [
        { id: show.show_id, type: 'show', title: show.title, image: show.image, release_date: show.release_date, rating: show.rating },
        ...visitedItems.filter(item => item.id !== show.show_id || item.type !== 'show')
      ];
      localStorage.setItem("recentlyVisitedItems", JSON.stringify(updatedItems.slice(0, 3))); // Limit to the last 3 items
    }
  }, [show]);
  
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (!savedTheme) {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.setAttribute('data-theme', savedTheme);
    }
    window.scrollTo(0, 0); // Moved inside this `useEffect`
  }, []);
  

  return (
    loading ? (
      <div className="">
        <div className="relative h-[1000px] flex flex-col">
          <div className="relative flex flex-1 justify-end items-start rounded-br-3xl rounded-bl-3xl">
            <div
              className="opacity-25 w-full h-full rounded-br-3xl rounded-bl-3xl"
              style={{
                background: `url(${show.banner || bannerPlaceholder})`,
                backgroundSize: "contain",
              }}
            ></div>

            <button onClick={handleClose} className="absolute top-8 right-12 z-20">
              <FontAwesomeIcon
                className="w-12 h-12 transition-all ease-in-out duration-500 transform hover:scale-125"
                icon={faCircleXmark}
              />
            </button>
          </div>

          <div className="flex flex-col flex-1 overflow-hidden">
            <div className="flex-1 flex items-center overflow-y-auto">
              <div className="absolute left-0 top-1/2 transform -translate-y-1/2 flex items-center">
                <img
                  src={show.image ? show.image : placeholder}
                  className="shadow-[rgba(0,0,15,0.5)_10px_15px_4px_0px] min-h-[540px] max-h-[540px] max-w-[380px] rounded-2xl ml-20"
                />
                <div className={`flex flex-col ml-10 mr-4 font-body ${show.overview.length > 440 ? "mt-96" : "mt-72"}`}>
                  <div className="flex items-center space-x-12">
                    <div className="text-5xl max-w-[600px]">{show.title}</div>
                    <button onClick={toggleWatchedStatus} className="transition-all ease-in-out duration-500 transform hover:scale-110 px-3 py-3 flex rounded-full shadow-[rgba(0,0,0,0.5)_5px_10px_4px_0px]">
                      <FontAwesomeIcon className="w-6 h-6" icon={hasWatched ? faEyeSlash : faEye} />
                      <span className="ml-2">{hasWatched ? "Has Watched" : "Watch"}</span>
                    </button>
                    <button className="transition-all ease-in-out duration-500 transform hover:scale-110 px-3 py-3 flex rounded-full shadow-[rgba(0,0,0,0.5)_5px_10px_4px_0px]">
                      <FontAwesomeIcon className="w-6 h-6" icon={faFolderPlus} />
                    </button>
                    <button className="transition-all ease-in-out duration-500 transform hover:scale-110 px-3 py-3 flex rounded-full shadow-[rgba(0,0,0,0.5)_5px_10px_4px_0px]">
                      <FontAwesomeIcon className="w-6 h-6" icon={faEnvelope} />
                    </button>
                  </div>
                  <div className="flex items-center space-x-4 mt-8">
                    <div>{show.date}</div>
                    <div>*</div>
                    <div>{show.genres}</div>
                    <div>*</div>
                    <div>{show.seasons} Seasons</div>
                    <div>*</div>
                    <div>{show.episodes} Total Episodes</div>
                    <div>*</div>
                    <div>{show.rating} / 10 ⭐</div>
                  </div>
                  <div className="text-gray-400 py-2">{show.tagline}</div>
                  <div className="text-2xl">Overview</div>
                  <div className="text-wrap py-2">{show.overview}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 mt-[-100px] pl-3.5">
          <h1 className="text-4xl font-body ml-16">Similar Shows</h1>
          {trendingShows && trendingShows.length > 0 ? (
            <div className="flex overflow-x-auto space-x-4 ml-16 mt-4">
              {trendingShows.map((recommendedShow) => (
                <ShowCard key={recommendedShow} index={recommendedShow} />
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <DotLottieReact
                src="https://lottie.host/beb1704b-b661-4d4c-b60d-1ce309d639d5/7b3aX5rJYc.json"
                loop
                autoplay
                className="w-32 h-32"
              />
            </div>
          )}
        </div>
      </div>
    ) : (
      <div className="flex flex-col justify-center items-center h-screen">
        <DotLottieReact src="https://lottie.host/b7f01c92-fc7a-4e49-9153-2e457a694eb2/bHswRE20Tl.json" loop autoplay className="w-56 h-56" />
      </div>
    )
  );
};

export default ShowPage;
