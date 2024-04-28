// src/utils/api.js (or any appropriate location)

import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:5000/api', // Adjust this base URL as needed
});

export default instance;
