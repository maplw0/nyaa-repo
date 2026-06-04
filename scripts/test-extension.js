const fs = require('fs');
const path = require('path');

// 1. Mock the global Extension class and inject native fetch wrapper
global.Extension = class Extension {
    async request(url) {
        // Use Node.js native fetch (available in v18+) to handle live web traffic
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
        }
        return await response.text();
    }
};

async function runDiagnostics() {
    console.log("🚀 Starting Nyaa live diagnostic check...\n");

    try {
        // 2. Dynamically read the extension file
        const extPath = path.join(__dirname, '..', 'extensions', 'nyaa.js');
        const rawCode = fs.readFileSync(extPath, 'utf-8');

        // 3. Compile code: Strip ES6 export so it runs cleanly in CommonJS/Node test environment
        const compiledCode = rawCode.replace(
            /export\s+default\s+class\s*(extends\s+Extension)?/, 
            'class TestExtension extends Extension'
        ) + '\nreturn TestExtension;';

        // Evaluate the string into a usable JavaScript class
        const ExtensionClass = new Function(compiledCode)();

        // 4. Instantiate the scraping engine
        const nyaa = new ExtensionClass();

        // --- TEST 1: LATEST FEED ---
        console.log("--- Testing latest() feed ---");
        const latestResults = await nyaa.latest();
        console.log(`✅ Successfully parsed ${latestResults.length} items.`);
        console.log("Previewing first 3 items:");
        console.log(JSON.stringify(latestResults.slice(0, 3), null, 2));

        // --- TEST 2: SEARCH QUERY ---
        console.log("\n--- Testing search('One Piece') ---");
        const searchResults = await nyaa.search('One Piece');
        console.log(`✅ Successfully parsed ${searchResults.length} items.`);
        console.log("Previewing first 3 items:");
        console.log(JSON.stringify(searchResults.slice(0, 3), null, 2));

        console.log("\n🎉 Diagnostic checks passed! The parser is successfully handling live XML.");
        
    } catch (error) {
        console.error("\n❌ Diagnostic check failed:");
        console.error(error);
    }
}

// Execute the test
runDiagnostics();
