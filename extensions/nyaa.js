// ==MiruExtension==
// @name         Nyaa
// @version      1.0.0
// @type         torrent
// @doc          Nyaa.si RSS scraper
// ==/MiruExtension==

export default class extends Extension {
    async latest() {
        const res = await this.request("https://nyaa.si/?page=rss");
        return this.parseXML(res);
    }

    async search(keyword) {
        const res = await this.request(`https://nyaa.si/?page=rss&q=${encodeURIComponent(keyword)}`);
        return this.parseXML(res);
    }

    parseXML(xmlString) {
        const results = [];
        const itemRegex = /<item>([\s\S]*?)<\/item>/g;
        let match;

        while ((match = itemRegex.exec(xmlString)) !== null) {
            const itemXml = match[1];

            const titleMatch = itemXml.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/) || itemXml.match(/<title>(.*?)<\/title>/);
            const name = titleMatch ? titleMatch[1] : 'Unknown';

            const linkMatch = itemXml.match(/<link>(.*?)<\/link>/);
            const url = linkMatch ? linkMatch[1] : '';

            const sizeMatch = itemXml.match(/<nyaa:size>(.*?)<\/nyaa:size>/);
            const size = sizeMatch ? sizeMatch[1] : '0 B';

            if (name !== 'Unknown') {
                results.push({ name, url, size });
            }
        }

        return results;
    }
}
