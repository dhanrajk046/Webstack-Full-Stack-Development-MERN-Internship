// src/services/api.js
import axios from 'axios';

// Base instances for your chosen providers
export const weatherClient = axios.create({
  baseURL: 'https://api.openweathermap.org/data/2.5',
  timeout: 10000,
});

export const forecastClient = axios.create({
  baseURL: 'https://api.weatherapi.com/v1',
  timeout: 10000,
});

// Example Request Interceptor to attach API keys dynamically if needed
weatherClient.interceptors.request.use((config) => {
  // In production, keys are managed through secure backend/edge functions
  config.params = {
    ...config.params,
    appid: import.meta.env.VITE_OPENWEATHER_KEY,
  };
  return config;
});