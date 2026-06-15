import React from 'react';
import SearchHeader from './features/weather/SearchHeader';
import { useWeatherStore } from './store/useWeatherStore';
import { useWeather } from './hooks/useWeather';
import ForecastChart from './features/weather/ForecastChart';
import AiIntelligencePanel from './features/weather/AiIntelligencePanel';
import { IoCloudSunnyOutline, IoWaterOutline, IoSpeedometerOutline } from 'react-icons/io5';

export default function App() {
  const { coordinates, cityName, unit } = useWeatherStore();
  const { data, isLoading, isError } = useWeather(coordinates.lat, coordinates.lon, cityName);

  const formatTemp = (celsiusValue) => {
    if (!celsiusValue) return '--';
    if (unit === 'imperial') {
      return `${Math.round((celsiusValue * 9) / 5 + 32)}°F`;
    }
    return `${Math.round(celsiusValue)}°C`;
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        <SearchHeader />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Weather Telemetry Column */}
          <div className="lg:col-span-2 space-y-6">
            
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-pulse">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-[#161B26] border border-slate-800/80 h-24 rounded-2xl" />
                ))}
              </div>
            ) : isError ? (
              <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-xl text-sm">
                Network connection timeout encountered while parsing weather matrix.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-[#161B26] border border-slate-800/80 p-5 rounded-2xl flex items-center gap-4 shadow-sm">
                  <div className="p-3 bg-amber-500/10 rounded-xl text-amber-400 text-2xl"><IoCloudSunnyOutline /></div>
                  <div>
                    <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Temperature</p>
                    <p className="text-xl font-bold mt-0.5">{formatTemp(data?.current?.temp)}</p>
                    <p className="text-[10px] text-slate-500 capitalize">{data?.current?.description}</p>
                  </div>
                </div>

                <div className="bg-[#161B26] border border-slate-800/80 p-5 rounded-2xl flex items-center gap-4 shadow-sm">
                  <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400 text-2xl"><IoWaterOutline /></div>
                  <div>
                    <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Humidity</p>
                    <p className="text-xl font-bold mt-0.5">{data?.current?.humidity}%</p>
                    <p className="text-[10px] text-slate-500">Atmospheric saturation</p>
                  </div>
                </div>

                <div className="bg-[#161B26] border border-slate-800/80 p-5 rounded-2xl flex items-center gap-4 shadow-sm">
                  <div className="p-3 bg-teal-500/10 rounded-xl text-teal-400 text-2xl"><IoSpeedometerOutline /></div>
                  <div>
                    <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Wind Speed</p>
                    <p className="text-xl font-bold mt-0.5">{data?.current?.windSpeed} km/h</p>
                    <p className="text-[10px] text-slate-500">Vector data current</p>
                  </div>
                </div>
              </div>
            )}

            {/* Recharts Data Analytics Block */}
            <div className="bg-[#161B26] border border-slate-800/80 rounded-2xl p-6 flex flex-col justify-between shadow-sm">
              <div>
                <h3 className="font-semibold text-slate-200 text-sm">Macro Forecast Analytics</h3>
                <p className="text-xs text-slate-400 mt-0.5">Visualizing projected temperature variances across the upcoming operational window.</p>
              </div>
              
              <div className="mt-6 h-56 flex items-center justify-center">
                {isLoading ? (
                  <div className="text-xs text-slate-500 animate-pulse">Recalibrating chart vectors...</div>
                ) : (
                  <ForecastChart forecastData={data?.forecast} />
                )}
              </div>
            </div>

          </div>

          {/* Right Column AI Content Module */}
          <div className="space-y-6">
            <AiIntelligencePanel weatherData={data} isLoading={isLoading} />
          </div>

        </div>

      </div>
    </div>
  );
}