import React, { useEffect, useState } from 'react';
import supabase from '../config/supabaseClient';
import Sidebar from './Sidebar';
import SearchBar from '../components/SearchBar.jsx';
import "../App.css";

const WatchedPage = () => {
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
    const [user, setUser] = useState(null);
    const [watchedMovies, setWatchedMovies] = useState([]);

    // fetching user data and watched movies
    useEffect(() => {
        const fetchProfileAndWatchedMovies = async () => {
            const { data: { session }, error: sessionError } = await supabase.auth.getSession();

            if (sessionError) {
                console.warn(sessionError);
                return;
            }

            if (session) {
                // Fetch user profile
                const { data: userData, error: userError } = await supabase
                    .from('Users')
                    .select()
                    .eq('user_id', session.user.id)
                    .single();

                if (userError) {
                    console.warn('Error fetching profile:', userError);
                } else if (userData) {
                    setUser(userData);
                    setTheme(userData.theme_settings ? 'dark' : 'light');
                }

                // Fetch watched movies for the user
                const { data: moviesData, error: moviesError } = await supabase
                    .from('Watched_Movies')
                    .select('movie_id')
                    .eq('user_id', session.user.id);

                if (moviesError) {
                    console.warn('Error fetching watched movies:', moviesError);
                } else {
                    setWatchedMovies(moviesData);
                }
            }
        };

        fetchProfileAndWatchedMovies();
    }, []);

    return (
        <div className={`ml-[100px] min-h-screen ${theme === "light" ? "bg-[#FFFFFF]" : "bg-[#2D2E39]"}`}>
            <Sidebar />
            <div>
                <div>
                    <SearchBar placeholder="SEARCH..." theme={theme} />
                </div>
                <h1 className={`text-lg font-bold ml-8 ${theme === "light" ? "text-black" : "text-white"}`}>Watched Page</h1>
                
                <div className="ml-8 mt-4">
                    {watchedMovies.length > 0 ? (
                        <ul className="space-y-4">
                            {watchedMovies.map((movie, index) => (
                                <li key={index} className={`text-md ${theme === 'light' ? 'text-black' : 'text-white'}`}>
                                    Movie ID: {movie.movie_id}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className={`text-md ${theme === 'light' ? 'text-black' : 'text-white'}`}>
                            No movies watched yet.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default WatchedPage;
