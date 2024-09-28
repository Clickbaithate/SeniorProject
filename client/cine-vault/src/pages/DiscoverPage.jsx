import React, { useEffect, useState } from 'react';
import supabase from '../config/supabaseClient';
import Sidebar from './Sidebar';
import SearchBar from './SearchBar';
import SwipingImageCarousel from './SwipingImageCarousel'; 
import { faBomb, faDog, faFaceGrinTears, faFootball, faGhost, faHandFist, faHatCowboy, faHeart, faHouse, faKiss, faLandmark, faLeaf, faMask, faMaskVentilator, faPeopleGroup, faRadiation, faRocket, faSailboat, faTape, faTheaterMasks, } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


const genres = [
    {name: 'Sci-fi', value: 'Science Fiction', icon: faRocket},
    { name: 'Action', value: 'action', icon: faHandFist },
    { name: 'Horror', value: 'horror', icon: faRadiation },
    { name: 'Comedy', value: 'comedy', icon: faFaceGrinTears },
    { name: 'Family', value: 'family', icon: faPeopleGroup },
    { name: 'Documentary', value: 'documentary', icon: faLandmark },
    { name: 'Nature', value: 'nature', icon: faLeaf },
    { name: 'Darma', value: 'drama', icon: faHeart },
    { name: 'Western', value: 'western', icon: faHatCowboy },
    { name: 'Fantasy', value: 'fantasy', icon: faMask },
    { name: 'Thriller', value: 'thriller', icon: faGhost },
    { name: 'Romance', value: 'romance', icon: faKiss },
    { name: 'Musical', value: 'musical', icon: faTheaterMasks },
    { name: 'War', value: 'war', icon: faBomb },
    { name: 'Animation', value: 'animation', icon: faDog },
    { name: 'Crime', value: 'crime', icon: faTape },
    { name: 'Sports', value: 'sports', icon: faFootball },
    { name: 'Mystery', value: 'mystery', icon: faMaskVentilator },
    { name: 'Adventure', value: 'adventure', icon: faSailboat },
]

const DiscoverPage = () => {
    const [movies, setMovies] = useState([]);
    const [filteredMovies, setFilteredMovies] = useState([]);
    const [selectedGenre, setSelectedGenre] = useState(null);

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const { data, error } = await supabase
                    .from('Movies')
                    .select('movie_id, title, image, genres')
                    .limit(100);

                if (error) {
                    console.error('Error fetching movies:', error);
                } else {
                    setMovies(data);
                    setFilteredMovies(data);
                }
            } catch (error) {
                console.error('Error fetching movies:', error);
            }
        };

        fetchMovies();
    }, []);

    const handleGenreSelect = (genre) => {
        if (selectedGenre === genre){
            setSelectedGenre(null);
            setFilteredMovies(movies);
        }else{
            setSelectedGenre(genre);
            const filtered = movies.filter((movie) =>{
                    if (movie.genres){
                        const movieGenres = movie.genres.split(',').map((g) => g.trim().toLowerCase());
                        return movieGenres.includes(genre.toLowerCase());
                    }
                    return false;
                });
                setFilteredMovies(filtered);
        }
    };

    return (
        <div className="page-layout">
            <Sidebar />
            <div className="content-area">
                <div className="search-bar-container">
                    <SearchBar placeholder="SEARCH..." />
                </div>
                <SwipingImageCarousel />
                <div className="genre-filters">
                    {genres.map((genre) => (
                        <button
                            key={genre.value}
                            className={`genre-button ${
                                selectedGenre === genre.value ? 'active' : ''
                            }`}
                            onClick={() => handleGenreSelect(genre.value)}
                        >
                            {genre.icon && <FontAwesomeIcon icon={genre.icon} style={{marginRight: '2px'}} />}
                            {genre.name}
                        </button>
                    ))}
                </div>
                    
                <h2 className="section-title">
                    {selectedGenre ? genres.find(g => g.value === selectedGenre).name : 'Trending'}
                </h2>
                <div className="movie-list-container">
                    {filteredMovies.length > 0 ? (
                        filteredMovies.map((movie) => (
                            <div key={movie.movie_id} className="movie-item">
                                <img
                                    src={movie.image || 'https://via.placeholder.com/150'}
                                    alt={movie.title}
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