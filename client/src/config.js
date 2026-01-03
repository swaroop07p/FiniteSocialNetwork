// client/src/config.js
export const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://finite-backend-pyea.onrender.com' // You will change this later
  : 'http://localhost:5000';