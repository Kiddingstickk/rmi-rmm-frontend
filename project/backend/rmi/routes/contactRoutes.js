// routes/contactRoutes.js
import express from 'express';
const router = express.Router();

router.post('/', async (req, res) => {
  const { name, email, subject, message } = req.body;
  console.log('New Contact Message:', { name, email, subject, message });

  // You can later connect this to email or DB if you want.
  res.status(200).json({ message: 'Message received' });
});

export default router;
