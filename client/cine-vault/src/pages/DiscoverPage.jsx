import React, { useEffect, useState } from 'react';
import supabase from '../config/supabaseClient';
import { Link } from 'react-router-dom';
import Sidebar from './Sidebar';
import SearchBar from './SearchBar';


const DiscoverPage = () => {
    const [movies, setMovies] = useState([]);

    useEffect(() => {
        const fetchMovies = async () => {
        try {
            const { data, error } = await supabase
            .from('Movies')
            .select('movie_id, title, image')
            .limit(20);

            if (error) {
            console.error('Error fetching movies:', error);
            } else {
            setMovies(data);
            }
        } catch (error) {
            console.error('Error fetching movies:', error);
        }
        };

        fetchMovies();
    }, []);

    return(
        <div className="page-layout">
            <Sidebar />
            <div className="content-area">
            <div className="search-bar-container">
                <SearchBar placeholder="SEARCH..." />
                </div>
                <div className="movie-list">
                {movies.length > 0 ? (
                    movies.map(movie => (
                    <div key={movie.movie_id} className="movie-item bg-white shadow-md rounded-lg p-4">
                        <img
                        src={movie.image || 'https://via.placeholder.com/150'}
                        alt={movie.title}
                        className="w-full h-40 object-cover mb-2"
                        />
                        <h3 className="text-lg font-semibold">{movie.title}</h3>
                    </div>
                    ))
                ) : (
                <p>No movies available.</p>
            )}
            </div>
        </div>
    </div>
  );
};
export default DiscoverPage;