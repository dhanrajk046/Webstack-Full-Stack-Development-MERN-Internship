import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useWeather = (lat, lon, cityName) => {
  return useQuery({
    queryKey: ['weatherData', lat, lon, cityName],
    queryFn: async () => {
      // In production, keys are managed via .env variables: import.meta.env.VITE_OPENWEATHER_KEY
      const OPENWEATHER_KEY = 'YOUR_OPENWEATHER_KEY';
      const WEATHERAPI_KEY = 'YOUR_WEATHERAPI_KEY';

      // Safe Check: If keys aren't set up yet, return intelligent simulated data instantly
      if (OPENWEATHER_KEY === 'YOUR_OPENWEATHER_KEY' || WEATHERAPI_KEY === 'YOUR_WEATHERAPI_KEY') {
        await new Promise((resolve) => setTimeout(resolve, 600)); // Simulate natural network latency
        
        // Generate pseudo-random realistic values based on string length to simulate changes per city
        const seed = cityName.length;
        return {
          current: {
            temp: 20 + (seed % 15),
            humidity: 40 + (seed % 45),
            windSpeed: 5 + (seed % 12),
            description: seed % 2 === 0 ? 'Clear sky overhead' : 'Scattered ambient clouds',
          },
          forecast: [
            { date: 'Tomorrow', maxTemp: 26, minTemp: 18, condition: 'Sunny' },
            { date: 'Next Day', maxTemp: 24, minTemp: 17, condition: 'Partly Cloudy' },
          ]
        };
      }

      // Live Fetching Routing Pipeline
      const [currentRes, forecastRes] = await Promise.all([
        axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${OPENWEATHER_KEY}`),
        axios.get(`https://api.weatherapi.com/v1/forecast.json?key=${WEATHERAPI_KEY}&q=${cityName}&days=3`)
      ]);

      return {
        current: {
          temp: currentRes.data.main.temp,
          humidity: currentRes.data.main.humidity,
          windSpeed: currentRes.data.wind.speed,
          description: currentRes.data.weather[0].description,
        },
        forecast: forecastRes.data.forecast.forecastday.map(day => ({
          date: day.date,
          maxTemp: day.day.maxtemp_c,
          minTemp: day.day.mintemp_c,
          condition: day.day.condition.text,
        }))
      };
    },
    staleTime: 1000 * 60 * 5, // Cache entries stay fresh for 5 minutes
  });
};