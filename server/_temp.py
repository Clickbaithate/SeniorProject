import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import sys
import json

movies = pd.read_csv('movies.csv')
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
