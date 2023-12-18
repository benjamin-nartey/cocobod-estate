import axios from 'axios';

export default axios.create({
  baseURL: 'https://json-api-6r5i.onrender.com/',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const privateAxios = axios.create({
  baseURL: 'https://0a2c-2a0d-5600-41-c000-00-8b94.ngrok-free.app/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});
