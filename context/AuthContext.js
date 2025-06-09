//authcontext
import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({name: 'Garvesh Jangid',
  email: 'garveshjangid@lunarEdge.com',
  avatar: 'https://i.pravatar.cc/150?img=8',});

  const updateUser = (updates) => {
  setUser((prev) => ({ ...prev, ...updates }));
};

  const login = async (username, password) => {
    
    if (username && password) {
      const userData = {
        name: 'Garvesh Jangid',
        email: 'garveshjangid@lunarEdge.com',
        avatar: 'https://i.pravatar.cc/150?img=8',
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

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

