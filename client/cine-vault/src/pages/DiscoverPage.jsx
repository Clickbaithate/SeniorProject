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
    const [isToggled, setIsToggled] = useState(
        localStorage.getItem('theme') === 'dark'
    );

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
            console.log(data.profile_picture);
            setIsToggled(data.theme_settings);
            setTheme(data.theme_settings ? 'dark' : 'light');
            }
        }
        };

        fetchProfile();
    }, []);

    // Movies data
    const trendingMovies = [
        { title: "Avengers: Infinity War", poster: "https://m.media-amazon.com/images/I/71eHZFw+GlL._AC_UF894,1000_QL80_.jpg", id: 1 },
        { title: "Moonlight", poster: "https://posterhouse.org/wp-content/uploads/2021/05/moonlight_0.jpg", id: 2 },
        { title: "Encanto", poster: "https://lumiere-a.akamaihd.net/v1/images/p_encanto_homeent_22359_4892ae1c.jpeg", id: 3 },
        { title: "Inside Out 2", poster: "https://cdn.moviefone.com/admin-uploads/posters/insideout2-movie-poster_1709834077.jpg?d=360x540&q=80", id: 4 },
        { title: "Love Again", poster: "https://m.media-amazon.com/images/M/MV5BODIxY2NkYWEtNWE3ZS00NDZhLWFlMDktMTE0NDNlZDk0MzAyXkEyXkFqcGc@._V1_.jpg", id: 5 },
        { title: "Scary Movie", poster: "https://m.media-amazon.com/images/M/MV5BZGRmMGRhOWMtOTk3Ni00OTRjLTkyYTAtYzA1M2IzMGE3NGRkXkEyXkFqcGc@._V1_.jpg", id: 6 },
        { title: "Beetlejuice Beetlejuice", poster: "https://all.web.img.acsta.net/img/88/01/8801185034fbb3e22b654c923f649201.jpg/r_2500_x", id: 7 },
        { title: "Elemental", poster: "https://lumiere-a.akamaihd.net/v1/images/p_disneyplusoriginals_elemental_poster_rebrand_a0788af2.jpeg", id: 8 },
        { title: "The Garfield Movie", poster: "https://all.web.img.acsta.net/img/91/41/91412fbc0ed5d0bf8962e9d9523da195.jpg", id: 9 },
        { title: "Wish", poster: "https://upload.wikimedia.org/wikipedia/en/d/de/WishMoviePoster.jpg", id: 10 },
        { title: "Us", poster: "https://www.indiewire.com/wp-content/uploads/2019/12/us-1.jpg?w=758", id: 11 },
        { title: "Deadpool & Wolverine", poster: "https://cdn.marvel.com/content/1x/deadpoolandwolverine_lob_crd_03.jpg", id: 12 },
        { title: "Avatar: The Way of Water", poster: "https://images.squarespace-cdn.com/content/v1/5a7f41ad8fd4d236a4ad76d0/1669842753281-3T90U1EY5HUNCG43XERJ/A2_Poster_DC_v80_PAYOFF_221029_12trimHD.jpg", id: 13 },
        { title: "Pixels", poster: "https://m.media-amazon.com/images/M/MV5BMzIyNTc1NmUtOTBlNS00YzEwLTlkZTMtZjJkMGM2YzNkYmY3XkEyXkFqcGc@._V1_.jpg", id: 14 },
        { title: "A Quiet Place: Day One", poster: "https://wwwimage-us.pplusstatic.com/thumbnails/photos/w370-q80/movie_asset/54/87/88/movie_asset_a9b1404e-51eb-4e95-8665-5c2d83a59b6c.jpg", id: 15 },
    ];
    
    const becauseYouWatchedMovies = [
        { title: "Avengers", poster: "https://www.anythinklibraries.org/sites/default/files/styles/full/public/the_avengers.jpg?itok=pyYFzE_z", id: 1 },
        { title: "Avengers: Infinity War", poster: "https://i.ebayimg.com/images/g/vmoAAOSwM~1gol-e/s-l400.jpg", id: 2 },
        { title: "Doctor Strange: Multiverse of Madness", poster: "https://static.wixstatic.com/media/c0ca52_861cbfbd84344362a233f609406354cd~mv2.jpg/v1/fill/w_540,h_675,al_c,q_85,enc_auto/c0ca52_861cbfbd84344362a233f609406354cd~mv2.jpg", id: 3 },
        { title: "Ant-Man and the Wasp", poster: "https://cdn.posteritati.com/posters/000/000/056/046/antman-and-the-wasp-sm-web.jpg", id: 4 },
        { title: "Thor: Ragnarok", poster: "https://townsquare.media/site/442/files/2017/10/thor_ragnarok_ver2_xlg1.jpg?w=780&q=75", id: 5 },
        { title: "Black Panther", poster: "https://blog.printkeg.com/wp-content/uploads/2019/03/black-panther-poster.jpg", id: 6 },
        { title: "Ms. Marvel", poster: "https://i.etsystatic.com/18242346/r/il/bd83d7/4015944809/il_570xN.4015944809_q17a.jpg", id: 7 },
        { title: "Ant-Man", poster: "https://i.redd.it/what-have-been-some-of-your-favorite-marvel-movie-posters-v0-hefukfv1updd1.jpg?width=760&format=pjpg&auto=webp&s=7c39e90fa47cd9081f22823cbbac22a9e1a47214", id: 8 },
        { title: "Iron Man", poster: "https://lh5.googleusercontent.com/proxy/whJNlo-w4QVV9DV1LJklWYJ39FyYnEj547rB25XNrlzkJ4cnWuZgF4O3PqsWdQ5gfyD6Ja4g1eJn7JMYdppJNsmWbN1iboT3mApVFkz7", id: 9 },
        { title: "Thunderbolts", poster: "https://cdn.marvel.com/content/1x/thunderbolts_lob_crd_03.jpg", id: 10 },
        { title: "Spider-Man: Far From Home", poster: "https://i.etsystatic.com/18242346/r/il/eb594f/1929825990/il_570xN.1929825990_8vdi.jpg", id: 11 },
        { title: "Black Widow", poster: "https://images.sellbrite.com/production/152272/P6640-FRALU026/a945c39f-9685-546f-a4ec-dafbaa1171c3.jpg", id: 12 },
        { title: "The Incredible Hulk", poster: "https://lh6.googleusercontent.com/proxy/WD58c-Gy7j-0Pkc1GGcwo8KN3jLZjpGj1AzZOoCq9EDTToDXxPh57b7eN5dnCweL1rwFvaseMTvuS9ZgUb0ApWwSsaVKV-XtEL5kGcNJlWM", id: 13 },
        { title: "Captain America: Civil War", poster: "https://i0.wp.com/thinkmonsters.com/speakinghuman/media/wp-content/uploads/MOVIE_CaptainAmerica_CivilWar.jpg?resize=540%2C810&ssl=1", id: 14 },
        { title: "Thor: Love and Thunder", poster: "https://static0.srcdn.com/wordpress/wp-content/uploads/2023/03/thor-love-and-thunder-poster.jpeg", id: 15 },
    ];
    
    const basedOnFriendsWatchedMovies = [
        { title: "The Batman", poster: "https://m.media-amazon.com/images/I/81Bivc7COzL.jpg", id: 1 },
        { title: "Batman v Superman", poster: "https://m.media-amazon.com/images/I/41YfbMnKAOL._AC_.jpg", id: 2 },
        { title: "The Dark Knight", poster: "https://m.media-amazon.com/images/I/51pzUy6sy9L._AC_.jpg", id: 3 },
        { title: "The Flash", poster: "https://m.media-amazon.com/images/I/81A+ZsNLBcL.jpg", id: 4 },
        { title: "The Amazing Spider-Man", poster: "https://www.indiewire.com/wp-content/uploads/2017/05/the-amazing-spider-man-2012.jpg?w=674", id: 5 },
        { title: "Man of Steel", poster: "https://townsquare.media/site/442/files/2022/10/attachment-man_of_steel_ver2_xlg.jpg?w=780&q=75", id: 6 },
        { title: "Superman Returns", poster: "https://townsquare.media/site/442/files/2022/10/attachment-superman_returns_ver2_xlg.jpg?w=780&q=75", id: 7 },
        { title: "Suicide Squad", poster: "https://target.scene7.com/is/image/Target/GUEST_d5c35233-876d-444d-a7d6-caa7a2e7b2a9?wid=488&hei=488&fmt=pjpeg", id: 8 },
        { title: "Justice League", poster: "https://stampede.clearfield.org/wp-content/uploads/2017/11/Justice-League-Poster-Comic-Book-Movie.jpg", id: 9 },
        { title: "Supergirl", poster: "https://townsquare.media/site/442/files/2022/10/attachment-supergirl_xlg.jpg?w=780&q=75", id: 10 },
        { title: "Finding Nemo", poster: "https://www.filmposters.com/images/posters/21847.jpg", id: 11 },
        { title: "The Princess and The Frog", poster: "https://cdn.abcotvs.com/dip/images/413466_112614-cc-disney-posters-princessfrog-img.jpg", id: 12 },
        { title: "The Lion King", poster: "https://i.etsystatic.com/15472631/r/il/3a35e8/3774140902/il_570xN.3774140902_3nma.jpg", id: 13 },
        { title: "The Incredibles", poster: "https://preview.redd.it/what-is-the-most-badass-animated-movie-poster-youve-ever-v0-bz8ouezwx9kd1.jpeg?width=1800&format=pjpg&auto=webp&s=9e2e90fb46b07e09cbd266d641f1e02f95b78fe2", id: 14 },
        { title: "Aladdin", poster: "https://www.filmposters.com/images/posters/19085.jpg", id: 15 },
    ];
    
    const images = [];

    return (
        <div className={`ml-[100px] ${theme === "light" ? "bg-[#FFFFFF]" : "bg-[#2D2E39]"} `}>
            <Sidebar />
            <SearchBar placeholder="SEARCH..." theme={theme} />
            <DiscoverCarousel images={[
                "https://www.nbc.com/sites/nbcblog/files/2023/03/the-super-mario-bros-movie-poster-1.jpg", 
                "https://pbs.twimg.com/media/DcLE2UKVwAUlWK0?format=jpg&name=large", 
                "https://static1.squarespace.com/static/56a1633ac21b86f80ddeacb4/t/6606c3b0001a0f275cfdf2db/1711719344074/garfield+banner.jpg?format=1500w"
            ]} />

            <HorizontalList genres={genres} theme={theme} />
            
            <h1 className={`ml-[50px] mt-4 font-body text-3xl ${theme === "light" ? "text-black" : "text-white"}`}>Trending</h1>
            <HorizontalList movies={trendingMovies} theme={theme} />
            
            <h1 className={`ml-[50px] mt-4 font-body text-3xl ${theme === "light" ? "text-black" : "text-white"}`}>Because you watched "Avengers: Endgame"</h1>
            <HorizontalList movies={becauseYouWatchedMovies} theme={theme} />
            
            <h1 className={`ml-[50px] mt-4 font-body text-3xl ${theme === "light" ? "text-black" : "text-white"}`}>Based on what your friends have watched...</h1>
            <HorizontalList movies={basedOnFriendsWatchedMovies} theme={theme} />
            <div className="h-12" />
        </div>
    );
};

export default DiscoverPage;
