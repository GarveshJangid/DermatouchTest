import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { registerUser, loginUser } from '../api/authApi'; 


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          setUser(JSON.parse(userData));
        }
      } catch (error) {
        console.error('Failed to load user data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  useEffect(() => {
    const saveUser = async () => {
      try {
        if (user) {
          await AsyncStorage.setItem('user', JSON.stringify(user));
        } else {
          await AsyncStorage.removeItem('user');
        }
      } catch (error) {
        console.error('Failed to save user data:', error);
      }
    };
    if (!loading) {
      saveUser();
    }
  }, [user, loading]);

  const register = async (username, email, password) => {
    try {
      const data = await registerUser(username, email, password);

      if (data.success) {
        const newUser = {
          id: data.user.id,
          username: data.user.username,
          email: data.user.email,
        };
        setUser(newUser);
        await AsyncStorage.setItem('user', JSON.stringify(newUser));
        return { success: true, message: data.message };
      } else {
        return { success: false, message: data.message || 'Registration failed' };
      }
    } catch (error) {
      return { success: false, message: 'Network error' };
    }
  };

  const login = async (email, password) => {
    try {
      const data = await loginUser(email, password);

      if (data.success) {
        const userData = {
          id: data.user.id,
          username: data.user.username,
          email: data.user.email,
        };
        setUser(userData);
        await AsyncStorage.setItem('user', JSON.stringify(userData));
        return { success: true, message: data.message };
      } else {
        return { success: false, message: data.message || 'Login failed' };
      }
    } catch (error) {
      return { success: false, message: 'Network error' };
    }
  };

  const logout = async (navigation) => {
    try {
      await AsyncStorage.removeItem('user');
      setUser(null);
      
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
