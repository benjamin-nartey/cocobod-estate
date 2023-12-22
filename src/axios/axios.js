import axios from 'axios';

export default axios.create({
  baseURL: 'https://json-api-6r5i.onrender.com/api/v1/',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const privateAxios = axios.create({
<<<<<<< HEAD
  baseURL: 'https://estate-api-2.onrender.com/api/v1/',
=======
  // baseURL: 'https://estate-api-2.onrender.com/api/v1/',
  baseURL: 'https://localhost:3000/api/v1/',
>>>>>>> 309412deb89e0660c2694a900a6568e4face2268
  headers: {
    'Content-Type': 'application/json',
  },
});
