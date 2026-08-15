// api.js - Centralized API Service
const BASE_URL = 'https://localhost:7123'; // Replace with your backend server URL

/**
 * Utility function to handle all HTTP fetch requests
 * @param {string} endpoint - API route (e.g., '/api/quiz')
 * @param {string} method - HTTP method ('GET', 'POST', 'PUT', 'DELETE')
 * @param {object|null} body - Data payload for POST/PUT requests
 */
async function customFetch(endpoint, method = 'GET', body = null) {
    const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    };

    const config = {
        method: method,
        headers: headers
    };

    if (body) {
        config.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, config);
        
        if (!response.ok) {
            throw new Error(`Server Error: ${response.status} ${response.statusText}`);
        }

        // Return empty response if HTTP 204 No Content
        if (response.status === 204) return null;

        return await response.json();
    } catch (error) {
        console.error(`[API Error] Request failed for ${endpoint}:`, error);
        throw error;
    }
}