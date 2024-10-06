import { useEffect, useState } from "react";
import supabase from "../config/supabaseClient";
import { useParams } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import HorizontalList from "../components/HorizontalList";

const SearchPage = () => {

  const [movies, setMovies] = useState([]);
  const [shows, setShows] = useState([]);
  const [users, setUsers] = useState([]);

  const { query } = useParams();

  useEffect(() => {
    const fetchResults = async () => {
      try {
        // Fetch Movies
        const { data: moviesData, error: moviesError } = await supabase
          .from('Movies')
          .select()
          .ilike('title', `%${query}%`)
          .limit(10);

        if (moviesError) {
          console.warn('Error fetching movies:', moviesError);
        } else {
          setMovies(moviesData);
        }

        // Fetch Shows
        const { data: showsData, error: showsError } = await supabase
          .from('Shows')
          .select()
          .ilike('title', `%${query}%`)
          .limit(10);

        if (showsError) {
          console.warn('Error fetching shows:', showsError);
        } else {
          setShows(showsData);
        }

        // Fetch Users
        const { data: usersData, error: usersError } = await supabase
          .from('Users')
          .select()
          .ilike('username', `%${query}%`)
          .limit(10);

        if (usersError) {
          console.warn('Error fetching users:', usersError);
        } else {
          setUsers(usersData);
        }

      } catch (error) {
        console.error('Error fetching results:', error);
      }
    };

    fetchResults();
  }, [query]);

  return (
    <div className="">
      <SearchBar />
      <h1 className="text-2xl font-bold mb-4">Search Results for "{query}"</h1>
      <div className="mb-8">
        <h2 className="text-xl font-semibold">Movies</h2>
        <HorizontalList movies={movies} />
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold">Shows</h2>
        <HorizontalList movies={shows} />
      </div>



    </div>
  );
};

export default SearchPage;
