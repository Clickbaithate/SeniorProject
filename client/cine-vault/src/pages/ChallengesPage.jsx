import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import SearchBar from '../components/SearchBar';
import "./theme.css";
import ChallengeCard from '../components/ChallengeCard';
import supabase from '../config/supabaseClient';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ChallengesPage = () => {

  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterCount, setFilterCount] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [allChallenges, setAllChallenges] = useState([]);

  useEffect(() => {
    const fetchChallenges = async () => {
      // Getting user session
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();
      if (sessionError) {
        console.warn("Session Error: ", sessionError);
        return;
      }
  
      setLoading(true);
      const { data, error } = await supabase
        .from('Challenges')
        .select("challenge_id, title, percent"); // Fetch all columns
  
      if (error) {
        setError("Error fetching challenges");
        console.error("Error: ", error);
      } else {
        setChallenges(data || []); // Set the fetched data
        setAllChallenges(data);
      }
      setLoading(false);
    };
  
    fetchChallenges();
  }, []); // The empty array ensures this runs once on component mount

  const handleFilter = () => {
    setFilterCount(prev => prev + 1);
  }

  const handleSearch = (e) => {
    e.preventDefault();
    const filteredChallenges = challenges.filter(
      challenge => challenge.title.toLowerCase().includes(searchText.toLowerCase())
    );
    setChallenges(filteredChallenges);
  }

  useEffect(() => {
    if (searchText.trim() === "") {
      setChallenges(allChallenges); // Reset to original challenges when search text is empty
    } else {
      const filteredChallenges = allChallenges.filter(challenge =>
        challenge.title.toLowerCase().includes(searchText.toLowerCase())
      );
      setChallenges(filteredChallenges); // Set filtered challenges
    }
  }, [searchText, allChallenges]);

  return (
    <div className="flex bg-theme">
      {/* Sidebar */}
      <Sidebar />
      <div className="ml-[100px] flex-1 px-4 ">
        {/* Page Title */}
        <div className="">
          <SearchBar placeholder="Search Movies..." />
        </div>

        <div className={`flex items-start justify-between pl-16 pr-24 font-body mt-6 `}>
          <h1 className="text-4xl font-body text-theme mb-8 " >Challenges</h1>
          <div className="flex items-center justify-center space-x-4 " >
            {/* Filter Counter */}
            <div className={`h-8 w-8 flex items-center justify-center border border-gray-500 rounded-full font-body shadow-[rgba(0,0,15,0.5)_10px_5px_4px_0px]  `} >
              {filterCount}
            </div>
            {/* Filter Button */}
            <div onClick={handleFilter} className={`font-body cursor-pointer border border-gray-500 w-18 h-10 p-4 flex items-center justify-center rounded-lg shadow-[rgba(0,0,15,0.5)_10px_5px_4px_0px]  `} >
              Add Filter
            </div>
            {/* Filter Search */}
            <form onChange={handleSearch} className={`flex border border-gray-500 items-center rounded-lg p-2 w-64 shadow-[rgba(0,0,15,0.5)_10px_5px_4px_0px] `}>
              <button type="button" onClick={handleSearch} className="mr-2">
                <FontAwesomeIcon icon={faSearch} className="text-gray-500" />
              </button>
              <input
                type="text"
                placeholder="Search your playlists..."
                className={`w-full focus:outline-none bg-transparent font-body `}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </form>

          </div>
        </div>

        {/* Challenges List */}
        <div className="grid grid-cols-5 gap-6 ml-16 mt-6 ">
          {challenges.length > 0 ? (
            challenges.map((challenge, i) => (
              <ChallengeCard challenge={challenge} key={i} />
            ))
          ) : (
            <p className="font-body" >No challenges found...</p>
          )}
        </div>
        
        <div className="h-10" />
      </div>
    </div>
  );
};

export default ChallengesPage;
