import React, { useEffect, useState } from 'react';
import supabase from '../config/supabaseClient';
import Sidebar from './Sidebar';
import SearchBar from '../components/SearchBar';
import DiscoverCarousel from '../components/DiscoverCarousel';
import HorizontalList from '../components/HorizontalList';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { faBomb, faDog, faFaceGrinTears, faFootball, faGhost, faHandFist, faHatCowboy, faHeart, faHouse, faKiss, faLandmark, faLeaf, faMask, faMaskVentilator, faPeopleGroup, faRadiation, faRocket, faSailboat, faTape, faTheaterMasks, } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


const genres = [
    { name: 'Sci-Fi', value: 'Science Fiction', icon: faRocket },
    { name: 'Action', value: 'action', icon: faHandFist },
    { name: 'Horror', value: 'horror', icon: faRadiation },
    { name: 'Comedy', value: 'comedy', icon: faFaceGrinTears },
    { name: 'Family', value: 'family', icon: faPeopleGroup },
    { name: 'Documentary', value: 'documentary', icon: faLandmark },
    { name: 'Drama', value: 'drama', icon: faHeart },
    { name: 'Western', value: 'western', icon: faHatCowboy },
    { name: 'Fantasy', value: 'fantasy', icon: faMask },
    { name: 'Thriller', value: 'thriller', icon: faGhost },
    { name: 'Romance', value: 'romance', icon: faKiss },
    { name: 'Musical', value: 'musical', icon: faTheaterMasks },
    { name: 'War', value: 'war', icon: faBomb },
    { name: 'Animation', value: 'animation', icon: faDog },
    { name: 'Crime', value: 'crime', icon: faTape },
    { name: 'Mystery', value: 'mystery', icon: faMaskVentilator },
    { name: 'Adventure', value: 'adventure', icon: faSailboat },
];

const DiscoverPage = () => {
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
    const [user, setUser] = useState(null);
    const [isToggled, setIsToggled] = useState(localStorage.getItem('theme') === 'dark');
    const [trendingMovies, setTrendingMovies] = useState();
    const [popularMovies, setPopularMovies] = useState();
    const [trendingShows, setTrendingShows] = useState();
    const [popularShows, setPopularShows] = useState();
    const [selectedGenre, setSelectedGenre] = useState(null);
    const [filteredMovies, setFilteredMovies] = useState([]);
    const [filteredShows, setFilteredShows] = useState([]);


    const movieIds = [
        122,
        4011,
        420634,
        475557,
        533535,
        567811,
        619264,
        663712,
        698687,
        726139,
        748230,
        807339,
        877817,
        889737,
        917496,
        923667,
        933260,
        945961,
        949484,
        957452,
        1022789,
        1029281,
        1034541,
        1052280,
        1062215,
        1064028,
        1066262,
        1079091,
        1087822,
        1114513,
        1125510,
        1129598,
        1139817,
        1147710,
        1160018,
        1184918,
        1186532,
        1186947,
        1190868,
        1207830,
        1215162,
        1226578,
        1248753,
    ];

    const popularIds = [
        278,
        238,
        240,
        424,
        389,
        129,
        19404,
        155,
        496243,
        497,
        680,
        13,
        372058,
        122,
        769,
        429,
        346,
        12477,
        157336,
        324857,
        1891,
        244786,
        569094,
        27205,
        18491,
        105,
        128,
        274,
        620249
    ];

    const showIds = [
        112470,
        82708,
        247174,
        247884,
        72879,

        260196,
        262252,
        75269,
        61818,
        2224,

        1416,
        2734,
        2051,
        114439,
        549,

        1871,
        1489,
        75219,
        103147,
        92621
    ];

    const popularShowIds = [
        1434,
        1433,
        131041,
        456,
        4614,

        1399,
        79744,
        17404,
        12971,
        1408,

        1405,
        1421,
        63174,
        71712,
        37680,

        1396,
        30984,
        60574,
        95479,
        76479
    ];

    // Fetch user data
    useEffect(() => {
        const fetchProfile = async () => {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
            console.warn(sessionError);
            return;
        }

        if (session) {
            const { data, error } = await supabase
            .from('Users')
            .select()
            .eq('user_id', session.user.id)
            .single();

            if (error) {
            console.warn('Error fetching profile:', error);
            } else if (data) {
            setUser(data);
            setIsToggled(data.theme_settings);
            setTheme(data.theme_settings ? 'dark' : 'light');
            }
        }

        const { data, error } = await supabase.from("Movies").select().in("movie_id", movieIds);
        if (error)
            console.log(error);
        else 
            setTrendingMovies(data);
        //
        const { data: d, error: e } = await supabase.from("Movies").select().in("movie_id", popularIds);
        if (e)
            console.log(e);
        else 
            setPopularMovies(d);
        //
        const { data: da, error: er } = await supabase.from("Shows").select().in("show_id", showIds);
        if (er)
            console.log(er);
        else 
            setTrendingShows(da);
        //
        const { data: dat, error: err } = await supabase.from("Shows").select().in("show_id", popularShowIds);
        if (err)
            console.log(err);
        else 
            setPopularShows(dat);
        //

        };

        fetchProfile();
    }, []);
    
    const images = [];

    const handleGenreSelect = async (genre) => {
        if (selectedGenre === genre) {
            setSelectedGenre(null);
            setFilteredMovies([]);
            setFilteredShows([]);
        } else {
            setSelectedGenre(genre);
    
            try {
                const { data: moviesData, error: moviesError } = await supabase
                    .from('Movies')
                    .select('*')
                    .ilike('genres', `%${genre}%`)
                    .gt('rating', 7)
                    .limit(30);
    
                if (moviesError) {
                    console.error('Error fetching movies:', moviesError);
                }
    
                // Fetch filtered shows from Supabase
                const { data: showsData, error: showsError } = await supabase
                    .from('Shows')
                    .select('*')
                    .ilike('genres', `%${genre}%`)
                    .gt('rating', 7)
                    .limit(30);
    
                if (showsError) {
                    console.error('Error fetching shows:', showsError);
                }
    
                setFilteredMovies(moviesData || []);
                setFilteredShows(showsData || []);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
    };
    


    return (
        <div className={`ml-[100px] min-h-screen `}>
            <Sidebar />
            <SearchBar placeholder="SEARCH..." />
            <DiscoverCarousel movies={[
                {image: "https://4kwallpapers.com/images/wallpapers/oppenheimer-8k-2023-3840x1080-12220.jpg", movie_id: 872585},
                {image: "https://image.tmdb.org/t/p/original/ss0Os3uWJfQAENILHZUdX8Tt1OC.jpg", movie_id: 545611}, 
                {image: "https://images8.alphacoders.com/129/1297243.png", movie_id: 315162}
            ]} />

            <div className="flex gap-4 my-5 overflow-x-auto px-10">
                {genres.map((genre) => (
                    <button
                        key={genre.value}
                        className={`flex items-center px-12 py-9 text-white rounded-lg text-sm uppercase transition-colors duration-300 ${
                            selectedGenre === genre.value
                                ? 'bg-red-500 text-white'
                                : 'hover:bg-gray-600'
                        }`}
                        style={{
                            backgroundColor:
                                selectedGenre === genre.value
                                    ? '#FF4C60'
                                    : theme === 'dark'
                                    ? '#25262F'
                                    : '#E4E4E4',
                            color: theme === 'dark' ? '#FFFFFF' : '#000000',
                        }}
                        onClick={() => handleGenreSelect(genre.value)}
                    >
                        {genre.icon && (
                            <FontAwesomeIcon icon={genre.icon} className="mr-2 text-lg" />
                        )}
                        <span className="whitespace-nowrap">{genre.name}</span>
                    </button>
                ))}
            </div>


                <h1 className={`ml-[50px] mt-4 font-body text-3xl text-theme`}>
                    {selectedGenre ? `Top Rated Movies for ${selectedGenre}` : 'Trending Movies'}
                </h1>
                {
                    selectedGenre && filteredMovies.length > 0
                        ? <HorizontalList movies={filteredMovies} />
                        : trendingMovies
                        ? <HorizontalList movies={trendingMovies} />
                        : <div className="flex flex-col justify-center items-center">
                            <DotLottieReact
                                src="https://lottie.host/beb1704b-b661-4d4c-b60d-1ce309d639d5/7b3aX5rJYc.json"
                                loop
                                autoplay
                                className="w-12 h-12"
                            />
                        </div>
                }

                <h1 className={`ml-[50px] mt-4 font-body text-3xl text-theme`}>
                    {selectedGenre ? `Top Rated Shows for ${selectedGenre}` : 'Trending Shows'}
                </h1>
                {
                    selectedGenre && filteredShows.length > 0
                        ? <HorizontalList shows={filteredShows} />
                        : trendingShows
                        ? <HorizontalList shows={trendingShows} />
                        : <div className="flex flex-col justify-center items-center">
                            <DotLottieReact
                                src="https://lottie.host/beb1704b-b661-4d4c-b60d-1ce309d639d5/7b3aX5rJYc.json"
                                loop
                                autoplay
                                className="w-12 h-12"
                            />
                        </div>
                }
            <div className="h-12" />
        </div>
    );
};

export default DiscoverPage;
