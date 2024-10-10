import React from 'react';

// basic playlist page outlook for how we want to display information over movies that users want to watch and have watched, etc
const playlists = [
  {
    name: 'Watched',
    description: 'Movies you have already watched.',
    movies: [
      { title: 'The Godfather', year: 1972 },
      { title: 'John Wick', year: 2014 },
    ],
  },
  {
    name: 'Want to Watch',
    description: 'Movies you want to watch in the future.',
    movies: [
      { title: 'Parasite', year: 2019 },
      { title: 'Mad Max: Fury Road', year: 2015 },
    ],
  },
  {
    name: 'Currently Watching',
    description: 'Movies you are in the middle of watching.',
    movies: [
      { title: 'The Grand Budapest Hotel', year: 2014 },
      { title: 'Interstellar', year: 2014 },
    ],
  },
  {
    name: 'Favorites',
    description: 'Your all-time favorite movies.',
    movies: [
      { title: 'The Lord of the Rings: The Fellowship of the Ring', year: 2001 },
      { title: 'Superbad', year: 2007 },
    ],
  },
  {
    name: 'Tracked',
    description: 'Movies you are following for updates or new releases.',
    movies: [
      { title: 'Blade Runner 2049', year: 2017 },
      { title: 'A Quiet Place Part II', year: 2021 },
    ],
  },
];

const PlaylistPage = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-6">
      <h1 className="text-4xl font-bold mb-8">Movie Playlists</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-4xl">
        {playlists.map((playlist, index) => (
          <div key={index} className="bg-gray-800 shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-2">{playlist.name}</h2>
            <p className="text-gray-400 mb-4">{playlist.description}</p>
            <ul className="space-y-2">
              {playlist.movies.map((movie, idx) => (
                <li key={idx} className="flex justify-between text-lg text-gray-300">
                  <span>{movie.title}</span>
                  <span className="text-gray-500">{movie.year}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlaylistPage;