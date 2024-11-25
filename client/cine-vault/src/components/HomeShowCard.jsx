import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../config/supabaseClient";

const HomeShowCard = ({ show }) => {
  const [showDetails, setShowDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchShowDetails = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("Shows")
          .select("*")
          .eq("show_id", show) // Fetch show by ID
          .single();

        if (error) {
          console.error("Error fetching show details:", error);
          setError("Failed to fetch show details");
        } else {
          setShowDetails(data);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
        setError("An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };

    if (show) {
      fetchShowDetails();
    }
  }, [show]);

  const handleClick = (id) => {
    navigate(`/show/${id}`);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error || !showDetails) {
    return <div className="text-red-500">Failed to load show details</div>;
  }

  return (
    <div className="flex items-center justify-evenly">
      <img
        src={showDetails.image}
        alt="Show Poster"
        className="w-[80px] rounded-xl"
      />
      <div className="flex flex-col justify-center ml-6 space-y-2">
        <div className="font-body w-40 truncate overflow-hidden">{showDetails.title}</div>
        <div className="font-body">{showDetails.date}</div>
        <div className="font-body">{showDetails.rating} / 10 ⭐</div>
      </div>
      <button
        onClick={() => handleClick(showDetails.show_id)}
        className="w-24 h-10 font-body bg-theme rounded-xl ml-12 shadow-[rgba(0,0,15,0.5)_10px_5px_4px_0px] hover:scale-110 duration-500"
      >
        View Show
      </button>
    </div>
  );
};

export default HomeShowCard;
