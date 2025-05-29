import {jwtDecode} from 'jwt-decode';

export const getCurrentUser = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const decoded: { userId: string } = jwtDecode(token);
    return decoded;
  } catch (err) {
    console.error('Token decode failed', err);
    return null;
  }
};
