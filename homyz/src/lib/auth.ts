import axios from 'axios';

export const isAuthenticated = async (token: string | null) => {
  if (!token) return false;
  try {
    const response = await axios.get('http://localhost:4000/api/userinfo', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.status === 200;
  } catch (error) {
    return false;
  }
};
