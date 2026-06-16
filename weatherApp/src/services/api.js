// src/services/api.js

import axios from "axios";

/* ------------------------------
   OpenWeather Client
--------------------------------*/
export const weatherClient = axios.create({
  baseURL: "https://api.openweathermap.org/data/2.5",
  timeout: 10000,
});

weatherClient.interceptors.request.use((config) => {
  config.params = {
    ...config.params,
    appid: import.meta.env.VITE_OPENWEATHER_KEY,
  };

  return config;
});

/* ------------------------------
   WeatherAPI Client
--------------------------------*/
export const forecastClient = axios.create({
  baseURL: "https://api.weatherapi.com/v1",
  timeout: 10000,
});

/* ------------------------------
   Geocoding API
--------------------------------*/
export async function getCoordinates(city) {
  try {
    const response = await axios.get(
      "https://geocoding-api.open-meteo.com/v1/search",
      {
        params: {
          name: city,
          count: 1,
          language: "en",
          format: "json",
        },
      }
    );

    if (
      !response.data.results ||
      response.data.results.length === 0
    ) {
      throw new Error("City not found");
    }

    const result = response.data.results[0];

    return {
      name: result.name,
      country: result.country,
      latitude: result.latitude,
      longitude: result.longitude,
    };
  } catch (error) {
    console.error("Geocoding Error:", error);
    throw error;
  }
}

/* ------------------------------
   Current Weather
--------------------------------*/
export async function fetchCurrentWeather(lat, lon) {
  try {
    const response = await weatherClient.get("/weather", {
      params: {
        lat,
        lon,
        units: "metric",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Weather Error:", error);
    throw error;
  }
}

/* ------------------------------
   Forecast
--------------------------------*/
export async function fetchForecast(city) {
  try {
    const response = await forecastClient.get("/forecast.json", {
      params: {
        key: import.meta.env.VITE_WEATHERAPI_KEY,
        q: city,
        days: 7,
        aqi: "yes",
        alerts: "yes",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Forecast Error:", error);
    throw error;
  }
}