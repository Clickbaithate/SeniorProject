import React, { useEffect, useState } from 'react';
import supabase from '../config/supabaseClient';
import Sidebar from './Sidebar';
import SearchBar from '../components/SearchBar.jsx';
import "../App.css";

const WatchedPage = () => {
    const [movies, setMovies] = useState([]);

    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
    const [user, setUser] = useState(null);
    const [watchedMovies, setWatchedMovies] = useState([]);

    useEffect(() => {
        const fetchMoviesAndProfile = async () => {
            try {
                const { data, error } = await supabase
                    .from('Movies')
                    .select('movie_id, title, image, genres')
                    .limit(11);

                if (error) {
                    console.error('Error fetching movies:', error);
                } else {
                    setMovies(data);
                }

                const { data: { session }, error: sessionError } = await supabase.auth.getSession();

                if (sessionError) {
                    console.warn(sessionError);
                    return;
                }

                if (session) {
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

                    const { data: moviesData, error: moviesError } = await supabase
                        .from('Watched_Movies')
                        .select('movie_id')
                        .eq('user_id', session.user.id);

                    if (moviesError) {
                        console.warn('Error fetching watched movies:', moviesError);
                    } else {
                        const watchedMovieIds = moviesData.map((movie) => movie.movie_id);
                        setWatchedMovies(watchedMovieIds); 
                    }
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchMoviesAndProfile();
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
                            {/* No movies watched yet. */}
                        </p>
                    )}
                </div>

                <div className="grid-cols-5 gap-[10px] grid">
                        {movies.length > 0 ? (
                            movies.map((movie)=>(
                                <div key={movie.movie_id} className={`w-[200px] p-2.5 hover:scale-110 duration-500 cursor-pointer ${theme === "light" ? "bg-[#FFFFFF]" : "bg-[#2D2E39]"}`}>
                                    <div className='w-full'>
                                    <img
                                        src={movie.image || 'https://via.placeholder.com/150'}
                                        alt={movie.title}
                                        className="w-full h-[250px] object-cover rounded-[10px] mb-2 "
                                    />
                                    </div>
                                    <h3 className={`text-lg font-semibold ${theme === 'light' ? 'text-black' : 'text-white'}`}>{movie.title}</h3>
                                </div>
                            ))
                            ):(
                                <p>No movies available.</p>
                        )}
                    </div>
            </div>
        </div>
    );
};

export default WatchedPage;
