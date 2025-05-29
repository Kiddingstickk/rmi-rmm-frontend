import jwt from 'jsonwebtoken';

const testJWT = () => {
  const payload = { userId: '12345' };  // Example payload
  const secretKey = 'sibifbisbibcw/icsbiohcnowbvb';  // Use your JWT_SECRET here

  // Create a JWT token
  const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });

  console.log('Generated Token:', token);

  // Verify the JWT token
  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      console.log('Token verification failed:', err);
    } else {
      console.log('Decoded Payload:', decoded);  // Should print decoded userId
    }
  });
};

// Run the test
testJWT();
