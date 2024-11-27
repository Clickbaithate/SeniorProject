import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import supabase from "../config/supabaseClient";
import Sidebar from './Sidebar';
import SearchBar from '../components/SearchBar.jsx';
import HorizontalList from '../components/HorizontalList';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const UserProfile = () => {
  const { id } = useParams(); // Get user_id from URL params
  const [user, setUser] = useState(null);
  const [watchedMovies, setWatchedMovies] = useState([]);
  const [watchedShows, setWatchedShows] = useState([]);
  const [theme, setTheme] = useState('light'); // Default theme

  // Fetch user profile and watched data
  useEffect(() => {
    const fetchProfileData = async () => {
      if (!id) return;

      try {
        const { data: userData, error: userError } = await supabase
          .from("Users")
          .select("user_id, username, profile_picture, bio, theme_settings")
          .eq("username", id)
          .single();

        if (userError) {
          console.error("Error fetching user data:", userError);
          return;
        }
        setUser(userData);

        // Apply the theme
        const userTheme = userData.theme_settings ? 'dark' : 'light';
        setTheme(userTheme);
        document.body.classList.toggle('dark', userTheme === 'dark'); // Toggle dark mode on body

        // Fetch watched movies for this user
        const { data: watchedMoviesData, error: moviesError } = await supabase
          .from("Watched_Movies")
          .select("movie_id")
          .eq("user_id", userData.user_id);

        if (moviesError) {
          console.error("Error fetching watched movies:", moviesError);
        } else {
          const movieIds = watchedMoviesData.map((movie) => movie.movie_id);
          const { data: movieDetails, error: movieError } = await supabase
            .from("Movies")
            .select("*")
            .in("movie_id", movieIds);

          if (movieError) {
            console.error("Error fetching movie details:", movieError);
          } else {
            setWatchedMovies(movieDetails);
          }
        }

        // Fetch watched shows for this user
        const { data: watchedShowsData, error: showsError } = await supabase
          .from("Watched_Shows")
          .select("show_id")
          .eq("user_id", userData.user_id);

        if (showsError) {
          console.error("Error fetching watched shows:", showsError);
        } else {
          const showIds = watchedShowsData.map((show) => show.show_id);
          const { data: showDetails, error: showError } = await supabase
            .from("Shows")
            .select("*")
            .in("show_id", showIds);

          if (showError) {
            console.error("Error fetching show details:", showError);
          } else {
            setWatchedShows(showDetails);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchProfileData();
  }, [id]);

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <DotLottieReact
          src="https://lottie.host/beb1704b-b661-4d4c-b60d-1ce309d639d5/7b3aX5rJYc.json"
          loop
          autoplay
          className="w-12 h-12"
        />
      </div>
    );
  }

  return (
    <div className={`ml-[100px] min-h-screen ${theme === 'dark' ? 'bg-theme ' : 'bg-theme '}`}>
      <Sidebar />
      <SearchBar placeholder="SEARCH..." />
      <div className="max-w-3xl mx-auto py-8">
        {/* User Profile Header */}
        <header className={`p-4 mb-8 ${theme === 'dark' ? 'bg-theme' : 'bg-theme'} text-center`}>
          <h1 className="text-xl font-bold">{user.username}</h1>
        </header>

        {/* Profile Picture and Username */}
        <div className="flex justify-center items-center flex-col mb-8">
          <img
            src={user.profile_picture || "https://via.placeholder.com/150"}
            alt="Profile"
            className="rounded-full h-40 w-40 object-cover mb-4"
          />
          <h2 className="text-2xl font-semibold mb-2">{user.username}</h2>
          {/* Display Bio */}
          <p className="text-lg text-center mb-4">{user.bio || "No bio available."}</p>
           {/* Add Friend Button */}
           <button
            className="px-4 py-2 mt-4 text-white bg-blue-500 rounded-full hover:bg-blue-600 focus:outline-none"
          >
            Add Friend
          </button>

          <div className="flex justify-around w-full max-w-3xl mb-8">
            <div className="text-center">
              <h3 className="text-xl font-semibold">Movies</h3>
              <p className="text-lg">{watchedMovies.length}</p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold">Shows</h3>
              <p className="text-lg">{watchedShows.length}</p>
            </div>
          </div>
        </div>

        {/* Watched Movies */}
        <h3 className="text-2xl font-semibold mb-4">Watched Movies</h3>
        {watchedMovies.length > 0 ? (
          <HorizontalList movies={watchedMovies} />
        ) : (
          <p>No movies watched yet.</p>
        )}

        {/* Watched Shows */}
        <h3 className="text-2xl font-semibold mb-4 mt-8">Watched Shows</h3>
        {watchedShows.length > 0 ? (
          <HorizontalList shows={watchedShows} />
        ) : (
          <p>No shows watched yet.</p>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
