import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import supabase from "../config/supabaseClient";
import MovieCard from '../components/movieCard';
import placeholder from "../assets/placeholder.jpg";

const GenrePage = () => {

  const { genre } = useParams();
  const [movies, setMovies] = useState([]);
  const [offset, setOffset] = useState(0);
  const [search, setSearch] = useState(""); // Track search query
  const [bestMovie, setBestMovie] = useState();
  const limit = 18; // Number of movies per page

  const navigate = useNavigate();

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (!savedTheme) {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.setAttribute('data-theme', savedTheme);
    }
    setMovies(dummyArray)
    fetchMovies(0); // Start at the first page (offset = 0)
  }, [genre, search]); // Fetch movies whenever the genre or search query changes

  const dummyArray = [
    {movie_id: -1}, {movie_id: -1}, {movie_id: -1}, {movie_id: -1}, {movie_id: -1}, {movie_id: -1},
    {movie_id: -1}, {movie_id: -1}, {movie_id: -1}, {movie_id: -1}, {movie_id: -1}, {movie_id: -1},
    {movie_id: -1}, {movie_id: -1}, {movie_id: -1}, {movie_id: -1}, {movie_id: -1}, {movie_id: -1},
  ]

  // Fetch movies based on the current offset and search query
  const fetchMovies = async (currentOffset) => {
    const { data: movieData, error: movieError } = await supabase
      .from("Movies")
      .select("*") // Select relevant columns
      .ilike("title", `%${search}%`) // Filter by movie title based on search query
      .ilike("genres", `%${genre}%`) // Filter by genre
      .order("revenue", { ascending: false })
      .range(currentOffset, currentOffset + limit - 1); // Calculate the correct range

    if (movieData) {
      setMovies(movieData);
      if (currentOffset === 0 && search == "") {
        setBestMovie(movieData[0]);
      }
    } else {
      console.error("Error Fetching Movies: ", movieError);
    }
  };

  // Handle search input change
  const handleSearch = (e) => {
    setSearch(e.target.value); // Update search state
    setOffset(0); // Reset to the first page whenever the search changes
  };

  // Handle Next Page
  const handleNextPage = () => {
    setOffset((prev) => {
      const newOffset = prev + limit;
      setMovies(dummyArray);
      fetchMovies(newOffset); // Fetch the next set of movies
      return newOffset;
    });
  };

  // Handle Previous Page
  const handlePreviousPage = () => {
    if (offset === 0) return;
    setOffset((prev) => {
      const newOffset = prev - limit; // Ensure offset doesn't go negative
      setMovies(dummyArray);
      fetchMovies(newOffset);
      return newOffset;
    });
  };

  return (
    <div className="flex ">
      <div className="w-1/6 accent min-h-screen">
        <div className="flex items-center justify-center py-6">
          <input
            type="text"
            className="p-2 w-[90%] text-theme bg-theme rounded-lg"
            placeholder="Search movies by title..."
            value={search}
            onChange={handleSearch}
          />
        </div>
      </div>
      <div className="w-5/6 flex flex-col items-center ">

      <div className="relative w-full h-96 my-6 px-6 overflow-hidden">
        <img className="w-full h-full object-cover rounded-2xl cursor-pointer" src={`${bestMovie ? bestMovie.banner : placeholder}`} 
          onClick={() => {
            if (bestMovie) {
              navigate(`/movie/${bestMovie.movie_id}`);
            }
          }}
          alt="Banner"
        />
        <p className="absolute left-14 bottom-10 text-2xl font-body text-white">
          {bestMovie ? bestMovie.title : ""}
        </p>
        <p className="absolute left-14 top-10 text-2xl font-body text-white">
          Voted Most Successful "{genre}" Movie!
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-20 gap-y-6">
        {movies.map((movie, i) => (
          <MovieCard key={i} index={movie.movie_id} />
        ))}
      </div>

      <div className="flex items-center">
        <button
          className={`w-32 h-12 rounded-xl m-4 ${
            offset === 0 ? 'bg-gray-400 cursor-not-allowed' : 'accent hover:bg-blue-600'
          }`}
          onClick={handlePreviousPage}
          disabled={offset === 0} // Disable button if offset is 0
        >
          Previous Page
        </button>

        <div className="w-24 h-12 flex items-center justify-center border-2 rounded-xl">
          Page {(offset / limit) + 1}
        </div>

        <button
          className={`w-32 h-12 rounded-xl m-4 ${
            movies.length < limit ? 'bg-gray-400 cursor-not-allowed' : 'accent hover:bg-blue-600'
          }`}
          onClick={handleNextPage}
          disabled={movies.length < limit} // Disable button if no more pages
        >
          Next Page
        </button>
      </div>

      </div>
    </div>
  );
};

export default GenrePage;
