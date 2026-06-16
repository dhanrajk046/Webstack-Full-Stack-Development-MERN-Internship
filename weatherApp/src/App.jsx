import React from "react";
import SearchHeader from "./features/weather/SearchHeader";
import AiIntelligencePanel from "./features/weather/AiIntelligencePanel";
import { useWeatherStore } from "./store/useWeatherStore";
import { useWeather } from "./hooks/useWeather";

import {
  IoSunny,
  IoWater,
  IoSpeedometer,
} from "react-icons/io5";

export default function App() {
  const { coordinates, cityName, unit } = useWeatherStore();

  const { data, isLoading, isError } = useWeather(
    coordinates?.lat,
    coordinates?.lon,
    cityName
  );

  const formatTemp = (temp) => {
    if (temp == null) return "--";

    return unit === "imperial"
      ? `${Math.round((temp * 9) / 5 + 32)}°F`
      : `${Math.round(temp)}°C`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-indigo-50 text-slate-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <SearchHeader />

        {isError && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl">
            Failed to load weather data.
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT COLUMN */}
          <div className="lg:col-span-2 space-y-6">

            {/* Weather Cards */}
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-pulse">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-24 rounded-2xl bg-white border border-slate-200"
                  />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

                {/* Temperature */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-amber-100 text-amber-500 text-2xl">
                      <IoSunny />
                    </div>

                    <div>
                      <p className="text-xs uppercase text-slate-500">
                        Temperature
                      </p>

                      <p className="text-2xl font-bold">
                        {formatTemp(data?.current?.temp)}
                      </p>

                      <p className="text-sm text-slate-500 capitalize">
                        {data?.current?.description || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Humidity */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-blue-100 text-blue-500 text-2xl">
                      <IoWater />
                    </div>

                    <div>
                      <p className="text-xs uppercase text-slate-500">
                        Humidity
                      </p>

                      <p className="text-2xl font-bold">
                        {data?.current?.humidity ?? "--"}%
                      </p>
                    </div>
                  </div>
                </div>

                {/* Wind Speed */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-teal-100 text-teal-500 text-2xl">
                      <IoSpeedometer />
                    </div>

                    <div>
                      <p className="text-xs uppercase text-slate-500">
                        Wind Speed
                      </p>

                      <p className="text-2xl font-bold">
                        {data?.current?.windSpeed ?? "--"} km/h
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* Forecast */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h3 className="font-semibold text-lg">
                Macro Forecast Analytics
              </h3>

              <p className="text-slate-500 text-sm mt-1">
                Weather forecast overview
              </p>

              <div className="mt-6">
                {isLoading ? (
                  <div className="text-slate-500">
                    Loading forecast...
                  </div>
                ) : data?.forecast?.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {data.forecast.map((day, index) => (
                      <div
                        key={index}
                        className="border border-slate-200 rounded-xl p-4 text-center"
                      >
                        <p className="font-semibold text-lg">
                          Day {index + 1}
                        </p>

                        <p className="text-2xl font-bold mt-2">
                          {formatTemp(day.maxTemp)}
                        </p>

                        <p className="text-sm text-slate-500 mt-1">
                          Min: {formatTemp(day.minTemp)}
                        </p>

                        <p className="text-sm text-slate-600 mt-2 capitalize">
                          {day.condition}
                        </p>

                        <p className="text-xs text-slate-400 mt-2">
                          {day.date}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-slate-500">
                    No forecast data available.
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN */}
          <div>
            <AiIntelligencePanel
              weatherData={data}
              isLoading={isLoading}
            />
          </div>

        </div>
      </div>
    </div>
  );
}