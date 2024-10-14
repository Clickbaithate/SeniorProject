import React, { useEffect, useState } from 'react';
import supabase from '../config/supabaseClient';
import Sidebar from './Sidebar';
import SearchBar from '../components/SearchBar.jsx';
import VerticalList from '../components/VerticalList.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const WatchedPage = () => {
    const [movies, setMovies] = useState([]); // Stores the initial 11 movies
    const [filteredMovies, setFilteredMovies] = useState([]); // Stores the filtered movies
    const [filterCount, setFilterCount] = useState(0);
    const [searchText, setSearchText] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();
        handleFilter();
    };

    const handleFilter = () => {
        const filtered = movies.filter((movie) =>
            movie.title.toLowerCase().includes(searchText.toLowerCase())
        );
        setFilteredMovies(filtered);
        incrementFilterCount();
    };

    const incrementFilterCount = () => {
        setFilterCount((prevCount) => prevCount + 1);
    };

    useEffect(() => {
        const fetchMoviesAndProfile = async () => {
            try {
                const { data, error } = await supabase
                    .from('Movies')
                    .select('movie_id, title, image, genres')
                    .in('movie_id', [214, 24, 2, 100, 500, 248, 420634, 129, 533535, 105, 103, 101, 201, 203, 204, 300, 301, 306, 408, 400])
                    .limit(25);

                if (error) {
                    console.error('Error fetching movies:', error);
                } else {
                    setMovies(data);
                    setFilteredMovies(data);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchMoviesAndProfile();
    }, []);

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
                    {filteredMovies.length > 0 ? (
                        <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                        </ul>
                    ) : (
                        <p className="text-md">No movies matched your filter.</p>
                    )}
                </div>

                <VerticalList movies={filteredMovies} />
            </div>
        </div>
    );
};

export default WatchedPage;
