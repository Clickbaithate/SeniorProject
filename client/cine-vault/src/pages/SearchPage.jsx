import { useEffect, useState } from "react";
import supabase from "../config/supabaseClient";
import { useParams } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import HorizontalList from "../components/HorizontalList";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import "./theme.css";

const SearchPage = () => {

  const [movies, setMovies] = useState([]);
  const [shows, setShows] = useState([]);
  const [users, setUsers] = useState([]);
  const [emptyMovies, setEmptyMovies] = useState(false);
  const [emptyShows, setEmptyShows] = useState(false);
  const [emptyUsers, setEmptyUsers] = useState(false);
  const [noResults, setNoResults] = useState(false);
  const [loading, setLoading] = useState(false);

  const { query } = useParams();

  useEffect(() => {
    const fetchResults = async () => {
      // Reset states for a new search
      setMovies([]); // Clear previous movies list
      setShows([]);  // Clear previous shows list
      setUsers([]);  // Clear previous users list
      setEmptyMovies(false);
      setEmptyShows(false);
      setEmptyUsers(false);
      setNoResults(false); // Reset before new search
      setLoading(false);
  
      try {
        // Fetch Movies
        const { data: moviesData, error: moviesError } = await supabase
          .from('Movies')
          .select()
          .ilike('title', `%${query}%`)
          .limit(50);
  
        if (moviesError || moviesData.length === 0) {
          setEmptyMovies(true);
        } else {
          setMovies(moviesData);
        }
  
        // Fetch Shows
        const { data: showsData, error: showsError } = await supabase
          .from('Shows')
          .select()
          .ilike('title', `%${query}%`)
          .limit(50);
  
        if (showsError || showsData.length === 0) {
          setEmptyShows(true);
        } else {
          setShows(showsData);
        }
  
        // Fetch Users
        const { data: usersData, error: usersError } = await supabase
          .from('Users')
          .select()
          .ilike('username', `%${query}%`)
          .limit(25);
  
        if (usersError || usersData.length === 0) {
          setEmptyUsers(true);
        } else {
          setUsers(usersData);
        }

        setLoading(true);
  
      } catch (error) {
        console.error('Error fetching results:', error);
      }
    };
  
    fetchResults();
  }, [query]); // This will trigger a new search whenever the query changes
  
  
  useEffect(() => {
    // Check if all categories are empty and set `noResults` accordingly
    if (emptyMovies && emptyShows && emptyUsers) {
      setNoResults(true);
    } else {
      setNoResults(false);
    }
  }, [emptyMovies, emptyShows, emptyUsers]);
  

  // Dark #2D2E39
  // Dark Contrast #25262F

  // Light #FFFFFF
  // Light Contrast #E4E4E4

  useEffect(() => {
    if (emptyMovies && emptyShows && emptyUsers) {
      setNoResults(true);
    } else {
      setNoResults(false); // Reset if results are found
    }
  }, [emptyMovies, emptyShows, emptyUsers]); 

  return (
    loading ?
    <div className={`min-h-screen bg-theme `}>
      <SearchBar />
      <h1 className={`text-2xl font-body mb-4 ml-16 text-theme `}>
        {noResults ? "No Results Found" : `Results For: ${query}`}
      </h1>
  
      {/* Render Movies section only if there are movies */}
      {movies.length > 0 && (
        <div className="mb-8">
          <h2 className={`text-xl font-body ml-16 text-theme `}>
            Movies
          </h2>
          <HorizontalList movies={movies} />
        </div>
      )}
  
      {/* Render Shows section only if there are shows */}
      {shows.length > 0 && (
        <div className="mb-8">
          <h2 className={`text-xl font-body ml-16 text-theme `}>
            Shows
          </h2>
          <HorizontalList shows={shows} />
        </div>
      )}
  
      {/* Render Users section only if there are users */}
      {users.length > 0 && (
        <div className="mb-8">
          <h2 className={`text-xl font-body ml-16 text-theme `}>
            Users
          </h2>
          <HorizontalList users={users} />
        </div>
      )}
    </div>
    :
    <div className=" flex flex-col justify-center items-center h-screen" >
      <DotLottieReact src="https://lottie.host/b7f01c92-fc7a-4e49-9153-2e457a694eb2/bHswRE20Tl.json" loop autoplay className="w-56 h-56" />
    </div>
  );
};

export default SearchPage;
