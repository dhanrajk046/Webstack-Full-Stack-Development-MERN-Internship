import React, { useState } from 'react';
import { IoSearchOutline, IoLocationOutline } from 'react-icons/io5';
import { useWeatherStore } from '../../store/useWeatherStore';

export default function SearchHeader() {
  const [input, setInput] = useState('');
  const { cityName, setLocation, unit, setUnit } = useWeatherStore();

  const handleSearch = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    // For now, we mock coordinates for demonstration. 
    // In the next step, this will connect to a Geocoding API.
    setLocation(28.6139, 77.2090, input);
    setInput('');
  };

  return (
    <header className="w-full flex flex-col md:flex-row items-center justify-between gap-4 pb-6 border-b border-slate-800">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Weather Intelligence Platform
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Currently monitoring: <span className="text-sky-400 font-medium">{cityName}</span>
        </p>
      </div>

      <div className="flex items-center gap-3 w-full md:w-auto">
        <form onSubmit={handleSearch} className="relative flex-1 md:w-80">
          <IoSearchOutline className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
          <input
            type="text"
            value={input}
            onChange={(e) => e.target.value}
            placeholder="Search global intelligence signatures (e.g., Tokyo)..."
            className="w-full pl-10 pr-4 py-2 bg-slate-900/50 border border-slate-800 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/50 transition-all"
          />
        </form>

        {/* Metric / Imperial Unit Toggle Control */}
        <div className="flex bg-slate-900/80 border border-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setUnit('metric')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
              unit === 'metric' ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            °C
          </button>
          <button
            onClick={() => setUnit('imperial')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
              unit === 'imperial' ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            °F
          </button>
        </div>
      </div>
    </header>
  );
}