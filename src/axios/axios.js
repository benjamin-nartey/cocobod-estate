import axios from 'axios';

export default axios.create({
  baseURL: 'https://json-api-6r5i.onrender.com/api/v1/',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const privateAxios = axios.create({
  baseURL: 'https://estate-api-2.onrender.com/api/v1/',
  // baseURL: 'https://estate.cocobod.net/api/v1/',
  headers: {
    'Content-Type': 'application/json',
  },
});
