// src/utils/normalizers.js

/**
 * Unifies diverse API responses into a single premium platform state object.
 */
export const normalizeWeatherData = (currentRaw, forecastRaw, airQualityRaw) => {
  if (!currentRaw || !forecastRaw) return null;

  return {
    location: {
      name: forecastRaw.location?.name || currentRaw.name,
      country: forecastRaw.location?.country,
      timezone: currentRaw.timezone,
    },
    metrics: {
      temperature: currentRaw.main?.temp,
      feelsLike: currentRaw.main?.feels_like,
      humidity: currentRaw.main?.humidity,
      pressure: currentRaw.main?.pressure,
      uvIndex: forecastRaw.current?.uv || 0,
      visibility: currentRaw.visibility / 1000, // Convert meters to km
      wind: {
        speed: currentRaw.wind?.speed,
        deg: currentRaw.wind?.deg,
      },
    },
    condition: {
      text: currentRaw.weather?.[0]?.description,
      iconId: currentRaw.weather?.[0]?.icon,
      main: currentRaw.weather?.[0]?.main,
    },
    airQuality: {
      aqi: airQualityRaw?.list?.[0]?.main?.aqi || 1, // 1-5 index scale
      pm25: airQualityRaw?.list?.[0]?.components?.pm2_5 || 0,
      pm10: airQualityRaw?.list?.[0]?.components?.pm10 || 0,
      no2: airQualityRaw?.list?.[0]?.components?.no2 || 0,
    },
    forecast: (forecastRaw.forecast?.forecastday || []).map((day) => ({
      date: day.date,
      maxTemp: day.day?.maxtemp_c,
      minTemp: day.day?.mintemp_c,
      condition: {
        text: day.day?.condition?.text,
        icon: day.day?.condition?.icon,
      },
      rainChance: day.day?.daily_chance_of_rain || 0,
    })),
  };
};