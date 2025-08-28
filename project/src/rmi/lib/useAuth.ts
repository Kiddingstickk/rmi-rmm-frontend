// src/rmi/lib/useAuth.ts

export const useAuth = () => {
    const token = localStorage.getItem('token');
    const isLoggedIn = !!token;
  
    const logout = () => {
      localStorage.removeItem('token');
      window.location.href = '/'; // or use navigate if using React Router
    };
  
    return { isLoggedIn, logout , token };
  };
  