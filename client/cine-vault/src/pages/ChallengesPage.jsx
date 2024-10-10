import React, { useState } from 'react';
import Sidebar from './Sidebar';
import SearchBar from '../components/SearchBar';

const ChallengesPage = () => {
  const [challenges, setChallenges] = useState([
    { id: 1, name: 'Movie Buff Beginner', description: 'Watch 5 movies', progress: 3, total: 5 },
    { id: 2, name: 'Cinema Enthusiast', description: 'Watch 10 movies', progress: 7, total: 10 },
    { id: 3, name: 'Just a Quick Flick', description: 'Watch for 30 minutes', progress: 20, total: 30 },
    { id: 4, name: 'Curator-in-Chief', description: 'Add 5 movies to your watchlist', progress: 5, total: 5 },
    { id: 5, name: 'Binge Watch Pro', description: 'Watch 3 movies back-to-back', progress: 1, total: 3 },
  ]);

  const getProgressPercentage = (progress, total) => (progress / total) * 100;

  return (
    <div className="page-layout flex">
      {/* Sidebar */}
      <Sidebar />

      <div className="content-area flex-1 p-8">
        {/* Page Title */}
        {challenges.length > 0 && (
          <div className="search-bar-container mb-6">
            <SearchBar placeholder="Search Challenges..." />
          </div>
        )}

        {/* Challenges List */}
        <div className="challenge-list">
          {challenges.length > 0 ? (
            challenges.map((challenge) => (
              <div key={challenge.id} className="challenge-item bg-white shadow-md rounded-lg p-4 mb-4">
                <h3 className="text-lg font-semibold">{challenge.name}</h3>
                <p className="text-gray-600 mb-2">{challenge.description}</p>

                {/* Progress Bar */}
                <div className="progress-container bg-gray-200 rounded-full h-2 mb-2" aria-label="Progress bar">
                  <div
                    className="progress-bar bg-green-500 h-2 rounded-full"
                    style={{ width: `${getProgressPercentage(challenge.progress, challenge.total)}%` }}
                    role="progressbar"
                    aria-valuenow={challenge.progress}
                    aria-valuemin="0"
                    aria-valuemax={challenge.total}
                  />
                </div>

                <p className="text-sm text-gray-700">
                  {challenge.progress}/{challenge.total} completed
                </p>
              </div>
            ))
          ) : (
            <p>No challenges available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChallengesPage;
