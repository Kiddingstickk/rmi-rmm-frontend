import express from 'express';
import Manager from '../models/Manager.js'; 
import Company from '../models/Company.js';

const router = express.Router();

const slugify = name =>
  name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');

router.get('/sitemap.xml', async (req, res) => {
  try {
    const managers = await Manager.find({}, 'name');
    const companies = await Company.find({}, 'name');

    const baseUrl = 'https://ratemymanagement.com/'

    const urls = [
        ...managers.map(m => `${baseUrl}/search?q=${encodeURIComponent(m.name)}`),
        ...companies.map(c => `${baseUrl}/search?q=${encodeURIComponent(c.name)}`),
      ];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    url => `  <url>
    <loc>${url}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

    res.setHeader('Content-Type', 'application/xml');
    res.send(xml);
  } catch (err) {
    console.error('Error generating sitemap:', err);
    res.status(500).send('Internal Server Error');
  }
});

export default router;