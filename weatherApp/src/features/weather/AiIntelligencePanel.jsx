import React from "react";
import {
  IoSparklesOutline,
  IoShieldCheckmarkOutline,
  IoAlertTriangleOutline,
  IoTrendingUpOutline,
} from "react-icons/io5";

export default function AiIntelligencePanel({ weatherData, isLoading }) {
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
  const condition = weatherData?.current?.description || "Stable conditions";

  // AI Insights Generation Parser
  const generateInsights = () => {
    if (temp > 30) {
      return {
        status: "Thermal Elevation Warning",
        statusColor: "text-amber-400 bg-amber-500/10 border-amber-500/20",
        assessment:
          "Atmospheric telemetry indicates an intense thermal threshold. Cooling load demands will see significant overhead adjustments across regional grids.",
        risk: "High localized heat indexes. Ensure high hydration metrics and avoid heavy exposure.",
        action:
          "Optimize HVAC distribution signatures; mitigate mid-day field activities.",
        icon: <IoAlertTriangleOutline className="text-amber-400" />,
      };
    } else if (humidity > 75) {
      return {
        status: "Moisture Saturation Warning",
        statusColor: "text-sky-400 bg-sky-500/10 border-sky-500/20",
        assessment:
          "Heavy moisture density signatures detected. Dew points are compressing closely to ambient temperature readings, significantly increasing structural cooling loads.",
        risk: "Elevated precipitation probability and reduced evaporation efficiencies.",
        action:
          "Activate moisture control systems and optimize drainage check loops.",
        icon: <IoAlertTriangleOutline className="text-sky-400" />,
      };
    } else {
      return {
        status: "Climatic Equivalence Achieved",
        statusColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
        assessment:
          "Atmospheric pressures, core temperatures, and humidity streams are currently operating within nominal baseline parameters across this operational zone.",
        risk: "No immediate systemic atmospheric risks or anomalies detected.",
        action:
          "Maintain standard baseline activities. Ideal configuration for open-air logistics.",
        icon: <IoShieldCheckmarkOutline className="text-emerald-400" />,
      };
    }
  };

  const insight = generateInsights();

  return (
    <div className="bg-[#161B26] border border-slate-800/80 bg-gradient-to-b from-[#161B26] to-[#121620] rounded-2xl p-6 shadow-md relative overflow-hidden h-full">
      <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/5 blur-3xl rounded-full pointer-events-none" />

      {/* Panel Header */}
      <div className="flex items-center gap-2 mb-5 text-sky-400 border-b border-slate-800/60 pb-3">
        <IoSparklesOutline className="text-lg animate-pulse" />
        <h3 className="font-semibold text-xs uppercase tracking-wider">
          Grok Climate Intelligence
        </h3>
      </div>

      {/* Dynamic Report Body */}
      <div className="space-y-4 text-sm">
        {/* Dynamic Status Pill */}
        <div
          className={`flex items-center gap-2 p-3 rounded-xl border text-xs font-medium ${insight.statusColor}`}
        >
          {insight.icon}
          <span>System Status: {insight.status}</span>
        </div>

        {/* Synthesis Paragraph */}
        <div className="space-y-1">
          <p className="text-[11px] uppercase tracking-wider text-slate-500 font-bold flex items-center gap-1">
            <IoTrendingUpOutline className="text-xs" /> Core Synthesis
          </p>
          <p className="text-slate-300 text-xs leading-relaxed bg-slate-900/30 p-3 rounded-xl border border-slate-800/40">
            {insight.assessment}
          </p>
        </div>

        {/* Environmental Hazards Block */}
        <div className="p-3.5 bg-slate-900/60 rounded-xl border border-slate-800/60 space-y-1">
          <h4 className="text-xs font-semibold text-slate-200">
            Identified Vulnerabilities
          </h4>
          <p className="text-xs text-slate-400 leading-normal">
            {insight.risk}
          </p>
        </div>

        {/* Right Column AI Content Module */}
        <div className="space-y-6">
          <AiIntelligencePanel weatherData={data} isLoading={isLoading} />
        </div>

        {/* Recommended Operations Protocol */}
        <div className="p-3.5 bg-slate-900/60 rounded-xl border border-slate-800/60 space-y-1">
          <h4 className="text-xs font-semibold text-slate-200">
            Recommended Protocols
          </h4>
          <p className="text-xs text-slate-400 leading-normal">
            {insight.action}
          </p>
        </div>

        {/* Live Vector Telemetry Metadata footer */}
        <div className="text-[10px] text-slate-500 text-right font-mono mt-2">
          Matrix Index: TR-{temp}H-{humidity}
        </div>
      </div>
    </div>
  );
}
