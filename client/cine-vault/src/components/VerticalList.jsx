import React from 'react';
import MovieCard from './movieCard';
import GenreCard from './genreCard';
import UserCard from './userCard';
import ShowCard from './showCard';

const VerticalList = ({ movies, shows, genres, users, theme = 'light' }) => {
  return (
    <div className="mx-12 pt-4">
      <div
        className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 py-4 px-4 justify-center items-start mx-auto`}
      >
        {/* Movies */}
        {movies && movies.length > 0
          ? movies.map((movie, index) => (
              <MovieCard movie={movie} theme={theme} index={index} key={index} />
            ))
          : shows && shows.length > 0
          ? shows.map((show, index) => (
              <ShowCard show={show} theme={theme} index={index} key={index} />
            ))
          : genres && genres.length > 0
          ? genres.map((genre, index) => (
              <GenreCard genre={genre} theme={theme} index={index} key={index} />
            ))
          : users &&
            users.map((user, index) => (
              <UserCard user={user} theme={theme} index={index} key={index} />
            ))}
      </div>
    </div>
  );
};

export default VerticalList;
