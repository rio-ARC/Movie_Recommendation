/**
 * CineMatch - Main Application
 * Handles search functionality and UI interactions
 */

class CineMatchApp {
    constructor() {
        // DOM Elements
        this.searchForm = document.getElementById('search-form');
        this.movieInput = document.getElementById('movie-input');
        this.discoverBtn = document.getElementById('discover-btn');
        this.resultsSection = document.getElementById('results-section');
        this.resultsMovieName = document.getElementById('results-movie-name');
        this.resultsCount = document.getElementById('results-count');
        this.moviesGrid = document.getElementById('movies-grid');
        this.loading = document.getElementById('loading');
        this.error = document.getElementById('error');
        this.errorMessage = document.getElementById('error-message');
        this.retryBtn = document.getElementById('retry-btn');
        this.logo = document.getElementById('logo');

        this.init();
    }

    init() {
        // Event listeners
        this.searchForm.addEventListener('submit', (e) => this.handleSearch(e));
        this.retryBtn.addEventListener('click', () => this.handleRetry());
        this.logo.addEventListener('click', () => this.handleLogoClick());

        // Focus input on load
        setTimeout(() => this.movieInput.focus(), 500);
    }

    handleLogoClick() {
        // Scroll to top and reset
        window.scrollTo({ top: 0, behavior: 'smooth' });
        this.resultsSection.classList.remove('visible');
        this.movieInput.value = '';
        this.movieInput.focus();
    }

    async handleSearch(e) {
        e.preventDefault();

        const movieName = this.movieInput.value.trim();
        if (!movieName) {
            this.movieInput.focus();
            return;
        }

        // Show results section
        this.showResults();
        this.showLoading();

        try {
            const data = await window.CineMatchAPI.getRecommendations(movieName);
            this.displayMovies(data);
        } catch (err) {
            this.showError(err.message);
        }
    }

    handleRetry() {
        this.hideError();
        this.movieInput.focus();
        this.movieInput.select();
    }

    showResults() {
        this.resultsSection.classList.add('visible');

        // Smooth scroll to results
        setTimeout(() => {
            this.resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    }

    showLoading() {
        this.loading.classList.add('visible');
        this.error.classList.remove('visible');
        this.moviesGrid.innerHTML = '';
    }

    hideLoading() {
        this.loading.classList.remove('visible');
    }

    showError(message) {
        this.hideLoading();
        this.errorMessage.textContent = message;
        this.error.classList.add('visible');
        this.moviesGrid.innerHTML = '';
    }

    hideError() {
        this.error.classList.remove('visible');
    }

    displayMovies(data) {
        this.hideLoading();
        this.hideError();

        // Update header
        this.resultsMovieName.textContent = data.matched_movie;
        this.resultsCount.textContent = data.recommendations.length;

        // Clear and populate grid
        this.moviesGrid.innerHTML = '';

        data.recommendations.forEach((movie, index) => {
            const card = this.createMovieCard(movie, index);
            this.moviesGrid.appendChild(card);
        });
    }

    createMovieCard(movie, index) {
        const card = document.createElement('div');
        card.className = 'movie-card';
        card.style.animationDelay = `${index * 0.1}s`;

        // Handle poster URL - use placeholder if not available
        let posterUrl = movie.poster_url;
        if (!posterUrl || posterUrl.includes('/static/fallback/')) {
            // Use a gradient placeholder based on genre
            posterUrl = this.getPlaceholderPoster(movie.genres, movie.title);
        }

        card.innerHTML = `
            <img 
                class="movie-poster" 
                src="${posterUrl}" 
                alt="${movie.title} poster"
                onerror="this.src='${this.getDefaultPoster()}'"
                loading="lazy"
            >
            <div class="match-badge">${movie.match_percentage}% Match</div>
            <div class="movie-info">
                <h3 class="movie-title" title="${movie.title}">${movie.title}</h3>
                <div class="movie-meta">
                    <span class="movie-year">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                            <line x1="16" y1="2" x2="16" y2="6"/>
                            <line x1="8" y1="2" x2="8" y2="6"/>
                            <line x1="3" y1="10" x2="21" y2="10"/>
                        </svg>
                        ${movie.year || 'N/A'}
                    </span>
                    <span class="movie-rating">
                        <svg viewBox="0 0 24 24">
                            <path d="M12 2L9.5 9.5L2 12L9.5 14.5L12 22L14.5 14.5L22 12L14.5 9.5L12 2Z"/>
                        </svg>
                        ${movie.rating ? movie.rating.toFixed(1) : 'N/A'}
                    </span>
                </div>
            </div>
        `;

        return card;
    }

    getPlaceholderPoster(genres, title) {
        // Generate a colorful placeholder using an external service
        const colors = {
            'action': '8B0000',
            'drama': '2E4057',
            'comedy': 'FFD700',
            'horror': '1a1a2e',
            'science fiction': '0a192f',
            'romance': 'C71585',
            'adventure': '228B22',
            'thriller': '2C3539',
            'animation': 'FF6B35',
            'fantasy': '6B5B95'
        };

        let color = '374151'; // default gray
        if (genres) {
            const genreLower = genres.toLowerCase();
            for (const [genre, hex] of Object.entries(colors)) {
                if (genreLower.includes(genre)) {
                    color = hex;
                    break;
                }
            }
        }

        // Use placeholder.com for a simple colored placeholder
        const encodedTitle = encodeURIComponent(title.substring(0, 20));
        return `https://via.placeholder.com/300x450/${color}/ffffff?text=${encodedTitle}`;
    }

    getDefaultPoster() {
        return 'https://via.placeholder.com/300x450/374151/ffffff?text=No+Poster';
    }
}

// Initialize app on DOM load
document.addEventListener('DOMContentLoaded', () => {
    window.app = new CineMatchApp();
});
