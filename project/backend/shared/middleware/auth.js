// shared/middleware/auth.js
import jwt from 'jsonwebtoken';

const auth = (req, res, next) => {
  const authHeader = req.header('Authorization');
  const token = authHeader?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach a consistent user object
    req.user = {
      ...decoded,
      id: decoded.userId || decoded.id || null
    };

    if (!req.user.id) {
      return res.status(401).json({ message: 'Invalid token structure' });
    }

    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token is not valid' });
  }
};

export default auth;
