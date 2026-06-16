// src/features/weather/ForecastChart.jsx

const ForecastChart = ({ forecast = [] }) => {
  if (!forecast.length) {
    return (
      <div>
        <h2>Macro Forecast Analytics</h2>
        <p>No forecast data available</p>
      </div>
    );
  }

  return (
    <div className="forecast-container">
      <h2>Macro Forecast Analytics</h2>
      <p>Weather forecast overview</p>

      <div
        style={{
          display: "flex",
          gap: "20px",
          marginTop: "20px",
        }}
      >
        {forecast.map((day, index) => (
          <div
            key={day.date}
            style={{
              border: "1px solid #ddd",
              borderRadius: "12px",
              padding: "20px",
              minWidth: "140px",
              textAlign: "center",
            }}
          >
            <h3>Day {index + 1}</h3>

            <p>
              <strong>{day.maxTemp}°C</strong>
            </p>

            <p>Min: {day.minTemp}°C</p>

            <p>{day.condition}</p>

            <small>{day.date}</small>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ForecastChart;