import express from 'express';
import nodemailer from 'nodemailer';

const router = express.Router();

router.post('/', async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'satypanday@gmail.com',
      pass: 'dfneraicmvcyhtat',
    },
  });

  const mailOptions = {
    from: email,
    to: 'satypanday@gmail.com',
    subject: `Contact Form: ${subject}`,
    text: `From: ${name} (${email})\n\n${message}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Email sent successfully!' });
  } catch (error) {
    console.error('Email failed:', error);
    res.status(500).json({ message: 'Failed to send email.' });
  }
});

export default router;