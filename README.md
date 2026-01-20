# 🎬 CineMatch - Movie Recommendation Website

A beautiful, modern movie recommendation web application that uses AI-powered content-based filtering to suggest similar movies based on your favorites.

![CineMatch](https://img.shields.io/badge/CineMatch-Movie%20Recommendations-e85d04?style=for-the-badge)
![Python](https://img.shields.io/badge/Python-3.10+-3776ab?style=flat-square&logo=python)
![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688?style=flat-square&logo=fastapi)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

## 🌐 Live Demo

**🔗 [TRY_IT_OUT_HERE](https://cinematch-caxq.onrender.com)**

<!-- Replace YOUR_DEPLOYED_URL_HERE with your actual deployment URL after deploying -->

## ✨ Features

- **🔍 Intelligent Search** - Fuzzy matching handles typos and variations in movie titles
- **🎯 10-Feature ML Algorithm** - Recommendations based on genres, keywords, tagline, cast, director, overview, crew, runtime, ratings, and vote count
- **🎨 Stunning UI** - Dark cinematic theme with animated floating doodles
- **🖼️ Real Movie Posters** - Fetched from TMDb API with genre-based fallbacks
- **📊 Match Percentages** - See how closely each recommendation matches your movie
- **⚡ Fast Performance** - Pre-computed similarity matrix for instant results
- **📱 Fully Responsive** - Works beautifully on desktop, tablet, and mobile

## 🖥️ Screenshots

### Hero Section
- Dark cinematic background with floating cinema doodles (film reels, popcorn, tickets, stars)
- CineMatch branding with orange accent
- Prominent search bar with "Discover" button

### Recommendations
- Movie cards with real posters from TMDb
- Match percentage badges (green pills)
- Movie year and rating display
- Smooth hover animations

## 🛠️ Tech Stack

| Component | Technology |
|-----------|------------|
| **Backend** | Python, FastAPI, scikit-learn |
| **Frontend** | Vanilla JavaScript, CSS3, HTML5 |
| **ML Algorithm** | TF-IDF Vectorization + Cosine Similarity |
| **Poster API** | TMDb (The Movie Database) |
| **Fonts** | Inter, Playfair Display (Google Fonts) |

## 📦 Installation

### Prerequisites
- Python 3.10+
- TMDb API Key (free at [themoviedb.org](https://www.themoviedb.org/settings/api))

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/cinematch.git
   cd cinematch
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   
   # Windows
   .\venv\Scripts\activate
   
   # macOS/Linux
   source venv/bin/activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set TMDb API Key**
   ```bash
   # Windows PowerShell
   $env:TMDB_API_KEY="your_api_key_here"
   
   # macOS/Linux
   export TMDB_API_KEY="your_api_key_here"
   ```

5. **Run the server**
   ```bash
   uvicorn main:app --reload --port 5000
   ```

6. **Open in browser**
   ```
   http://127.0.0.1:5000
   ```

## 🚀 API Endpoints

### `GET /`
Serves the CineMatch frontend website.

### `GET /health`
Health check endpoint for monitoring.

**Response:**
```json
{
  "status": "healthy",
  "tmdb_configured": true,
  "movies_loaded": 4803
}
```

### `POST /recommendation`
Get movie recommendations (titles only).

**Request:**
```json
{
  "movie": "Inception"
}
```

**Response:**
```json
{
  "matched_movies": "Inception",
  "recommendations": ["The Dark Knight", "Interstellar", ...]
}
```

### `POST /movies-with-posters`
Get detailed recommendations with posters and metadata.

**Request:**
```json
{
  "movie": "Inception"
}
```

**Response:**
```json
{
  "searched_movie": "Inception",
  "matched_movie": "Inception",
  "recommendations": [
    {
      "title": "The Dark Knight",
      "year": "2008",
      "rating": 8.5,
      "genres": "Action Crime Drama Thriller",
      "poster_url": "https://image.tmdb.org/t/p/w500/...",
      "match_percentage": 95,
      "tmdb_id": 155
    },
    ...
  ]
}
```

## 🧠 How It Works

### Content-Based Filtering Algorithm

1. **Feature Engineering** - Combines 10 movie features into a single text representation:
   - Genres, Keywords, Tagline, Cast, Director
   - Overview (plot summary), Crew, Runtime
   - Vote Average, Vote Count

2. **TF-IDF Vectorization** - Converts text features into numerical vectors

3. **Cosine Similarity** - Computes similarity scores between all movies

4. **Fuzzy Matching** - Handles typos using `difflib.get_close_matches()`

5. **Ranking** - Returns top 10 most similar movies with match percentages

## 📁 Project Structure

```
cinematch/
├── main.py                 # FastAPI backend with ML algorithm
├── movies.csv              # Movie dataset (4803 movies)
├── requirements.txt        # Python dependencies
├── README.md
└── frontend/
    ├── index.html          # Main HTML page
    ├── css/
    │   └── styles.css      # All styles (dark theme, animations)
    ├── js/
    │   ├── main.js         # App logic (search, render cards)
    │   ├── api.js          # API integration
    │   └── canvas-animation.js  # Animated background doodles
    └── assets/
        └── fallback/       # Genre placeholder images
            ├── action.png
            ├── drama.png
            ├── comedy.png
            ├── horror.png
            ├── scifi.png
            └── default.png
```

## 🌐 Deployment

### Environment Variables
Set the following environment variable on your hosting platform:

| Variable | Description |
|----------|-------------|
| `TMDB_API_KEY` | Your TMDb API key for movie posters |

### Render / Railway / Fly.io
1. Connect your GitHub repository
2. Set `TMDB_API_KEY` in environment variables
3. Build command: `pip install -r requirements.txt`
4. Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`

## 📊 Dataset

The application uses a dataset of **4,803 movies** with the following features:
- Title, Genres, Keywords, Tagline
- Cast, Director, Crew
- Overview (plot summary)
- Budget, Revenue, Runtime
- Release Date, Vote Average, Vote Count
- TMDb ID (for poster fetching)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- [TMDb](https://www.themoviedb.org/) for the movie poster API
- [Google Fonts](https://fonts.google.com/) for Inter and Playfair Display fonts
- Movie dataset from Kaggle

---

<p align="center">
  Made with ❤️ by CineMatch

</p>
