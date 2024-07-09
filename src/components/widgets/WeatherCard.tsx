import React, { useCallback, useEffect } from "react";
import {
  Box,
  Text,
  VStack,
  Input,
  Button,
  Spinner,
  IconButton,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import { SettingsIcon } from "@chakra-ui/icons";
import withWidgetBase from "../hooks/withWidgetBase";
import { WidgetProps } from "../../interfaces/widget";

interface WeatherData {
  temperature: number;
  description: string;
  humidity: number;
  windSpeed: number;
}

interface WeatherConfig {
  city: string;
  weather: WeatherData | null;
  loading: boolean;
  error: string;
  showSettings: boolean;
  apiKey: string;
}

const defaultConfig: WeatherConfig = {
  city: "",
  weather: null,
  loading: false,
  error: "",
  showSettings: false,
  apiKey: "YOUR_OPENWEATHERMAP_API_KEY",
};

const WeatherContent: React.FC<WidgetProps<WeatherConfig>> = ({
  config,
  onConfigChange,
}) => {
  const bgColor = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  return (
    <Box
      bg={bgColor}
      borderColor={borderColor}
      borderWidth={1}
      borderRadius="md"
      p={4}
      position="relative"
    >
      <IconButton
        aria-label="Impostazioni"
        icon={<SettingsIcon />}
        size="sm"
        position="absolute"
        top={2}
        right={2}
        onClick={() => onConfigChange({ showSettings: !config.showSettings })}
      />
      <VStack align="start" spacing={4}>
        <Text fontSize="xl" fontWeight="bold">
          Meteo
        </Text>
        {config.loading && <Spinner />}
        {config.error && <Text color="red.500">{config.error}</Text>}
        {config.weather && (
          <VStack align="start" spacing={2}>
            <Text>Città: {config.city}</Text>
            <Text>Temperatura: {config.weather.temperature}°C</Text>
            <Text>Condizioni: {config.weather.description}</Text>
            <Text>Umidità: {config.weather.humidity}%</Text>
            <Text>Velocità del vento: {config.weather.windSpeed} m/s</Text>
          </VStack>
        )}
      </VStack>
    </Box>
  );
};

const WeatherOptions: React.FC<WidgetProps<WeatherConfig>> = ({
  config,
  onConfigChange,
}) => {
  const toast = useToast();

  const fetchWeather = useCallback(
    async (cityName: string) => {
      if (!cityName) return;

      onConfigChange({ loading: true, error: "" });

      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${config.apiKey}&units=metric`
        );

        if (!response.ok) {
          throw new Error("Risposta della rete non valida");
        }

        const data = await response.json();

        onConfigChange({
          weather: {
            temperature: data.main.temp,
            description: data.weather[0].description,
            humidity: data.main.humidity,
            windSpeed: data.wind.speed,
          },
          loading: false,
          showSettings: false,
        });

        toast({
          title: "Meteo aggiornato",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
      } catch (err) {
        onConfigChange({
          error:
            "Impossibile recuperare i dati meteo. Verifica il nome della città.",
          weather: null,
          loading: false,
        });
      }
    },
    [config.apiKey, onConfigChange, toast]
  );

  useEffect(() => {
    if (config.city && !config.weather) {
      fetchWeather(config.city);
    }
  }, [config.city, config.weather, fetchWeather]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchWeather(config.city);
  };

  return (
    <VStack align="start" spacing={4}>
      <form onSubmit={handleSubmit}>
        <VStack>
          <Input
            placeholder="Inserisci una città"
            value={config.city}
            onChange={(e) => onConfigChange({ city: e.target.value })}
          />
          <Button type="submit" isLoading={config.loading}>
            Aggiorna meteo
          </Button>
        </VStack>
      </form>
    </VStack>
  );
};

const WeatherCard = withWidgetBase<WeatherConfig>({
  renderWidget: (props) => <WeatherContent {...props} />,
  renderOptions: (props) => <WeatherOptions {...props} />,
  defaultConfig,
});

export default WeatherCard;
