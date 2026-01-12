# Movie Recommendation API

## Description

A simple FastAPI-based movie recommendation system that uses content-based filtering with TF-IDF vectorization and cosine similarity to suggest similar movies based on genres, keywords, tagline, cast, and director.

## Installation

1. Clone the repository.
2. Install dependencies: `pip install -r requirements.txt`
3. Run the server: `uvicorn main:app --reload`

## API Endpoints

### GET /

Returns a welcome message.

**Response:**
```json
{
  "message": "Movie Recommendation API"
}
```

### POST /recommendation

Recommends movies similar to the input movie.

**Request Body:**
```json
{
  "movie": "string"
}
```

**Response:**
```json
{
  "matched_movies": "string",
  "recommendations": ["string"]
}
```

## Usage Examples

Using curl:

```bash
curl -X POST "http://localhost:8000/recommendation" -H "Content-Type: application/json" -d '{"movie": "Avatar"}'
```

## Dependencies

- fastapi
- pydantic
- uvicorn
- scikit-learn
- pandas
- python-multipart

## Data

The API uses `movies.csv` which contains movie metadata including title, genres, keywords, tagline, cast, and director of several movies.

## Notes

- The API performs fuzzy matching on movie titles using difflib.
- Recommendations are based on the top 29 most similar movies (excluding the input movie).

- CORS is enabled for cross-origin requests.
