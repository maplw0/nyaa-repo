const fs = require('fs');
const path = require('path');

const extensionsDir = path.join(__dirname, '..', 'extensions');
const outputFile = path.join(__dirname, '..', 'index.json');

// Ensure you replace YOUR_GITHUB_NAME and YOUR_REPO_NAME before deploying
const baseUrl = 'https://raw.githubusercontent.com/maplw0/nyaa-repo/main/extensions/';

const manifest = [];

try {
    const files = fs.readdirSync(extensionsDir);

    files.forEach(file => {
        // Only process JavaScript files
        if (!file.endsWith('.js')) return;

        const filePath = path.join(extensionsDir, file);
        const content = fs.readFileSync(filePath, 'utf-8');

        // Helper function to extract metadata tags
        const getMeta = (tag) => {
            const match = content.match(new RegExp(`@${tag}\\s+(.+)`));
            return match ? match[1].trim() : null;
        };

        const name = getMeta('name');
        
        // Only include files that have at least a valid @name tag
        if (name) {
            manifest.push({
                name: name,
                author: getMeta('author') || 'Unknown',
                version: getMeta('version') || '1.0.0',
                type: getMeta('type') || 'torrent',
                doc: getMeta('doc') || getMeta('description') || 'Custom extension',
                url: `${baseUrl}${file}`
            });
        }
    });

    // Write the compiled array to index.json
    fs.writeFileSync(outputFile, JSON.stringify(manifest, null, 2));
    console.log(`✅ Successfully compiled manifest with ${manifest.length} extensions into index.json`);

} catch (error) {
    console.error("❌ Failed to generate manifest:", error.message);
}
