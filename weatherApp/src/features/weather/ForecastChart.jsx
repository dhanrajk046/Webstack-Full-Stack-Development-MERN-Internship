import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useWeatherStore } from '../../store/useWeatherStore';

export default function ForecastChart({ forecastData }) {
  const { unit } = useWeatherStore();

  const formattedData = forecastData?.map((day) => {
    const rawMax = day.maxTemp;
    const rawMin = day.minTemp;

    const max = unit === 'imperial' ? Math.round((rawMax * 9) / 5 + 32) : Math.round(rawMax);
    const min = unit === 'imperial' ? Math.round((rawMin * 9) / 5 + 32) : Math.round(rawMin);

    const dayName = new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' });

    return {
      name: day.date === 'Tomorrow' || day.date === 'Next Day' ? day.date : dayName,
      High: max,
      Low: min,
      condition: day.condition,
    };
  });

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#1E2538] border border-slate-800 p-3 rounded-xl shadow-xl text-xs">
          <p className="text-slate-400 font-medium mb-1.5">{payload[0].payload.name}</p>
          <p className="text-sky-400 font-semibold">High: {payload[0].value}°</p>
          <p className="text-indigo-400 font-semibold">Low: {payload[1].value}°</p>
          <p className="text-slate-500 text-[10px] mt-1 capitalize">{payload[0].payload.condition}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-full min-h-[220px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={formattedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorHigh" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#38BDF8" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#38BDF8" stopOpacity={0} />
            </linearGradient>
          </defs>
          
          <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
          <XAxis dataKey="name" stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} />
          <YAxis stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} domain={['dataMin - 3', 'dataMax + 3']} />
          <Tooltip content={<CustomTooltip />} />
          
          <Area type="monotone" dataKey="High" stroke="#38BDF8" strokeWidth={2} fillOpacity={1} fill="url(#colorHigh)" />
          <Area type="monotone" dataKey="Low" stroke="#6366F1" strokeWidth={1.5} strokeDasharray="4 4" fill="none" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}