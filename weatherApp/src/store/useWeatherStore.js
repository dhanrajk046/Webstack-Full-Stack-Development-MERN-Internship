import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useWeatherStore = create(
  persist(
    (set) => ({
      unit: 'metric', // 'metric' | 'imperial'
      coordinates: { lat: 23.2599, lon: 77.4126 }, // Defaults to Bhopal, India
      cityName: 'Bhopal',
      searchHistory: [],
      
      setUnit: (unit) => set({ unit }),
      setLocation: (lat, lon, cityName) => set((state) => ({
        coordinates: { lat, lon },
        cityName,
        searchHistory: [...new Set([cityName, ...state.searchHistory])].slice(0, 5) // Keep top 5 unique searches
      })),
      clearHistory: () => set({ searchHistory: [] }),
    }),
    { name: 'weather-platform-state' } // Automatically caches preferences to local storage
  )
)