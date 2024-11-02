import { useEffect, useState } from "react";
import { SunIcon, MoonIcon } from "./DayNightIcons";
import SunMovement from "./SunMovement";
import "./DisplayWeather.css";

const weatherBackgrounds = {
  Clear: {
    day: "./weather-bg/clear.jpg",
    night: "./weather-bg/clear-night.jpg",
  },
  Clouds: {
    day: "./weather-bg/clouds.jpg",
    night: "./weather-bg/clouds-night.jpg",
  },
  Rain: "./weather-bg/rain.jpg",
  Drizzle: "./weather-bg/drizzle.jpg",
  Thunderstorm: "./weather-bg/thunderstorm.jpg",
  Snow: "./weather-bg/snow.jpg",
  Mist: "./weather-bg/mist.jpg",
  Smoke: "./weather-bg/smoke.jpg",
  Haze: "./weather-bg/haze.jpg",
  Dust: "./weather-bg/dust.jpg",
  Fog: "./weather-bg/fog.jpg",
  Sand: "./weather-bg/sand.jpg",
  Ash: "./weather-bg/ash.jpg",
  Squall: "./weather-bg/squall.jpg",
  Tornado: "./weather-bg/tornado.jpg",
};

export default function DisplayWeather({
  loading,
  error,
  weather,
  is24HourFormat,
  isCelsius,
}) {
  const [isDaytime, setIsDaytime] = useState(true);
  const [currentTime, setCurrentTime] = useState(
    new Date().toLocaleTimeString()
  ); // Initialize with string

  const convertToFahrenheit = (celsius) => Math.round((celsius * 9) / 5 + 32);
  const convertToMPH = (km) => Math.round(km * 0.621371); // miles per hour
  const convertToInches = (mm) => (mm * 0.0393701).toFixed(2); // keep 2 decimal places for inches

  /**
   * Determines whether it's daytime/nighttime at the location specified by the weather data.
   * Date.now() --> current time in ms
   * new Date() --> current date and time as a Date object
   * .getTimezoneOffset() --> difference in minutes between UTC and local time
   * (* 60 * 1000) --> converts difference to ms
   * (+ weather.timezone * 1000) --> adjusts for the timezone */
  useEffect(() => {
    if (!weather) return;

    const isDayTime = () => {
      const currentTime =
        Date.now() +
        new Date().getTimezoneOffset() * 60 * 1000 +
        weather.timezone * 1000;
      const sunrise =
        weather.sys.sunrise * 1000 +
        new Date().getTimezoneOffset() * 60 * 1000 +
        weather.timezone * 1000;
      const sunset =
        weather.sys.sunset * 1000 +
        new Date().getTimezoneOffset() * 60 * 1000 +
        weather.timezone * 1000;

      return currentTime >= sunrise && currentTime <= sunset;
    };

    // Update isDaytime state
    setIsDaytime(isDayTime());

    const weatherCondition = weather.weather[0].main;
    let backgroundUrl;

    if (weatherBackgrounds[weatherCondition]?.day) {
      // If the weather condition has day/night versions
      backgroundUrl = isDayTime()
        ? weatherBackgrounds[weatherCondition].day
        : weatherBackgrounds[weatherCondition].night;
    } else {
      backgroundUrl = weatherBackgrounds[weatherCondition] || "";
    }

    document.body.style.backgroundImage = `url(${backgroundUrl})`;

    // Returns the current local time as a string
    const getLocalTime = () => {
      const utcTime = Date.now() + new Date().getTimezoneOffset() * 60 * 1000;
      return new Date(utcTime + weather.timezone * 1000).toLocaleTimeString(
        "en-US",
        {
          hour: "2-digit",
          minute: "2-digit",
          hour12: !is24HourFormat, // if not 24-hour format, use 12-hour format
        }
      );
    };

    setCurrentTime(getLocalTime());

    const interval = setInterval(() => {
      setCurrentTime(getLocalTime());
      setIsDaytime(isDayTime());
    }, 1000);

    return () => clearInterval(interval);
  }, [weather, is24HourFormat]); // end of useEffect

  return (
    <div className="">
      {loading && <div className="spinner"></div>}
      {error && <p>{error}</p>}
      {weather && (
        <div>
          {/* Location and time info */}
          <div className="location-time-info">
            <h2 className="">
              {weather.name}, {weather.sys.country}
            </h2>
            <p className="local-time text-xl">
              {currentTime} {isDaytime ? <SunIcon /> : <MoonIcon />}
            </p>
          </div>

          {/* Temperature info */}
          <div className="temp-info">
            <div className="temp-value-container">
              <p className="temp-value-number">
                {isCelsius
                  ? `${Math.round(weather.main.temp)}°C`
                  : `${convertToFahrenheit(weather.main.temp)}°F`}
              </p>
              <p className="temp-value-description">
                {weather.weather[0].description}
              </p>
            </div>

            <div className="temp-extra-info-container">
              <p>
                Feels like{" "}
                {isCelsius
                  ? `${Math.round(weather.main.feels_like)}°C`
                  : `${convertToFahrenheit(weather.main.feels_like)}°F`}
              </p>

              <div className="temp-range">
                <p>
                  H:{" "}
                  {isCelsius
                    ? `${Math.round(weather.main.temp_max)}°C`
                    : `${convertToFahrenheit(weather.main.temp_max)}°F`}
                </p>
                <p>
                  L:{" "}
                  {isCelsius
                    ? `${Math.round(weather.main.temp_min)}°C`
                    : `${convertToFahrenheit(weather.main.temp_min)}°F`}
                </p>
              </div>
            </div>

            {/* Random weather info */}
            <div className="random-info">
              <p>
                Wind speed:{" "}
                {isCelsius
                  ? `${Math.round(weather.wind.speed * 3.6)} km/h`
                  : `${convertToMPH(weather.wind.speed)} mph`}
              </p>

              <p>Humidity: {weather.main.humidity}%</p>

              <p>
                Rain volume:{" "}
                {isCelsius
                  ? `${weather.rain ? weather.rain["1h"] : 0} mm`
                  : `${
                      weather.rain ? convertToInches(weather.rain["1h"]) : 0
                    } in`}
              </p>
            </div>
          </div>

          <SunMovement weather={weather} is24HourFormat={is24HourFormat} />
        </div>
      )}
    </div>
  );
}
