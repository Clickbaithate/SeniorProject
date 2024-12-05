import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import supabase from "../config/supabaseClient";
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
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResults = async () => {
      setMovies([]);
      setShows([]);
      setUsers([]);
      setEmptyMovies(false);
      setEmptyShows(false);
      setEmptyUsers(false);
      setNoResults(false);
      setLoading(false);

      try {
        const { data: moviesData, error: moviesError } = await supabase
          .from("Movies")
          .select()
          .ilike("title", `%${query}%`)
          .order("rating_count", { ascending: false })
          .limit(50);

        if (moviesError || moviesData.length === 0) {
          setEmptyMovies(true);
        } else {
          setMovies(moviesData);
        }

        const { data: showsData, error: showsError } = await supabase
          .from("Shows")
          .select()
          .ilike("title", `%${query}%`)
          .order("rating_count", { ascending: false })
          .limit(50);

        if (showsError || showsData.length === 0) {
          setEmptyShows(true);
        } else {
          setShows(showsData);
        }

        const { data: usersData, error: usersError } = await supabase
          .from("Users")
          .select()
          .ilike("username", `%${query}%`)
          .limit(25);

        if (usersError || usersData.length === 0) {
          setEmptyUsers(true);
        } else {
          setUsers(usersData);
        }

        setLoading(true);
      } catch (error) {
        console.error("Error fetching results:", error);
      }
    };

    fetchResults();
  }, [query]);

  useEffect(() => {
    if (emptyMovies && emptyShows && emptyUsers) {
      setNoResults(true);
    } else {
      setNoResults(false);
    }
  }, [emptyMovies, emptyShows, emptyUsers]);

  const handleUserClick = (userId) => {
    navigate(`/user/${userId}`);
  };

  return loading ? (
    <div className={`min-h-screen bg-theme`}>
      <SearchBar />
      <h1 className={`text-2xl font-body mb-4 ml-16 text-theme`}>
        {noResults ? "No Results Found" : `Results For: ${query}`}
      </h1>

      {movies.length > 0 && (
        <div className="mb-8">
          <h2 className={`text-xl font-body ml-16 text-theme`}>Movies</h2>
          <HorizontalList movies={movies} />
        </div>
      )}

      {shows.length > 0 && (
        <div className="mb-8">
          <h2 className={`text-xl font-body ml-16 text-theme`}>Shows</h2>
          <HorizontalList shows={shows} />
        </div>
      )}

      {users.length > 0 && (
        <div className="mb-8">
          <h2 className={`text-xl font-body ml-16 text-theme`}>Users</h2>
          <HorizontalList users={users} onUserClick={handleUserClick} />
        </div>
      )}
    </div>
  ) : (
    <div className="flex flex-col justify-center items-center h-screen">
      <DotLottieReact
        src="https://lottie.host/b7f01c92-fc7a-4e49-9153-2e457a694eb2/bHswRE20Tl.json"
        loop
        autoplay
        className="w-56 h-56"
      />
    </div>
  );
};

export default SearchPage;
