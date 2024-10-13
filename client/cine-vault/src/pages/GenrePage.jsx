import React from 'react';

// adding this comment to push link image loading fixes to main

const MovieCategories = () => {
  const categories = [
    {
      name: 'Action',
      movies: [
        { title: 'Avengers: Infinity War', poster: 'https://m.media-amazon.com/images/I/71eHZFw+GlL._AC_UF894,1000_QL80_.jpg' },
        { title: 'Deadpool & Wolverine', poster: 'https://cdn.marvel.com/content/1x/deadpoolandwolverine_lob_crd_03.jpg' },
        { title: 'John Wick', poster: 'https://m.media-amazon.com/images/I/81cLJ5B8ScL._AC_UY218_.jpg' },
      ],
    },
    {
      name: 'Drama',
      movies: [
        { title: 'Moonlight', poster: 'https://posterhouse.org/wp-content/uploads/2021/05/moonlight_0.jpg' },
        { title: 'Forrest Gump', poster: 'https://m.media-amazon.com/images/I/71tXhRhz3vL._AC_UY218_.jpg' },
        { title: 'The Godfather', poster: 'https://m.media-amazon.com/images/I/41+eK8zBwQL._AC_.jpg' },
      ],
    },
    {
      name: 'Comedy',
      movies: [
        { title: 'Scary Movie', poster: 'https://m.media-amazon.com/images/M/MV5BZGRmMGRhOWMtOTk3Ni00OTRjLTkyYTAtYzA1M2IzMGE3NGRkXkEyXkFqcGc@._V1_.jpg' },
        { title: 'Beetlejuice', poster: 'https://all.web.img.acsta.net/img/88/01/8801185034fbb3e22b654c923f649201.jpg/r_2500_x' },
        { title: 'Superbad', poster: 'https://m.media-amazon.com/images/I/813AT1LtpEL._AC_UY218_.jpg' },
      ],
    },
    {
      name: 'Horror',
      movies: [
        { title: 'A Quiet Place', poster: 'https://wwwimage-us.pplusstatic.com/thumbnails/photos/w370-q80/movie_asset/54/87/88/movie_asset_a9b1404e-51eb-4e95-8665-5c2d83a59b6c.jpg' },
        { title: 'Us', poster: 'https://www.indiewire.com/wp-content/uploads/2019/12/us-1.jpg?w=758' },
        { title: 'Hereditary', poster: 'https://m.media-amazon.com/images/I/81k-3gsxWPL._AC_UY218_.jpg'},
      ],
    },
    {
      name: 'Science Fiction',
      movies: [
        { title: 'Avatar: The Way of Water', poster: 'https://images.squarespace-cdn.com/content/v1/5a7f41ad8fd4d236a4ad76d0/1669842753281-3T90U1EY5HUNCG43XERJ/A2_Poster_DC_v80_PAYOFF_221029_12trimHD.jpg' },
        { title: 'Interstellar', poster: 'https://m.media-amazon.com/images/I/91EYVYXTelL._AC_UY218_.jpg' },
        { title: 'Inception', poster: 'https://m.media-amazon.com/images/I/81i7S802xFL._AC_UY218_.jpg' },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-6">
      <h1 className="text-4xl font-bold mb-8">Movie Categories</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-4xl">
        {categories.map((category, index) => (
          <div key={index} className="bg-gray-800 shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">{category.name}</h2>
            <ul className="space-y-4">
              {category.movies.map((movie, idx) => (
                <li key={idx} className="flex items-center space-x-4">
                  <img
                    src={movie.poster}
                    alt={movie.title}
                    className="w-16 h-24 object-cover rounded-lg"
                  />
                  <span className="text-lg text-gray-300">{movie.title}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MovieCategories;
