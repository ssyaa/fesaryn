import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000', // Ganti sesuai URL backend kamu
  withCredentials: true,  // Pastikan denganCredentials diatur agar cookies dapat digunakan
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

export default api;
