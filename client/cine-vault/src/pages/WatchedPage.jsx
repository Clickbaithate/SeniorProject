import React, { useEffect, useState } from 'react';
import supabase from '../config/supabaseClient';
import Sidebar from './Sidebar';
import SearchBar from '../components/SearchBar.jsx';
import VerticalList from '../components/VerticalList.jsx';
import "./theme.css";

const WatchedPage = () => {

    const [movies, setMovies] = useState([]);
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
        <div className={`ml-[100px] min-h-screen bg-theme `}>
            <Sidebar />
            <div>
                <div>
                    <SearchBar placeholder="SEARCH..." />
                </div>
                <h1 className={`text-lg font-bold ml-8 `}>Watched Page</h1>
                
                <div className="ml-8 mt-4">
                    {watchedMovies.length > 0 ? (
                        <ul className="space-y-4">
                            {watchedMovies.map((movie, index) => (
                                <li key={index} className={`text-md `}>
                                    Movie ID: {movie.movie_id}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className={`text-md `}>
                            {/* No movies watched yet. */}
                        </p>
                    )}
                </div>

                <VerticalList movies={movies} />

            </div>
        </div>
    );
};

export default WatchedPage;
