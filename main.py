from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import pandas as pd
from fastapi.middleware.cors import CORSMiddleware
import difflib
import httpx
import os
from typing import List, Optional

app = FastAPI(title="CineMatch API", description="Movie Recommendation API with poster support")

# CORS middleware for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# TMDb API configuration
TMDB_API_KEY = os.getenv("TMDB_API_KEY", "")
TMDB_BASE_URL = "https://api.themoviedb.org/3"
TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w500"

# Load movie data
movies_data = pd.read_csv("movies.csv")

# Enhanced feature set for better recommendations (10 features)
selected_features = [
    "genres",        # Movie genres
    "keywords",      # Associated keywords
    "tagline",       # Movie tagline
    "cast",          # Actors/actresses
    "director",      # Director name
    "overview",      # Plot summary (crucial for content similarity)
    "crew",          # Additional creative team
    "runtime",       # Movie length
    "vote_average",  # Rating quality indicator
    "vote_count"     # Rating reliability
]

# Fill missing values with empty strings
for feature in selected_features:
    movies_data[feature] = movies_data[feature].fillna("")

# Combine all features into single text representation (row-wise concatenation)
combined_features = movies_data[selected_features[0]].astype(str)
for feature in selected_features[1:]:
    combined_features = combined_features + ' ' + movies_data[feature].astype(str)

vectorizer = TfidfVectorizer()
feature_vectors = vectorizer.fit_transform(combined_features)

similarity = cosine_similarity(feature_vectors)

list_of_all_titles = movies_data['title'].to_list()

# Pydantic models
class MovieRequest(BaseModel):
    movie: str

class MovieDetail(BaseModel):
    title: str
    year: Optional[str] = None
    rating: Optional[float] = None
    genres: Optional[str] = None
    poster_url: Optional[str] = None
    match_percentage: int
    tmdb_id: Optional[int] = None

class RecommendationResponse(BaseModel):
    searched_movie: str
    matched_movie: str
    recommendations: List[MovieDetail]

# Genre fallback images (hosted locally)
GENRE_FALLBACKS = {
    "action": "/static/fallback/action.jpg",
    "drama": "/static/fallback/drama.jpg",
    "comedy": "/static/fallback/comedy.jpg",
    "horror": "/static/fallback/horror.jpg",
    "science fiction": "/static/fallback/scifi.jpg",
    "romance": "/static/fallback/romance.jpg",
    "default": "/static/fallback/default.jpg"
}

def get_fallback_image(genres: str) -> str:
    """Get fallback image based on primary genre"""
    genres_lower = genres.lower()
    for genre, fallback_url in GENRE_FALLBACKS.items():
        if genre in genres_lower:
            return fallback_url
    return GENRE_FALLBACKS["default"]

async def fetch_poster_from_tmdb(tmdb_id: int) -> Optional[str]:
    """Fetch poster URL from TMDb API"""
    if not TMDB_API_KEY:
        return None
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{TMDB_BASE_URL}/movie/{tmdb_id}",
                params={"api_key": TMDB_API_KEY},
                timeout=5.0
            )
            if response.status_code == 200:
                data = response.json()
                poster_path = data.get("poster_path")
                if poster_path:
                    return f"{TMDB_IMAGE_BASE}{poster_path}"
    except Exception:
        pass
    return None

def get_movie_details(index: int, match_score: float) -> dict:
    """Extract movie details from dataset"""
    movie = movies_data.iloc[index]
    
    # Extract year from release_date
    year = None
    if pd.notna(movie.get('release_date')):
        try:
            year = str(movie['release_date'])[:4]
        except:
            pass
    
    return {
        "title": movie['title'],
        "year": year,
        "rating": round(float(movie['vote_average']), 1) if pd.notna(movie.get('vote_average')) else None,
        "genres": movie['genres'] if pd.notna(movie.get('genres')) else None,
        "tmdb_id": int(movie['id']) if pd.notna(movie.get('id')) else None,
        "match_percentage": int(match_score * 100)
    }

from fastapi.responses import HTMLResponse, FileResponse

@app.get("/", response_class=HTMLResponse)
def root():
    """Serve the frontend HTML page"""
    frontend_html = os.path.join(os.path.dirname(__file__), "frontend", "index.html")
    if os.path.exists(frontend_html):
        with open(frontend_html, "r", encoding="utf-8") as f:
            return HTMLResponse(content=f.read())
    return {"message": "CineMatch - Movie Recommendation API"}

@app.post("/recommendation")
def recommend(request: MovieRequest):
    """Original recommendation endpoint (returns just titles)"""
    movie_name = request.movie
    find_close_match = difflib.get_close_matches(movie_name, list_of_all_titles)
    
    if not find_close_match:
        raise HTTPException(status_code=404, detail="Movie not found")
    
    close_match = find_close_match[0]
    index_of_the_movie = movies_data[movies_data.title == close_match]['index'].values[0]
    similarity_score = list(enumerate(similarity[index_of_the_movie]))
    sorted_similar_movies = sorted(similarity_score, key=lambda x: x[1], reverse=True)

    recommendations = []
    for i, movie in enumerate(sorted_similar_movies[1:11]):  # Limit to 10
        index = movie[0]
        title = movies_data[movies_data.index == index]['title'].values[0]
        recommendations.append(title)

    return {
        "matched_movies": close_match,
        "recommendations": recommendations
    }

@app.post("/movies-with-posters", response_model=RecommendationResponse)
async def recommend_with_posters(request: MovieRequest):
    """Enhanced recommendation endpoint with poster URLs and movie details"""
    movie_name = request.movie
    find_close_match = difflib.get_close_matches(movie_name, list_of_all_titles)
    
    if not find_close_match:
        raise HTTPException(status_code=404, detail="Movie not found. Try a different title.")
    
    close_match = find_close_match[0]
    
    # Find the movie index
    movie_row = movies_data[movies_data.title == close_match]
    if movie_row.empty:
        raise HTTPException(status_code=404, detail="Movie not found in database")
    
    index_of_the_movie = movie_row['index'].values[0]
    
    # Get similarity scores
    similarity_score = list(enumerate(similarity[index_of_the_movie]))
    sorted_similar_movies = sorted(similarity_score, key=lambda x: x[1], reverse=True)
    
    # Build recommendations with details (limit to 10)
    recommendations = []
    for movie in sorted_similar_movies[1:11]:  # Skip first (itself), take next 10
        idx = movie[0]
        score = movie[1]
        
        movie_details = get_movie_details(idx, score)
        
        # Try to fetch poster from TMDb
        poster_url = None
        if movie_details["tmdb_id"]:
            poster_url = await fetch_poster_from_tmdb(movie_details["tmdb_id"])
        
        # Use fallback if no poster found
        if not poster_url and movie_details["genres"]:
            poster_url = get_fallback_image(movie_details["genres"])
        elif not poster_url:
            poster_url = GENRE_FALLBACKS["default"]
        
        recommendations.append(MovieDetail(
            title=movie_details["title"],
            year=movie_details["year"],
            rating=movie_details["rating"],
            genres=movie_details["genres"],
            poster_url=poster_url,
            match_percentage=movie_details["match_percentage"],
            tmdb_id=movie_details["tmdb_id"]
        ))
    
    return RecommendationResponse(
        searched_movie=movie_name,
        matched_movie=close_match,
        recommendations=recommendations
    )

@app.get("/health")
def health_check():
    """Health check endpoint for deployment"""
    return {
        "status": "healthy",
        "tmdb_configured": bool(TMDB_API_KEY),
        "movies_loaded": len(movies_data)
    }

# Mount static files for frontend (must be AFTER all API routes)
import os.path
frontend_path = os.path.join(os.path.dirname(__file__), "frontend")
if os.path.exists(frontend_path):
    # Serve fallback images
    app.mount("/static", StaticFiles(directory=os.path.join(frontend_path, "assets")), name="static")
    # Serve frontend files
    app.mount("/", StaticFiles(directory=frontend_path, html=True), name="frontend")
