import React from "react";
import {
  IoSparklesOutline,
  IoShieldCheckmarkOutline,
  IoWarningOutline,
  IoTrendingUpOutline,
} from "react-icons/io5";

export default function AiIntelligencePanel({
  weatherData,
  isLoading,
}) {
  if (isLoading) {
    return (
      <div className="bg-[#161B26] border border-slate-800 p-6 rounded-2xl h-full animate-pulse space-y-4">
        <div className="h-4 bg-slate-700 rounded w-1/3"></div>
        <div className="h-24 bg-slate-800 rounded-xl"></div>
        <div className="h-20 bg-slate-800 rounded-xl"></div>
      </div>
    );
  }

  const temp = weatherData?.current?.temp || 0;
  const humidity = weatherData?.current?.humidity || 0;

  const generateInsights = () => {
    if (temp > 30) {
      return {
        status: "Thermal Elevation Warning",
        statusColor:
          "text-amber-400 bg-amber-500/10 border-amber-500/20",
        assessment:
          "Atmospheric telemetry indicates elevated temperature conditions. Hydration and cooling measures are strongly recommended.",
        risk:
          "High heat index and increased dehydration risk during prolonged outdoor exposure.",
        action:
          "Stay hydrated, seek shade during peak sunlight hours, and limit strenuous outdoor activity.",
        icon: <IoWarningOutline className="text-amber-400" />,
      };
    }

    if (humidity > 75) {
      return {
        status: "Moisture Saturation Warning",
        statusColor:
          "text-sky-400 bg-sky-500/10 border-sky-500/20",
        assessment:
          "High humidity levels detected. Air moisture concentration may reduce comfort and increase perceived temperatures.",
        risk:
          "Elevated chance of precipitation and reduced evaporation efficiency.",
        action:
          "Monitor weather conditions and ensure proper ventilation where necessary.",
        icon: <IoWarningOutline className="text-sky-400" />,
      };
    }

    return {
      status: "Optimal Conditions",
      statusColor:
        "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
      assessment:
        "Temperature and humidity levels are currently within comfortable operational ranges.",
      risk:
        "No significant weather-related risks detected at this time.",
      action:
        "Proceed with regular outdoor and indoor activities.",
      icon: (
        <IoShieldCheckmarkOutline className="text-emerald-400" />
      ),
    };
  };

  const insight = generateInsights();

  return (
    <div className="bg-[#161B26] border border-slate-800/80 bg-gradient-to-b from-[#161B26] to-[#121620] rounded-2xl p-6 shadow-md relative overflow-hidden h-full">
      <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/5 blur-3xl rounded-full pointer-events-none" />

      {/* Header */}
      <div className="flex items-center gap-2 mb-5 text-sky-400 border-b border-slate-800/60 pb-3">
        <IoSparklesOutline className="text-lg animate-pulse" />
        <h3 className="font-semibold text-xs uppercase tracking-wider">
          AI Weather Intelligence
        </h3>
      </div>

      {/* Content */}
      <div className="space-y-4 text-sm">
        <div
          className={`flex items-center gap-2 p-3 rounded-xl border text-xs font-medium ${insight.statusColor}`}
        >
          {insight.icon}
          <span>System Status: {insight.status}</span>
        </div>

        <div className="space-y-1">
          <p className="text-[11px] uppercase tracking-wider text-slate-500 font-bold flex items-center gap-1">
            <IoTrendingUpOutline className="text-xs" />
            Core Analysis
          </p>

          <p className="text-slate-300 text-xs leading-relaxed bg-slate-900/30 p-3 rounded-xl border border-slate-800/40">
            {insight.assessment}
          </p>
        </div>

        <div className="p-3.5 bg-slate-900/60 rounded-xl border border-slate-800/60 space-y-1">
          <h4 className="text-xs font-semibold text-slate-200">
            Identified Risks
          </h4>

          <p className="text-xs text-slate-400 leading-normal">
            {insight.risk}
          </p>
        </div>

        <div className="p-3.5 bg-slate-900/60 rounded-xl border border-slate-800/60 space-y-1">
          <h4 className="text-xs font-semibold text-slate-200">
            Recommended Actions
          </h4>

          <p className="text-xs text-slate-400 leading-normal">
            {insight.action}
          </p>
        </div>

        <div className="text-[10px] text-slate-500 text-right font-mono mt-2">
          Matrix Index: TR-{temp}H-{humidity}
        </div>
      </div>
    </div>
  );
}