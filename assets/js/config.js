/**
 * Configuration file for API endpoints
 * Automatically detects environment and uses appropriate API URL
 */

import { getApiBase } from './utils.js';

/**
 * Get the API URL based on current environment
 * @returns {string} The API base URL
 */
export function getApiUrl() {
    const base = getApiBase();
    return `${base}/api`;
}

// Export as default constant for convenience
export const API_URL = getApiUrl();

// Log the current API URL for debugging
console.log('🔧 API URL configured:', API_URL);
