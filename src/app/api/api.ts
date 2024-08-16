// app/api/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:2024/api', // A URL base do seu backend
});

export default api;
