import React, { useRef } from 'react';
import MovieCard from './movieCard';
import GenreCard from './genreCard';

const HorizontalList = ({ movies, genres, theme = 'light' }) => {

  const scrollRef = useRef(null); 

  // Function to handle scrolling to the left
  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        top: 0,
        left: -600, 
        behavior: 'smooth',
      });
    }
  };

  // Function to handle scrolling to the right
  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        top: 0,
        left: 600,
        behavior: 'smooth',
      });
    }
  };

  return (

    <div className="relative mx-12 pt-4">

      {/* Left Button */}
      <button className={`absolute left-0 top-1/2 transform ${movies ? "-translate-y-1/2" : "-translate-y-1/3"} rounded-full p-2 ml-4 z-10`} onClick={scrollLeft} >
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 hover:bg-white/70">
          <svg className="w-4 h-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 1 1 5l4 4"/>
          </svg>
        </span>
      </button>

      {/* List */}
      <div ref={scrollRef} className={`flex space-x-4 overflow-x-auto scrollbar-none py-4 px-4`} >
        {/* Movie */}
        {
          movies ? (
            movies.map((movie, index) => (
              <MovieCard movie={movie} theme={theme} index={index} key={index} />
            ))
          ) : (
            genres.map((genre, index) => (
              <GenreCard genre={genre} theme={theme} index={index} key={index} />
            ))
          )
        }


      </div>

      {/* Right Button */}
      <button className={`absolute right-0 top-1/2 transform ${movies ? "-translate-y-1/2" : "-translate-y-1/3 mr-4"} rounded-full p-2 `} onClick={scrollRight} >
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 hover:bg-white/70">
          <svg className="w-4 h-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
          </svg>
        </span>
      </button>
      
    </div>

  );
};

export default HorizontalList;
