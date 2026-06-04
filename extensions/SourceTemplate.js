/**
 * Base template for Hayase extensions
 * Provides common utilities like fetching text data.
 */
class SourceTemplate {
    constructor() {
        this.name = "SourceTemplate";
    }

    /**
     * Search for torrents (To be overridden by extensions)
     * @param {string} query - The search query
     * @returns {Promise<Array>} - Array of torrent objects
     */
    async search(query) {
        return [];
    }

    /**
     * Helper method to perform fetch requests and get text/XML
     * @param {string} url - The URL to fetch
     * @returns {Promise<string>} - The raw text response
     */
    async fetchText(url) {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch from ${url}. Status: ${response.status}`);
        }
        return await response.text();
    }
}

module.exports = SourceTemplate;
