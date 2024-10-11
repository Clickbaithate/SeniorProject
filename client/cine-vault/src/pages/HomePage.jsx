import React, { useEffect, useState } from "react";
import supabase from "../config/supabaseClient";
import Sidebar from "./Sidebar";
import SearchBar from "../components/SearchBar";
import HomePageCarousel from "../components/HomePageCarousel";

const HomePage = () => {
  const [user, setUser] = useState(null);
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);
  const [theme, setTheme] = useState("light");

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
          .select('username, bio, profile_picture, theme_settings')
          .eq('user_id', session.user.id)
          .single();

        if (error) {
          console.warn('Error fetching profile:', error);
        } else if (data) {
          setTheme(data.theme_settings ? 'dark' : 'light'); // Set the theme based on database value
          document.documentElement.setAttribute('data-theme', data.theme_settings ? 'dark' : 'light');
          localStorage.setItem('theme', data.theme_settings ? 'dark' : 'light');
        }
      }
    };

    fetchProfile();

    const fetchMovies = async () => {
      try {
        const { data, error } = await supabase
          .from("Movies")
          .select("movie_id, title, image")
          .limit(3); // Limiting to 3 movies for the Recently Visited section
        if (error) {
          console.error("Error fetching movies:", error);
        } else {
          setMovies(data);
        }
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    };

    fetchMovies();
  }, []);

  return (
    <div className={`min-h-screen ml-[100px] ${theme === "light" ? "bg-white text-black" : "bg-[#2D2E39] text-white"}`}>
      <Sidebar />
      <div className="ml-[100px]">
        <SearchBar placeholder="Search..." theme={theme === "light" ? "light" : "dark"} />

        <div className="flex items-center justify-center h-[800px]">
          {/* Center Section: Carousel */}
          <div className="w-1/2">
            <HomePageCarousel
              images={[
                "https://w0.peakpx.com/wallpaper/286/479/HD-wallpaper-suzume-no-tojimari-suzume-no-tojimari-2023-movies-netflix-animated-movies-anime-movies.jpg",
                "https://wallpapers.com/images/hd/animation-movies-1197-x-704-wallpaper-nlgddr8e66de5g41.jpg",
                "https://i.ytimg.com/vi/8zWK0tFUJ58/maxresdefault.jpg",
                "https://wallpapers.com/images/hd/lego-ninjago-coloured-ninjas-tvvjxferzmu2gdx6.jpg",
              ]}
              style={{ height: "400px", width: "740px" }}
            />

            <div className="flex space-x-4 mt-4">
              {["Top 100 Comedy Movies", "Top 100 Sci-Fi Movies", "Top 100 Oscar-Winning Movies"].map((challenge, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg shadow-lg w-56 ${theme === "light" ? "bg-gray-200 text-black" : "bg-gray-800 text-white"}`}
                >
                  <h2 className="text-lg mb-2 font-body text-center flex items-center justify-center">
                    {challenge}
                  </h2>
                  <p className={`font-body text-xs ${theme === "light" ? "text-gray-600" : "text-gray-400"}`}>
                    You have completed 75% of this challenge!
                  </p>
                  <div className={`relative w-full h-2 rounded ${theme === "light" ? "bg-gray-300" : "bg-gray-600"}`}>
                    <div
                      className={`absolute top-0 left-0 h-full rounded ${theme === "light" ? "bg-blue-500" : "bg-purple-600"}`}
                      style={{ width: "75%" }}
                    ></div>
                  </div>
                  <button className={`mt-2 px-4 py-1 rounded font-body text-xs w-full ${theme === "light" ? "bg-blue-500 text-white" : "bg-gray-500 text-white"}`}>
                    View Challenge
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Right Section: Recently Visited and Recent Activity */}
          <div className="flex flex-col w-1/4 ml-8">
            <div className={`p-4 rounded-lg overflow-hidden shadow-lg flex flex-col ${theme === "light" ? "bg-gray-200 text-black" : "bg-gray-800 text-white"}`}>
              <h2 className="text-lg mb-2 font-body">Recently Visited</h2>
              <div className="flex flex-col space-y-2">
                {movies.map((movie) => (
                  <div key={movie.movie_id} className="flex items-start h-24">
                    <img src={movie.image} alt={movie.title} className="w-16 h-24 object-cover rounded mr-2" />
                    <div className="flex flex-col justify-between flex-grow">
                      <p className="font-body text-sm">{movie.title}</p>
                      <p className={`font-body text-xs ${theme === "light" ? "text-gray-600" : "text-gray-400"}`}>⭐Rating: 10/10</p>
                      <p className={`font-body text-xs ${theme === "light" ? "text-gray-600" : "text-gray-400"}`}>12/4/2020</p>
                      <button className={`mt-1 px-2 py-1 rounded font-body text-xs ${theme === "light" ? "bg-blue-500 text-white" : "bg-gray-500 text-white"}`}>
                        View
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <h2 className="text-lg mb-2 font-body mt-4">Recent Activity</h2>
              <div className="flex flex-col space-y-2">
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="flex items-center">
                    <img className="w-10 h-10 rounded-full" src="https://i.pinimg.com/550x/a8/47/9a/a8479a922b151b03df56a6db105dc5dd.jpg" alt="avatar" />
                    <div className="ml-2">
                      <p className="font-body text-sm">Iron Man has liked your playlist!</p>
                      <p className={`font-body text-xs ${theme === "light" ? "text-gray-600" : "text-gray-400"}`}>One minute ago</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-center mt-2">
                <button className={`px-4 py-2 rounded font-body text-xs ${theme === "light" ? "bg-blue-500 text-white" : "bg-gray-500 text-white"}`}>
                  View All
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
