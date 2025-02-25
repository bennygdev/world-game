import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const userData = JSON.parse(localStorage.getItem('userData'));
      setUser(userData);
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const response = await axios.post('http://localhost:8080/api/login', {
        username,
        password
      });
      
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('userData', JSON.stringify(user));
      setUser(user);
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      
      if (error.response) {
        // server responded with a status code
        return { 
          success: false, 
          error: error.response.data.error || 'Failed to login'
        };
      } else if (error.request) {
        // no response was received
        return {
          success: false,
          error: 'No response from server. Please check your connection and try again.'
        };
      } else {
        return {
          success: false,
          error: 'An error occurred while trying to log in.'
        };
      };
    }
  };

  const register = async (username, password) => {
    try {
      const response = await axios.post('http://localhost:8080/api/register', {
        username,
        password
      });
      return { success: true, user: response.data.user };
    } catch (error) {
      console.error('Registration error:', error);
      
      if (error.response) {
        // server responded with a status code
        return { 
          success: false, 
          error: error.response.data.error || 'Failed to register'
        };
      } else if (error.request) {
        // no response was received
        return {
          success: false,
          error: 'No response from server. Please check your connection and try again.'
        };
      } else {
        return {
          success: false,
          error: 'An error occurred while trying to register.'
        };
      }
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    setUser(null);
    window.location.reload();
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);