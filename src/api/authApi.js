// api/authApi.js
const API_BASE_URL = 'https://simpleexpress-e3hn.onrender.com/api';

export const registerUser = async (username, email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    });

    return await response.json();
  } catch (error) {
    console.error('Register API failed:', error);
    throw error;
  }
};

export const loginUser = async (email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    return await response.json();
  } catch (error) {
    console.error('Login API failed:', error);
    throw error;
  }
};

export const fetchUsers = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/users`);
    return await response.json();
  } catch (error) {
    console.error('Fetch users API failed:', error);
    throw error;
  }
};
