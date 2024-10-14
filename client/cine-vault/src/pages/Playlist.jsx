import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import supabase from "../config/supabaseClient";
import PlaylistCard from "../components/PlaylistCard";
import "./theme.css";
import MovieCard from "../components/movieCard";

const Playlist = () => {

  const { id } = useParams();
  const [user, setUser] = useState();
  const [playlist, setPlaylist] = useState();
  const [movies, setMovies] = useState([]);

  // Apply the theme based on stored preference
  const applyTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
  };

  // Retrieve theme from localStorage on component mount
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      applyTheme(storedTheme);
    } else {
      // Default theme if not set in localStorage
      applyTheme('light'); 
    }
  }, []);

  const popularPlaylists = [
    {
      image: "https://static.displate.com/1200x857/displate/2023-02-20/ce0823168185db6a7d1285bb195e2e8c_44f10645b8dea479c868ff4057d55105.jpg",
      title: "Everything Marvel"
    },
    {
      image: "https://pbs.twimg.com/media/FvnRS1tXwAMZTN-.jpg",
      title: "Christopher Nolan Movies"
    },
    {
      image: "https://cdna.artstation.com/p/assets/images/images/003/205/438/large/anderson-vieira-banner-starwars.jpg?1471027030",
      title: "Star Wars Saga"
    },
    {
      image: "https://i.pinimg.com/736x/99/9f/03/999f03d2cf0fdf405dcb2d6e6641a0ad.jpg",
      title: "Horror Films"
    },
    {
      image: "https://static.vecteezy.com/system/resources/previews/001/821/684/non_2x/christmas-banner-for-present-product-with-christmas-tree-on-red-background-text-merry-christmas-and-happy-new-year-free-vector.jpg",
      title: "Christmas Vibes"
    },
    {
      image: "https://static.displate.com/1200x857/displate/2023-02-20/ce0823168185db6a7d1285bb195e2e8c_44f10645b8dea479c868ff4057d55105.jpg",
      title: "Everything Marvel"
    },
    {
      image: "https://pbs.twimg.com/media/FvnRS1tXwAMZTN-.jpg",
      title: "Christopher Nolan Movies"
    },
    {
      image: "https://cdna.artstation.com/p/assets/images/images/003/205/438/large/anderson-vieira-banner-starwars.jpg?1471027030",
      title: "Star Wars Saga"
    },
    {
      image: "https://i.pinimg.com/736x/99/9f/03/999f03d2cf0fdf405dcb2d6e6641a0ad.jpg",
      title: "Horror Films"
    },
    {
      image: "https://static.vecteezy.com/system/resources/previews/001/821/684/non_2x/christmas-banner-for-present-product-with-christmas-tree-on-red-background-text-merry-christmas-and-happy-new-year-free-vector.jpg",
      title: "Christmas Vibes"
    },
    {
      image: "https://static.displate.com/1200x857/displate/2023-02-20/ce0823168185db6a7d1285bb195e2e8c_44f10645b8dea479c868ff4057d55105.jpg",
      title: "Everything Marvel"
    },
    {
      image: "https://pbs.twimg.com/media/FvnRS1tXwAMZTN-.jpg",
      title: "Christopher Nolan Movies"
    },
    {
      image: "https://cdna.artstation.com/p/assets/images/images/003/205/438/large/anderson-vieira-banner-starwars.jpg?1471027030",
      title: "Star Wars Saga"
    },
    {
      image: "https://i.pinimg.com/736x/99/9f/03/999f03d2cf0fdf405dcb2d6e6641a0ad.jpg",
      title: "Horror Films"
    },
    {
      image: "https://static.vecteezy.com/system/resources/previews/001/821/684/non_2x/christmas-banner-for-present-product-with-christmas-tree-on-red-background-text-merry-christmas-and-happy-new-year-free-vector.jpg",
      title: "Christmas Vibes"
    },
  ];

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
                    setPlaylist(popularPlaylists[id-1]);
                }
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    fetchMoviesAndProfile();
}, []);

  return(
    <div className={`flex flex-col h-screen bg-theme `}>
      <div className={`w-full h-1/2 rounded-bl-2xl rounded-br-2xl `} style={{ backgroundImage: `url(${playlist?.image})` }} >
        
      </div>
      <div className="w-full h-1/2 bg-theme">
        <div className="font-body text-4xl ml-16 pt-12 flex justify-between mr-32">

          <div>
            <div>
              {playlist ? playlist.title : "loading"}
            </div>
            <div  className="text-lg py-4 opacity-50">
              Created by {user ? user.username : ""} on 02/12/24
            </div>
            <div className="opacity-50 text-lg">124 Likes</div>
          </div>
          <div className="flex items-center" >
            <div className="w-48 h-12 accent rounded-2xl flex justify-center items-center cursor-pointer text-xl">
              Add Playlist
            </div>
          </div>

        </div>

        <div className="grid grid-cols-6 gap-y-16 ml-16 pr-6 py-12 ">
          {movies.map((playlist, index) => (
            <MovieCard movie={playlist} />
          ))}
        </div>

      </div>
    </div>
  );

}

export default Playlist;