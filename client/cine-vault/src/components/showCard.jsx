import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../config/supabaseClient"; // Assuming you have supabase client set up
import placeholder from "../assets/placeholder.jpg";
import "../pages/theme.css";

const ShowCard = ({ show, index }) => {
  const navigate = useNavigate();
  const [fetchedShow, setFetchedShow] = useState(null);

  useEffect(() => {
    // If no show is passed as a prop, fetch it from Supabase
    if (!show) {
      const fetchShow = async () => {
        const { data, error } = await supabase
          .from("Shows")
          .select("*")
          .eq("show_id", index) // Assuming the 'index' or another unique field is used to fetch the show
          .single();

        if (error) {
          console.error("Error fetching show:", error);
        } else {
          setFetchedShow(data);
        }
      };
      fetchShow();
    }
  }, [show, index]); // Only run the effect if 'show' is not passed or 'index' changes

  const handleOnClick = (id) => {
    navigate(`/show/${id}`);
  };

  // Use fetchedShow if no show prop is provided
  const displayShow = show || fetchedShow;

  return (
    <div key={index} onClick={() => handleOnClick(displayShow?.show_id || displayShow?.id)} className="transition-all ease-in-out duration-500 transform hover:scale-110 min-w-[175px] max-w-[175px] bg-transparent flex-shrink-0 cursor-pointer" >
      <img src={ displayShow?.image ? displayShow.image : placeholder } alt={displayShow?.title || "Unknown Title"} className={`w-full object-cover mb-2 rounded-3xl h-64`} />
      <h2 className="text-md truncate mx-2 font-body font-semibold text-theme">
        {displayShow?.title || "Unknown Title"}
      </h2>
    </div>
  );
};

export default ShowCard;
