import React, { useState, useEffect } from "react";
import {
  Box,
  Text,
  VStack,
  Input,
  Button,
  Spinner,
  IconButton,
  useColorModeValue,
} from "@chakra-ui/react";
import { SettingsIcon } from "@chakra-ui/icons";
import WidgetBase from "../WidgetBase";

interface WeatherData {
  temperature: number;
  description: string;
  humidity: number;
  windSpeed: number;
}

const API_KEY = "YOUR_OPENWEATHERMAP_API_KEY";

const WeatherCard: React.FC = () => {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    const savedCity = localStorage.getItem("weatherCity");
    if (savedCity) {
      setCity(savedCity);
      fetchWeather(savedCity);
    }
  }, []);

  const fetchWeather = async (cityName: string) => {
    if (!cityName) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`
      );

      if (!response.ok) {
        throw new Error("Risposta della rete non valida");
      }

      const data = await response.json();

      setWeather({
        temperature: data.main.temp,
        description: data.weather[0].description,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
      });
      localStorage.setItem("weatherCity", cityName);
    } catch (err) {
      setError(
        "Impossibile recuperare i dati meteo. Verifica il nome della città."
      );
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchWeather(city);
    setShowSettings(false);
  };
  const bgColor = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  return (
    <WidgetBase>
      <IconButton
        aria-label="Impostazioni"
        icon={<SettingsIcon />}
        size="sm"
        position="absolute"
        top={2}
        right={2}
        onClick={() => setShowSettings(!showSettings)}
      />
      <VStack align="start" spacing={4}>
        <Text fontSize="xl" fontWeight="bold">
          Meteo
        </Text>
        {showSettings ? (
          <form onSubmit={handleSubmit}>
            <VStack>
              <Input
                placeholder="Inserisci una città"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
              <Button type="submit" isLoading={loading}>
                Aggiorna meteo
              </Button>
            </VStack>
          </form>
        ) : (
          <>
            {loading && <Spinner />}
            {error && <Text color="red.500">{error}</Text>}
            {weather && (
              <VStack align="start" spacing={2}>
                <Text>Città: {city}</Text>
                <Text>Temperatura: {weather.temperature}°C</Text>
                <Text>Condizioni: {weather.description}</Text>
                <Text>Umidità: {weather.humidity}%</Text>
                <Text>Velocità del vento: {weather.windSpeed} m/s</Text>
              </VStack>
            )}
          </>
        )}
      </VStack>
    </WidgetBase>
  );
};

export default WeatherCard;
