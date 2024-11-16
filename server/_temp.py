import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from supabase import create_client, Client
import sys
import json
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()
url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(url, key)

def fetch_movies():
    
    # Initialize the variables for pagination
    limit = 1000  # You can adjust this number if necessary
    offset = 0
    all_movies = []
    
    while True:
        # Fetch movies with pagination
        response = supabase.table("Movies").select("*").range(offset, offset + limit - 1).execute()
        
        if response.data is None:
            return None
        
        if len(response.data) == 0:
            break
        
        all_movies.extend(response.data)  # Add the fetched movies to the list
        offset += limit  # Move the offset to the next chunk
    
    return all_movies

# Fetching movie data
movies_data = fetch_movies()

if not movies_data:
    sys.exit("Error fetching data from Supabase.")

# Load movies into DataFrame
movies = pd.DataFrame(movies_data)

# Save movies data to CSV
movies.to_csv('movies.csv')

# Load keyword data
keywords = pd.read_csv("movies_with_keywords.csv")

# Create the combined column
movies['combined'] = (
    (movies['genres'].fillna('') + " ") * 3 + 
    (movies['rating'].astype(str).fillna('') + " ") +
    (keywords['keywords'].fillna('') + " ") * 2 +
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
    
    # Check if movie_id exists in the indices
    if movie_id not in indices:
        return [f'Movie ID: {movie_id} Not Found!']
    
    idx = indices[movie_id]
    recommendations = []
    
    num_movies = matrix.shape[0]
    
    for start in range(0, num_movies, chunk_size):
        end = min(start + chunk_size, num_movies)
        cosine_sim = cosine_similarity(matrix[start:end], matrix[idx].reshape(1, -1))
        
        for i, score in enumerate(cosine_sim):
            movie_index = start + i
            recommendations.append((movie_index, score[0]))
    
    recommendations = sorted(recommendations, key=lambda x: x[1], reverse=True)
    top_indices = [rec[0] for rec in recommendations if rec[0] != idx][:10]
    
    return movies['movie_id'].iloc[top_indices].tolist()

if __name__ == "__main__":
    while True:
        movie_id = sys.stdin.readline().strip()
        
        if movie_id.lower() == 'exit':
            break
        
        try:
            movie_id = int(movie_id)
            recommendations = get_recommendations_chunked(movie_id, matrix_combined, chunk_size=5000)
            recommendations = [int(rec) for rec in recommendations]
            print(json.dumps(recommendations))
            sys.stdout.flush()
        except ValueError:
            print(json.dumps(["Invalid movie ID."]))
            sys.stdout.flush()
