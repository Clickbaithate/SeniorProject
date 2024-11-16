import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from supabase import create_client, Client
import sys
import json
from dotenv import load_dotenv
import os

load_dotenv()
url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(url, key)

def fetch_movies():
    response = supabase.from_('Movies').select('*').execute()  # Adjust table name if needed
    if response.error:
        print(f"Error fetching movies: {response.error}")
        return None
    return response.data

# Retrieve the movie data from Supabase
movies_data = fetch_movies()

if not movies_data:
    sys.exit("Error fetching data from Supabase.")

# Convert the data to pandas DataFrame for easier manipulation
movies = pd.DataFrame(movies_data)

# Save the movie data to a CSV file for later use
movies.to_csv('movies.csv', index=False)

keywords = pd.read_csv("movies_with_keywords.csv")

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

tfidf = TfidfVectorizer(stop_words="english")
matrix_combined = tfidf.fit_transform(movies['combined'])

def get_recommendations_chunked(movie_id, matrix, chunk_size=50000):
    indices = pd.Series(movies.index, index=movies['movie_id']).drop_duplicates()
    
    if movie_id not in indices:
        return ["Movie ID not found."]
    
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
        if not movie_id:
            continue
        
        try:
            movie_id = int(movie_id)
            recommendations = get_recommendations_chunked(movie_id, matrix_combined, chunk_size=5000)
            recommendations = [int(rec) for rec in recommendations]
            print(json.dumps(recommendations))
            sys.stdout.flush()
        except ValueError:
            print(json.dumps(["Invalid movie ID."]))
            sys.stdout.flush()
