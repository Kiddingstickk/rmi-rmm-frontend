import express from 'express';
import axios from 'axios';

const router = express.Router();

router.post('/', async (req, res) => {
  const { city } = req.body;
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;

  if (!city) return res.status(400).json({ error: 'City is required' });

  try {
    const response = await axios.get(
      'https://maps.googleapis.com/maps/api/geocode/json',
      {
        params: {
          address: city,
          key: apiKey,
        },
      }
    );
    console.log("Geocode API response:", response.data);
    const result = response.data.results[0];
    if (!result) return res.status(404).json({ error: 'City not found' });

    const { lat, lng } = result.geometry.location;
    res.json({ city, lat, lng });
  } catch (err) {
    console.error('Geocoding error:', err.message);
    res.status(500).json({ error: 'Geocoding failed', details: err.message });
  }
});

export default router;