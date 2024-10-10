import { useEffect, useState } from "react";
import supabase from "../config/supabaseClient";
import { useParams } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import HorizontalList from "../components/HorizontalList";

const SearchPage = () => {

  const [movies, setMovies] = useState([]);
  const [shows, setShows] = useState([]);
  const [users, setUsers] = useState([]);
  const [emptyMovies, setEmptyMovies] = useState(false);
  const [emptyShows, setEmptyShows] = useState(false);
  const [emptyUsers, setEmptyUsers] = useState(false);
  const [noResults, setNoResults] = useState(false);

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

  const theme = 'dark';

  return (
    <div className={`min-h-screen ${theme === 'light' ? "bg-[#FFFFFF]" : "bg-[#2D2E39]"}`}>
      <SearchBar theme={theme} />
      <h1 className={`text-2xl font-body mb-4 ml-16 ${theme === 'light' ? "text-black" : "text-white"}`}>
        {noResults ? "No Results Found" : `Results For: ${query}`}
      </h1>
  
      {/* Render Movies section only if there are movies */}
      {movies.length > 0 && (
        <div className="mb-8">
          <h2 className={`text-xl font-body ml-16 ${theme === 'light' ? "text-black" : "text-white"}`}>
            Movies
          </h2>
          <HorizontalList movies={movies} theme={theme} />
        </div>
      )}
  
      {/* Render Shows section only if there are shows */}
      {shows.length > 0 && (
        <div className="mb-8">
          <h2 className={`text-xl font-body ml-16 ${theme === 'light' ? "text-black" : "text-white"}`}>
            Shows
          </h2>
          <HorizontalList movies={shows} theme={theme} />
        </div>
      )}
  
      {/* Render Users section only if there are users */}
      {users.length > 0 && (
        <div className="mb-8">
          <h2 className={`text-xl font-body ml-16 ${theme === 'light' ? "text-black" : "text-white"}`}>
            Users
          </h2>
          <HorizontalList movies={users} theme={theme} />
        </div>
      )}
    </div>
  );
};

export default SearchPage;
