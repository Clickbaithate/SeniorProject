import React, { useEffect, useState } from 'react';
import supabase from '../config/supabaseClient';
import Sidebar from './Sidebar';
import SearchBar from '../components/SearchBar';
import DiscoverCarousel from '../components/DiscoverCarousel';
import { 
  faBomb, faDog, faFaceGrinTears, faFootball, 
  faGhost, faHandFist, faHatCowboy, faHeart, 
  faKiss, faLandmark, faLeaf, faMask, 
  faMaskVentilator, faPeopleGroup, faRadiation, 
  faRocket, faSailboat, faTape, faTheaterMasks 
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import HorizontalList from '../components/HorizontalList';

const genres = [
    { name: 'Sci-fi', value: 'Science Fiction', icon: faRocket },
    { name: 'Action', value: 'action', icon: faHandFist },
    { name: 'Horror', value: 'horror', icon: faRadiation },
    { name: 'Comedy', value: 'comedy', icon: faFaceGrinTears },
    { name: 'Family', value: 'family', icon: faPeopleGroup },
    { name: 'Documentary', value: 'documentary', icon: faLandmark },
    { name: 'Nature', value: 'nature', icon: faLeaf },
    { name: 'Drama', value: 'drama', icon: faHeart },
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
];

const DiscoverPage = () => {

    const [theme, setTheme] = useState('light');
    const [user, setUser] = useState(null);
    const [isToggled, setIsToggled] = useState(localStorage.getItem('theme') === 'dark');
    const [trendingMovies, setTrendingMovies] = useState();
    const [popularMovies, setPopularMovies] = useState();

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

    // fetching user data
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

        const { data: d, error: e } = await supabase.from("Movies").select().in("movie_id", popularIds);
        if (e)
            console.log(e);
        else 
            setPopularMovies(d);

        };

        fetchProfile();
    }, []);
    
    const images = [];

    return (
        <div className={`ml-[100px] ${theme === "light" ? "bg-[#FFFFFF]" : "bg-[#2D2E39]"} `}>
            <Sidebar />
            <SearchBar placeholder="SEARCH..." theme={theme} />
            <DiscoverCarousel movies={[
                {image: "https://4kwallpapers.com/images/wallpapers/oppenheimer-8k-2023-3840x1080-12220.jpg", movie_id: 872585},
                {image: "https://image.tmdb.org/t/p/original/ss0Os3uWJfQAENILHZUdX8Tt1OC.jpg", movie_id: 545611}, 
                {image: "https://images8.alphacoders.com/129/1297243.png", movie_id: 315162}
            ]} />

            <HorizontalList genres={genres} theme={theme} />
            
            <h1 className={`ml-[50px] mt-4 font-body text-3xl ${theme === "light" ? "text-black" : "text-white"}`}>Trending</h1>

            {trendingMovies ? <HorizontalList movies={trendingMovies} theme={theme} /> : <h1>Loading</h1>}

            <h1 className={`ml-[50px] mt-4 font-body text-3xl ${theme === "light" ? "text-black" : "text-white"}`}>Popular</h1>

            {popularMovies ? <HorizontalList movies={popularMovies} theme={theme} /> : <h1>Loading</h1>}


            <div className="h-12" />
        </div>
    );
};

export default DiscoverPage;
