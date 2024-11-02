import { useState, useEffect } from "react";
import React from "react";
import DisplayWeather from "./components/DisplayWeather";
import ReactDOM from "react-dom";
import SearchBar from "./components/SearchBar";
import "./App.css";

const HeaderPortal = () => {
  return ReactDOM.createPortal(
    <h1>Skywise</h1>,
    document.getElementById("header-root")
  );
};

function App() {
  const [city, setCity] = useState(""); // Controls what's typed in the input field
  const [searchQuery, setSearchQuery] = useState(""); // Triggers the API call when search button is clicked
  const [weather, setWeather] = useState(null); // Stores the weather data received from the API
  const [forecast, setForecast] = useState(null); // Stores the forecast data received from the API
  const [error, setError] = useState(null); // Stores any error messages (like "City not found")
  const [loading, setLoading] = useState(false); // Tracks if the API call is in progress
  const [is24HourFormat, setIs24HourFormat] = useState(false); // Controls if the time is displayed in 24-hour format
  const [isCelsius, setIsCelsius] = useState(true); // Controls if the temperature is displayed in Celsius

  // Fetch weather & forecastdata based on user's geolocation when the app loads
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        // Success callback
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            // Fetch weather data
            const locationWeatherResponse = await fetch(
              `http://localhost:3001/api/weather/coordinates?lat=${latitude}&lon=${longitude}`
            );
            // Fetch forecast data
            const locationForecastResponse = await fetch(
              `http://localhost:3001/api/forecast/coordinates?lat=${latitude}&lon=${longitude}`
            );

            const locationWeatherData = await locationWeatherResponse.json();
            const locationForecastData = await locationForecastResponse.json();

            if (locationWeatherResponse.ok) {
              setWeather(locationWeatherData);
              setForecast(locationForecastData);
              setCity(""); // clear input
            } else {
              setError(locationWeatherData.message);
            }
          } catch (err) {
            setError("Failed to fetch weather data");
          }
        },
        // Error callback
        (err) => {
          setError("Please enable location access to see your local weather");
        }
      );
    } else {
      setError("Geolocation is not supported by your browser");
    }
  }, []);

  // Fetch weather & forecast data when user searches for a city (runs when searchQuery changes)
  useEffect(() => {
    if (!searchQuery) return;

    const fetchWeather = async () => {
      try {
        setLoading(true);

        // Fetch weather data
        const searchWeatherResponse = await fetch(
          `http://localhost:3001/api/weather?city=${searchQuery}`
        );

        // Fetch forecast data
        const searchForecastResponse = await fetch(
          `http://localhost:3001/api/forecast?city=${searchQuery}`
        );

        if (!searchWeatherResponse.ok) throw new Error("City not found");

        const searchWeatherData = await searchWeatherResponse.json();
        const searchForecastData = await searchForecastResponse.json();

        setWeather(searchWeatherData);
        setForecast(searchForecastData);
        setError(null);
        setCity(""); // clear input
      } catch (err) {
        setError(err.message);
        setWeather(null);
        setForecast(null);
        setCity("");
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [searchQuery]);

  // Log forecast data to console
  // useEffect(() => {
  //   if (forecast) {
  //     console.log("Forecast data:", forecast);
  //   }
  // }, [forecast]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchQuery(city);
  };

  return (
    <div>
      <HeaderPortal />
      <SearchBar
        city={city}
        setCity={setCity}
        handleSearch={handleSearch}
        is24HourFormat={is24HourFormat}
        setIs24HourFormat={setIs24HourFormat}
        isCelsius={isCelsius}
        setIsCelsius={setIsCelsius}
      />
      <DisplayWeather
        loading={loading}
        error={error}
        weather={weather}
        is24HourFormat={is24HourFormat}
        isCelsius={isCelsius}
      />
    </div>
  );
}

export default App;
