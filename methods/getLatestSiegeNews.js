const cheerio = require('cheerio');

async function getLatestSiegeNews() {
  try {
    const response = await fetch('https://siege.gg/');
    const html = await response.text();
    const $ = cheerio.load(html);

    const featuredArticles = [];
    const latestArticles = [];

    // Estrae Featured Articles
    $('h2:contains("Featured Articles")').parent().find('a').each((index, article) => {
      const title = $(article).find('img').attr('alt') || '';
      const imageUrl = $(article).find('img').attr('src') || '';
      const link = $(article).attr('href') || '';

      if (title && link) {
        featuredArticles.push({
          title: title.replace(' Siege', '').trim(),
          imageUrl,
          link: link.startsWith('http') ? link : `https://siege.gg${link}`,
          type: 'featured',
          scrapedAt: new Date().toISOString()
        });
      }
    });

    // Estrae Latest Articles
    $('h2:contains("Latest Articles")').parent().find('a').each((index, article) => {
      const title = $(article).find('img').attr('alt') || '';
      const imageUrl = $(article).find('img').attr('src') || '';
      const link = $(article).attr('href') || '';
      const category = $(article).text().includes('News') ? 'news' : 'general';

      if (title && link) {
        latestArticles.push({
          title: title.replace(' Siege', '').trim(),
          imageUrl,
          link: link.startsWith('http') ? link : `https://siege.gg${link}`,
          category,
          type: 'latest',
          scrapedAt: new Date().toISOString()
        });
      }
    });

    return {
      featuredArticles: featuredArticles.slice(0, 5),
      latestArticles: latestArticles.slice(0, 10),
      scrapedAt: new Date().toISOString()
    };

  } catch (error) {
    console.error('Error fetching siege news:', error.message);
    throw new Error(`Error fetching siege news: ${error.message}`);
  }
}

module.exports = getLatestSiegeNews;