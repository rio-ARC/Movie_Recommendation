/**
 * CineMatch - API Module
 * Handles all API calls to the backend
 */

const API_BASE_URL = window.location.hostname === 'localhost'
    ? 'http://localhost:8000'
    : ''; // Same origin for production

/**
 * Get movie recommendations with poster details
 * @param {string} movieName - Name of the movie to search for
 * @returns {Promise<Object>} - Recommendation response
 */
async function getRecommendations(movieName) {
    const response = await fetch(`${API_BASE_URL}/movies-with-posters`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ movie: movieName }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to get recommendations');
    }

    return response.json();
}

/**
 * Get basic recommendations (titles only)
 * @param {string} movieName - Name of the movie to search for
 * @returns {Promise<Object>} - Basic recommendation response
 */
async function getBasicRecommendations(movieName) {
    const response = await fetch(`${API_BASE_URL}/recommendation`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ movie: movieName }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to get recommendations');
    }

    return response.json();
}

/**
 * Check API health
 * @returns {Promise<Object>} - Health status
 */
async function checkHealth() {
    const response = await fetch(`${API_BASE_URL}/health`);
    return response.json();
}

// Export for use in main.js
window.CineMatchAPI = {
    getRecommendations,
    getBasicRecommendations,
    checkHealth
};
