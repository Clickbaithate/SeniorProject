import React, { useState } from 'react';
import Sidebar from './Sidebar';
import SearchBar from '../components/SearchBar';
import "./theme.css";
import ChallengeCard from '../components/ChallengeCard';

const ChallengesPage = () => {

  const [challenges, setChallenges] = useState([
    { id: 1, title: 'Top 100 Sci-Fi Movies', percentage: 75 },
    { id: 2, title: 'Top 100 Comedy Movies', percentage: 25 },
    { id: 3, title: 'Top 100 Action Movies', percentage: 50 },
    { id: 4, title: 'Top 100 Animated Movies', percentage: 43 },
    { id: 5, title: 'Top 100 Horror Movies', percentage: 12 },
    { id: 6, title: 'Top 100 Romance Movies', percentage: 65 },
    { id: 7, title: 'Top 100 Thriller Movies', percentage: 96 },
    { id: 8, title: 'Top 100 Sports Movies', percentage: 29 },
    { id: 9, title: 'Top 100 Oscar-Winning Movies', percentage: 100 },
    { id: 10, title: 'Top 100 Documentaries', percentage: 5 },
    { id: 11, title: 'Top 100 Christmas Movies', percentage: 45 },
    { id: 12, title: 'Top 100 Family Movies', percentage: 50 },
    { id: 13, title: 'Top 100 Superhero Movies', percentage: 98 },
    { id: 14, title: "Top 100 90's Movies", percentage: 90 },
    { id: 15, title: 'Top 100 Summer Movies', percentage: 10 }
  ]);

  return (
    <div className="flex bg-theme">
      {/* Sidebar */}
      <Sidebar />
      <div className="ml-[100px] flex-1 px-4 ">
        {/* Page Title */}
        {challenges.length > 0 && (
          <div className="mb-6">
            <SearchBar placeholder="Search Challenges..." />
          </div>
        )}

        <h1 className="text-4xl font-body ml-12 text-theme mb-8 " >Challenges</h1>

        {/* Challenges List */}
        <div className="grid grid-cols-5 gap-6 ml-16 mt-6 ">
          {challenges.length > 0 ? (
            challenges.map((challenge, i) => (
              <ChallengeCard challenge={challenge} key={i} />
            ))
          ) : (
            <p>No challenges available.</p>
          )}
        </div>
        <div className="h-10" />
      </div>
    </div>
  );
};

export default ChallengesPage;
