import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useWeather = (lat, lon, cityName) => {
  return useQuery({
    queryKey: ["weatherData", lat, lon, cityName],

    enabled: !!lat && !!lon && !!cityName,

    queryFn: async () => {
      const OPENWEATHER_KEY = import.meta.env.VITE_OPENWEATHER_KEY;
      const WEATHERAPI_KEY = import.meta.env.VITE_WEATHERAPI_KEY;

      if (!OPENWEATHER_KEY) {
        throw new Error("Missing VITE_OPENWEATHER_KEY");
      }

      if (!WEATHERAPI_KEY) {
        throw new Error("Missing VITE_WEATHERAPI_KEY");
      }

      try {
        // Current Weather
        const currentRes = await axios.get(
          "https://api.openweathermap.org/data/2.5/weather",
          {
            params: {
              lat,
              lon,
              units: "metric",
              appid: OPENWEATHER_KEY,
            },
          }
        );

        // Forecast
        const forecastRes = await axios.get(
          "https://api.weatherapi.com/v1/forecast.json",
          {
            params: {
              key: WEATHERAPI_KEY,
              q: cityName,
              days: 3,
              aqi: "yes",
              alerts: "yes",
            },
          }
        );

        console.log("Forecast API Response:", forecastRes.data);

        const forecastData =
          forecastRes.data?.forecast?.forecastday?.map((day) => ({
            date: day.date,
            maxTemp: Math.round(day.day.maxtemp_c),
            minTemp: Math.round(day.day.mintemp_c),
            condition: day.day.condition.text,
          })) || [];

        console.log("Mapped Forecast:", forecastData);

        return {
          current: {
            temp: Math.round(currentRes.data.main.temp),
            humidity: currentRes.data.main.humidity,
            windSpeed: Math.round(currentRes.data.wind.speed * 3.6),
            description:
              currentRes.data.weather?.[0]?.description ||
              "Unknown weather",
          },

          forecast: forecastData,
        };
      } catch (error) {
        console.error("WEATHER API ERROR:", error);

        if (error.response) {
          console.error("Status:", error.response.status);
          console.error("Response:", error.response.data);
        }

        throw error;
      }
    },

    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
};