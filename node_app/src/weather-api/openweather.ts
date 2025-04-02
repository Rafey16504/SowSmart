const express = require("express");
import {Request, Response } from "express";
import axios from "axios";
export const weatherRouter = express.Router();

weatherRouter.post("/get-weather", async (req: Request, res: Response) => {
    const { latitude, longitude } = req.body;
    const API_KEY = "28652a142cb388fc42563c567782db56"

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&exclude=minutely&appid=${API_KEY}&units=metric`
    );
    
    const data = await response.json();
    
    if (response.ok) {
      const currentWeather = {
        temperature: data.current.temp,
        description: data.current.weather[0].description,
        icon: data.current.weather[0].icon,
        humidity: data.current.humidity,
        windSpeed: data.current.wind_speed,
      };

      const dailyForecast = data.daily.map((day: any) => ({
        date: new Date(day.dt * 1000).toLocaleDateString(),
        temp: day.temp.day,
        description: day.weather[0].description,
        icon: day.weather[0].icon,
        sunrise: new Date(day.sunrise * 1000).toLocaleTimeString(),
        sunset: new Date(day.sunset * 1000).toLocaleTimeString(),
      }));

      const alerts = data.alerts || [];

      res.json({ current: currentWeather, weekly: dailyForecast, alerts });
    } else {
      res.status(500).json({ message: "Failed to fetch weather data." });
    }
  } catch (error) {
    console.error("Error fetching weather:", error);
    res.status(500).json({ message: "Failed to fetch weather data." });
  }
  });