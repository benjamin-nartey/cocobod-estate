import axios from 'axios';

export default axios.create({
  baseURL: 'https://json-api-6r5i.onrender.com/',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const privateAxios = axios.create({
  baseURL: 'http://localhost:3000/api/v1/',
  headers: {
    'Content-Type': 'application/json',
  },
});
