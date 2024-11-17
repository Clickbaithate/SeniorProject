import pandas as pd
import requests
import json
import sys
import io
from dotenv import load_dotenv
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# Ensure stdout uses UTF-8 encoding to handle special characters
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

# Load environment variables
load_dotenv()

# Replace with your server URL where the /movies endpoint is hosted
MOVIE_API_URL = "https://senior-project-f2n8.onrender.com/movies"

def fetch_movies():
    # Fetch all movies from the /movies API endpoint
    response = requests.get(MOVIE_API_URL)
    if response.status_code != 200:
        print(json.dumps({"error": f"Error fetching movies: {response.status_code}"}))
        sys.stdout.flush()
        sys.exit(1)
    return response.json()

# Fetching movie data
movies_data = fetch_movies()
if not movies_data:
    sys.exit("Error fetching data from the movies API.")

# Load movies into DataFrame
movies = pd.DataFrame(movies_data)
movies.to_csv('movies.csv', index=False)

# Create the combined column for the recommender system
movies['combined'] = (
    (movies['genres'].fillna('') + " ") * 3 +
    (movies['rating'].astype(str).fillna('') + " ") +
    (movies['overview'].fillna('') + " ") +
    (movies['actors'].fillna('') + " ") +
    (movies['production_companies'].fillna('') + " ") +
    (movies['budget'].fillna(0).astype(str) + " ") * 3 +
    (movies['directors'].astype(str).fillna('') + " ") * 2
)
movies['combined'] = movies['combined'].fillna('')

# TF-IDF Vectorizer
tfidf = TfidfVectorizer(stop_words="english")
matrix_combined = tfidf.fit_transform(movies['combined'])

def get_recommendations_chunked(movie_id, matrix, chunk_size=50000):
    indices = pd.Series(movies.index, index=movies['movie_id']).drop_duplicates()

    # Check if the movie_id exists in the DataFrame
    if movie_id not in indices:
        return []

    idx = indices[movie_id]
    recommendations = []
    num_movies = matrix.shape[0]

    for start in range(0, num_movies, chunk_size):
        end = min(start + chunk_size, num_movies)
        cosine_sim = cosine_similarity(matrix[start:end], matrix[idx, :].reshape(1, -1))
        for i, score in enumerate(cosine_sim):
            movie_index = start + i
            recommendations.append((movie_index, score[0]))

    # Sort recommendations by score in descending order
    recommendations = sorted(recommendations, key=lambda x: x[1], reverse=True)

    # Remove duplicates while maintaining order
    seen = set()
    unique_recommendations = []
    for rec in recommendations:
        if rec[0] not in seen and rec[0] != idx:
            unique_recommendations.append(rec[0])
            seen.add(rec[0])

    # Slice top 10 unique recommendations
    top_indices = unique_recommendations[:10]

    return list(movies['movie_id'].iloc[top_indices])


if __name__ == "__main__":
    while True:
        movie_id = sys.stdin.readline().strip()
        if movie_id.lower() == 'exit':
            break
        try:
            movie_id = int(movie_id)
            recommendations = get_recommendations_chunked(movie_id, matrix_combined, chunk_size=5000)
            if recommendations:
                print(json.dumps(recommendations))
            else:
                print(json.dumps({"error": "Movie not found or no recommendations available"}))
            sys.stdout.flush()
        except ValueError:
            print(json.dumps({"error": "Invalid movie ID"}))
            sys.stdout.flush()
