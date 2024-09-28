import React, { useEffect, useState } from 'react';
import supabase from '../config/supabaseClient';
import { Link } from 'react-router-dom';
import Sidebar from './Sidebar';


const HomePage = () => {

  const [user, setUser] = useState(null);
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {

    // Getting user data
    const fetchUserData = async () => {
      try {

        // Getting the users current session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          console.error('Error fetching session:', sessionError);
          return;
        }

        // Getting some of the users data, might depending on what we show the user
        if (session) {
          const { data, error } = await supabase
            .from('Users')
            .select('username, profile_picture')
            .eq('user_id', session.user.id)
            .single();

          if (error) {
            console.error('Error fetching user data:', error);
          } else {
            setUser(data);
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    // Getting 10 movies
    // This will change, just testing if movie retrieval works
    const fetchMovies = async () => {
      try {
        const { data, error } = await supabase
          .from('Movies')
          .select('movie_id, title, image')
          .limit(10);

        if (error) {
          console.error('Error fetching movies:', error);
        } else {
          setMovies(data);
        }
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    };

    fetchUserData();
    fetchMovies();
  }, []);

  // Testing logout feature
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center p-6">
      <Sidebar />
      <div className="w-full max-w-3xl bg-gray-900 shadow-md rounded-lg p-6 mb-6">
        <h1 className="text-4xl font-bold mb-4">Welcome to the Movie Tracker App!</h1>
        {user && (
          <div className="flex items-center mb-6">
            <img
              src={user.profile_picture || 'https://via.placeholder.com/100'}
              alt="Profile"
              className="w-24 h-24 rounded-full mr-4"
            />
            <div>
              <h2 className="text-2xl font-semibold">{user.username}</h2>
              <p className="text-lg text-gray-700">This is your home page!</p>
            </div>
          </div>
        )}
        {/* Uncomment below for testing purposes if needed */}
        {/* <Link to="/profileSetup" className="text-blue-500 hover:underline text-lg mb-4">
          Edit your profile!
        </Link>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600"
        >
          Log Out
        </button> */}
      </div>

      <div className="w-full max-w-3xl">
        <h2 className="text-2xl font-bold mb-4">Movies</h2>
        {movies.length > 0 ? (
          <div className="flex overflow-x-scroll space-x-4">
            {movies.map(movie => (
              <div key={movie.movie_id} className="bg-gray-900 shadow-md rounded-lg p-4 flex-shrink-0 w-40">
                <img
                  src={movie.image || 'https://via.placeholder.com/150'}
                  alt={movie.title}
                  className="w-full h-24 object-cover mb-2"
                />
                <h3 className="text-lg font-semibold">{movie.title}</h3>
              </div>
            ))}
          </div>
        ) : (
          <p>No movies available.</p>
        )}
      </div>
    </div>
  );
};

export default HomePage;
