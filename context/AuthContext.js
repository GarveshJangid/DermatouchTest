import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';
import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({
    name: 'Garvesh Jangid',
    email: 'garveshjangid@lunarEdge.com',
    avatar: 'https://i.pravatar.cc/150?img=8',
    addresses: [], // 🆕 initialize address list
  });

  const updateUser = (updates) => {
    setUser((prev) => {
      const updatedUser = { ...prev, ...updates };
      return updatedUser;
    });
  };

  const login = async (username, password) => {
    if (username && password) {
      const userData = {
        name: 'Garvesh Jangid',
        email: 'garveshjangid@lunarEdge.com',
        avatar: 'https://i.pravatar.cc/150?img=8',
        addresses: [], // 🆕 reset on login if needed
      };
      setUser(userData);
      return true;
    }
    return false;
  };

  const logout = (navigation) => {
    setUser(null);
    navigation.replace('Login');
  };
  useEffect(() => {
  AsyncStorage.getItem('user').then((data) => {
    if (data) {
      setUser(JSON.parse(data));
    }
  });
}, []);

useEffect(() => {
  if (user) {
    AsyncStorage.setItem('user', JSON.stringify(user));
  }
}, [user]);

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
