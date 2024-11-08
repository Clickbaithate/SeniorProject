import React, { useEffect, useState } from 'react';
import supabase from '../config/supabaseClient';
import Sidebar from './Sidebar';
import SearchBar from '../components/SearchBar.jsx';
import VerticalList from '../components/VerticalList.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

// Random image URL for placeholder
const bannerPlaceholder = "https://picsum.photos/1200/500"; // Random image from Lorem Picsum

const WatchedPage = () => {
    const [movies, setMovies] = useState([]); // Stores the initial 11 movies
    const [shows, setShows] = useState([]);   // Stores the watched shows
    const [filteredMovies, setFilteredMovies] = useState([]); // Stores the filtered movies
    const [filteredShows, setFilteredShows] = useState([]);   // Stores the filtered shows
    const [filterCount, setFilterCount] = useState(0);
    const [searchText, setSearchText] = useState('');
    const [userId, setUserId] = useState(null); // Store user ID here

    const handleSearch = (e) => {
        e.preventDefault();
        handleFilter();
    };

    const handleFilter = () => {
        const filteredMoviesList = movies.filter((movie) =>
            movie.title.toLowerCase().includes(searchText.toLowerCase())
        );
        const filteredShowsList = shows.filter((show) =>
            show.title.toLowerCase().includes(searchText.toLowerCase())
        );

        setFilteredMovies(filteredMoviesList);
        setFilteredShows(filteredShowsList);
        incrementFilterCount();
    };

    const incrementFilterCount = () => {
        setFilterCount((prevCount) => prevCount + 1);
    };

    const toggleWatchedStatus = async (movieId) => {
        const { data, error } = await supabase
            .from('Watched_Movies')
            .select('*')
            .match({ user_id: userId, movie_id: movieId });

        if (data.length > 0) {
            await supabase.from('Watched_Movies').delete().match({ user_id: userId, movie_id: movieId });
        } else {
            await supabase.from('Watched_Movies').insert({ user_id: userId, movie_id: movieId });
        }
        // Refresh data after updating status
        fetchMoviesAndProfile();
    };

    const fetchMoviesAndProfile = async () => {
        if (!userId) return;

        try {
            // Fetch watched movies
            const { data: watchedMovies, error } = await supabase
                .from('Watched_Movies')
                .select('movie_id')
                .eq('user_id', userId);

            if (error) {
                console.error('Error fetching movies:', error);
            } else {
                // Fetch full movie details, including images, from the Movies table
                const movieIds = watchedMovies.map((movie) => movie.movie_id);
                const { data: movieDetails, error: movieError } = await supabase
                    .from('Movies')
                    .select('*')
                    .in('movie_id', movieIds);

                if (movieError) {
                    console.error('Error fetching movie details:', movieError);
                } else {
                    setMovies(movieDetails);
                    setFilteredMovies(movieDetails);
                }
            }

            // Fetch watched shows
            const { data: watchedShows, error: showsError } = await supabase
                .from('Watched_Shows')
                .select('show_id')
                .eq('user_id', userId);

            if (showsError) {
                console.error('Error fetching shows:', showsError);
            } else {
                // Fetch full show details, including images, from the Shows table
                const showIds = watchedShows.map((show) => show.show_id);
                const { data: showDetails, error: showError } = await supabase
                    .from('Shows')
                    .select('*')
                    .in('show_id', showIds);

                if (showError) {
                    console.error('Error fetching show details:', showError);
                } else {
                    setShows(showDetails);
                    setFilteredShows(showDetails);
                }
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        const getUserId = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUserId(user.id);
        };

        // Retrieve user ID and then fetch movies and shows
        getUserId().then(() => {
            if (userId) fetchMoviesAndProfile();
        });
    }, [userId]);

    return (
        <div className={`ml-[100px] min-h-screen bg-theme`}>
            <Sidebar />
            <div>
                <SearchBar placeholder="SEARCH..." />
                <h1 className={`text-lg font-bold ml-8`}>Watched Page</h1>

                <div className={`flex items-center justify-end px-12 font-body`}>
                    <div className="flex items-center justify-center space-x-4">
                        <div className="h-8 w-8 flex items-center justify-center border rounded-full shadow-md">
                            {filterCount}
                        </div>
                        <div
                            onClick={handleFilter}
                            className="cursor-pointer border w-18 h-10 p-4 flex items-center justify-center rounded-lg shadow-md"
                        >
                            Add Filter
                        </div>
                        <form
                            onSubmit={handleSearch}
                            className="flex border items-center rounded-lg p-2 w-64 shadow-md"
                        >
                            <button type="submit" className="mr-2">
                                <FontAwesomeIcon icon={faSearch} className="text-gray-500" />
                            </button>
                            <input
                                type="text"
                                placeholder="Search your movies..."
                                className="w-full focus:outline-none bg-transparent"
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                            />
                        </form>
                    </div>
                </div>

                <div className="ml-8 mt-4">
                    <h2 className="text-2xl font-bold mb-4">Movies</h2>
                    {filteredMovies.length > 0 ? (
                        <VerticalList movies={filteredMovies} toggleWatchedStatus={toggleWatchedStatus} />
                    ) : (
                        <p className="text-md">No movies</p>
                    )}
                    
                    <h2 className="text-2xl font-bold mb-4">Shows</h2>
                    {filteredShows.length > 0 ? (
                        <VerticalList shows={filteredShows} toggleWatchedStatus={toggleWatchedStatus} />
                    ) : (
                        <p className="text-md">No shows</p>
                    )}
                </div>
            </div>
        </div>
    );
    
};

export default WatchedPage;
