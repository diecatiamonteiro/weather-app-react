import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const WEATHER_API_KEY = process.env.VITE_WEATHER_API_KEY;

app.use(cors());
app.use(express.json());

// Basic test route
app.get("/api/test", (req, res) => {
  res.json({ message: "Server is running" });
});

// For city search
app.get("/api/weather", async (req, res) => {
  const { city } = req.query;
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${WEATHER_API_KEY}`
    );
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching weather data" });
  }
});

// For geolocation
app.get("/api/weather/coordinates", async (req, res) => {
  const { lat, lon } = req.query;
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${WEATHER_API_KEY}`
    );
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching weather data" });
  }
});

// For city forecast
app.get("/api/forecast", async (req, res) => {
  const { city } = req.query;
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${WEATHER_API_KEY}`
    );
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching forecast data" });
  }
});

// For geolocation forecast
app.get("/api/forecast/coordinates", async (req, res) => {
  const { lat, lon } = req.query;
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${WEATHER_API_KEY}`
    );
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching forecast data" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// I need all three endpoints to maintain your current functionality:
// 1. /api/weather (for city search)
// 2. /api/weather/coordinates (for geolocation)
// 3. /api/forecast (for city forecast)
// 4. /api/forecast/coordinates (for geolocation forecast)
