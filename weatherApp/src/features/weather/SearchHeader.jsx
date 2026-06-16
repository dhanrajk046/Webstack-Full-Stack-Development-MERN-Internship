import React, { useState } from "react";
import axios from "axios";
import { IoSearchOutline } from "react-icons/io5";
import { useWeatherStore } from "../../store/useWeatherStore";

export default function SearchHeader() {
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const { cityName, setLocation, unit, setUnit } =
    useWeatherStore();

  const OPENWEATHER_KEY =
    import.meta.env.VITE_OPENWEATHER_KEY;

  const cities = [
    "Delhi",
    "Mumbai",
    "Bangalore",
    "Chennai",
    "Hyderabad",
    "Kolkata",
    "Pune",
    "Ahmedabad",
    "Jaipur",
    "Bhopal",
    "Tokyo",
    "London",
    "Paris",
    "New York",
    "Los Angeles",
    "Toronto",
    "Dubai",
    "Singapore",
    "Sydney",
    "Berlin",
    "Rome",
  ];

  const handleInputChange = (e) => {
    const value = e.target.value;

    setInput(value);
    setSelectedIndex(-1);

    if (!value.trim()) {
      setSuggestions([]);
      return;
    }

    const filtered = cities.filter((city) =>
      city.toLowerCase().includes(value.toLowerCase())
    );

    setSuggestions(filtered.slice(0, 5));
  };

  const searchCity = async (city) => {
    try {
      const res = await axios.get(
        "https://api.openweathermap.org/geo/1.0/direct",
        {
          params: {
            q: city,
            limit: 1,
            appid: OPENWEATHER_KEY,
          },
        }
      );

      if (!res.data.length) {
        alert("City not found");
        return;
      }

      const location = res.data[0];

      setLocation(
        location.lat,
        location.lon,
        location.name
      );

      setInput(location.name);
      setSuggestions([]);
      setSelectedIndex(-1);
    } catch (error) {
      console.error(error);
      alert("Failed to search city");
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!input.trim()) return;

    if (
      selectedIndex >= 0 &&
      selectedIndex < suggestions.length
    ) {
      await searchCity(suggestions[selectedIndex]);
      return;
    }

    await searchCity(input.trim());
  };

  const handleKeyDown = async (e) => {
    if (!suggestions.length) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();

      setSelectedIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();

      setSelectedIndex((prev) =>
        prev > 0 ? prev - 1 : suggestions.length - 1
      );
    } else if (e.key === "Enter") {
      if (selectedIndex >= 0) {
        e.preventDefault();
        await searchCity(suggestions[selectedIndex]);
      }
    } else if (e.key === "Escape") {
      setSuggestions([]);
      setSelectedIndex(-1);
    }
  };

  return (
    <header className="w-full flex flex-col lg:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-300">
      <div>
        <h1 className="text-4xl font-bold text-slate-900">
          Weather Intelligence Platform
        </h1>

        <p className="text-sm text-slate-600 mt-2">
          Currently monitoring:
          <span className="ml-1 text-blue-600 font-semibold">
            {cityName}
          </span>
        </p>
      </div>

      <div className="flex items-center gap-3 w-full lg:w-auto">
        <form
          onSubmit={handleSearch}
          className="relative flex-1 lg:w-[420px]"
        >
          <IoSearchOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl" />

          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Search city"
            className="w-full pl-12 pr-4 py-4 bg-white border border-slate-300 rounded-2xl"
          />

          {suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border rounded-2xl shadow-xl overflow-hidden z-50">
              {suggestions.map((city, index) => (
                <button
                  key={city}
                  type="button"
                  onClick={() => searchCity(city)}
                  className={`w-full text-left px-4 py-3 ${
                    index === selectedIndex
                      ? "bg-sky-100"
                      : "hover:bg-sky-50"
                  }`}
                >
                  {city}
                </button>
              ))}
            </div>
          )}
        </form>

        <div className="flex bg-white border rounded-2xl p-1">
          <button
            onClick={() => setUnit("metric")}
            className={
              unit === "metric"
                ? "bg-blue-500 text-white px-4 py-2 rounded-xl"
                : "px-4 py-2"
            }
          >
            °C
          </button>

          <button
            onClick={() => setUnit("imperial")}
            className={
              unit === "imperial"
                ? "bg-blue-500 text-white px-4 py-2 rounded-xl"
                : "px-4 py-2"
            }
          >
            °F
          </button>
        </div>
      </div>
    </header>
  );
}