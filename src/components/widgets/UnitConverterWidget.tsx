import React, { useState, useEffect } from "react";
import {
  Box,
  VStack,
  HStack,
  Text,
  Select,
  Input,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useToast,
} from "@chakra-ui/react";
import withWidgetBase from "../hooks/withWidgetBase";
import { WidgetProps } from "../../interfaces/widget";

interface UnitConverterConfig {
  defaultCategory: string;
  defaultFromUnit: string;
  defaultToUnit: string;
  showHistory: boolean;
  maxHistoryItems: number;
}

const defaultConfig: UnitConverterConfig = {
  defaultCategory: "length",
  defaultFromUnit: "meters",
  defaultToUnit: "feet",
  showHistory: true,
  maxHistoryItems: 5,
};

type ConversionHistory = {
  category: string;
  fromUnit: string;
  toUnit: string;
  fromValue: number;
  toValue: number;
  timestamp: Date;
};

const unitCategories = ["length", "weight", "temperature", "time"];

const unitDefinitions = {
  length: {
    meters: 1,
    feet: 3.28084,
    inches: 39.3701,
    kilometers: 0.001,
    miles: 0.000621371,
  },
  weight: {
    kilograms: 1,
    pounds: 2.20462,
    ounces: 35.274,
    grams: 1000,
    tons: 0.001,
  },
  temperature: {
    celsius: (c: number) => c,
    fahrenheit: (c: number) => (c * 9) / 5 + 32,
    kelvin: (c: number) => c + 273.15,
  },
  time: {
    seconds: 1,
    minutes: 1 / 60,
    hours: 1 / 3600,
    days: 1 / 86400,
    weeks: 1 / 604800,
  },
};

const UnitConverterContent: React.FC<WidgetProps<UnitConverterConfig>> = ({
  config: rawConfig,
}) => {
  const config = { ...defaultConfig, ...rawConfig };
  const [category, setCategory] = useState(config.defaultCategory);
  const [fromUnit, setFromUnit] = useState(config.defaultFromUnit);
  const [toUnit, setToUnit] = useState(config.defaultToUnit);
  const [fromValue, setFromValue] = useState<number | string>("");
  const [toValue, setToValue] = useState<number | string>("");
  const [history, setHistory] = useState<ConversionHistory[]>([]);
  const toast = useToast();

  useEffect(() => {
    setFromUnit(
      Object.keys(unitDefinitions[category as keyof typeof unitDefinitions])[0]
    );
    setToUnit(
      Object.keys(unitDefinitions[category as keyof typeof unitDefinitions])[1]
    );
  }, [category]);

  const convertValue = () => {
    if (fromValue === "") {
      toast({
        title: "Errore",
        description: "Inserisci un valore da convertire",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    let result: number;

    if (category === "temperature") {
      const tempConversions = unitDefinitions.temperature as Record<
        string,
        (n: number) => number
      >;
      const toCelsius = (temp: number, unit: string) => {
        if (unit === "celsius") return temp;
        if (unit === "fahrenheit") return ((temp - 32) * 5) / 9;
        if (unit === "kelvin") return temp - 273.15;
        return temp;
      };
      const celsiusValue = toCelsius(Number(fromValue), fromUnit);
      result = tempConversions[toUnit](celsiusValue);
    } else {
      const conversionFactor =
        (
          unitDefinitions[category as keyof typeof unitDefinitions] as Record<
            string,
            number
          >
        )[toUnit] /
        (
          unitDefinitions[category as keyof typeof unitDefinitions] as Record<
            string,
            number
          >
        )[fromUnit];
      result = Number(fromValue) * conversionFactor;
    }

    setToValue(result.toFixed(4));

    const newHistoryItem: ConversionHistory = {
      category,
      fromUnit,
      toUnit,
      fromValue: Number(fromValue),
      toValue: result,
      timestamp: new Date(),
    };

    setHistory((prevHistory) => [
      newHistoryItem,
      ...prevHistory.slice(0, config.maxHistoryItems - 1),
    ]);
  };

  return (
    <Box p={4}>
      <VStack spacing={4} align="stretch">
        <Select value={category} onChange={(e) => setCategory(e.target.value)}>
          {unitCategories.map((cat) => (
            <option key={cat} value={cat}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </option>
          ))}
        </Select>
        <HStack>
          <Select
            value={fromUnit}
            onChange={(e) => setFromUnit(e.target.value)}
          >
            {Object.keys(
              unitDefinitions[category as keyof typeof unitDefinitions]
            ).map((unit) => (
              <option key={unit} value={unit}>
                {unit}
              </option>
            ))}
          </Select>
          <Input
            type="number"
            value={fromValue}
            onChange={(e) => setFromValue(e.target.value)}
            placeholder="Valore da convertire"
          />
        </HStack>
        <HStack>
          <Select value={toUnit} onChange={(e) => setToUnit(e.target.value)}>
            {Object.keys(
              unitDefinitions[category as keyof typeof unitDefinitions]
            ).map((unit) => (
              <option key={unit} value={unit}>
                {unit}
              </option>
            ))}
          </Select>
          <Input value={toValue} isReadOnly placeholder="Risultato" />
        </HStack>
        <Button onClick={convertValue} colorScheme="blue">
          Converti
        </Button>
        {config.showHistory && history.length > 0 && (
          <Box>
            <Text fontWeight="bold" mb={2}>
              Cronologia Conversioni
            </Text>
            <Table variant="simple" size="sm">
              <Thead>
                <Tr>
                  <Th>Da</Th>
                  <Th>A</Th>
                  <Th>Risultato</Th>
                  <Th>Data</Th>
                </Tr>
              </Thead>
              <Tbody>
                {history.map((item, index) => (
                  <Tr key={index}>
                    <Td>{`${item.fromValue} ${item.fromUnit}`}</Td>
                    <Td>{`${item.toUnit}`}</Td>
                    <Td>{`${item.toValue.toFixed(4)} ${item.toUnit}`}</Td>
                    <Td>{item.timestamp.toLocaleString()}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        )}
      </VStack>
    </Box>
  );
};

const UnitConverterOptions: React.FC<WidgetProps<UnitConverterConfig>> = ({
  config: rawConfig,
  onConfigChange,
}) => {
  const config = { ...defaultConfig, ...rawConfig };

  const handleConfigChange = (newConfig: Partial<UnitConverterConfig>) => {
    onConfigChange({ ...config, ...newConfig });
  };

  return (
    <VStack spacing={4} align="stretch" p={4}>
      <Text fontWeight="bold">Impostazioni Convertitore di Unità</Text>
      <Select
        value={config.defaultCategory}
        onChange={(e) =>
          handleConfigChange({ defaultCategory: e.target.value })
        }
      >
        {unitCategories.map((cat) => (
          <option key={cat} value={cat}>
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </option>
        ))}
      </Select>
      <Select
        value={config.defaultFromUnit}
        onChange={(e) =>
          handleConfigChange({ defaultFromUnit: e.target.value })
        }
      >
        {Object.keys(
          unitDefinitions[
            config.defaultCategory as keyof typeof unitDefinitions
          ]
        ).map((unit) => (
          <option key={unit} value={unit}>
            {unit}
          </option>
        ))}
      </Select>
      <Select
        value={config.defaultToUnit}
        onChange={(e) => handleConfigChange({ defaultToUnit: e.target.value })}
      >
        {Object.keys(
          unitDefinitions[
            config.defaultCategory as keyof typeof unitDefinitions
          ]
        ).map((unit) => (
          <option key={unit} value={unit}>
            {unit}
          </option>
        ))}
      </Select>
      <HStack>
        <Text>Mostra Cronologia</Text>
        <input
          type="checkbox"
          checked={config.showHistory}
          onChange={(e) =>
            handleConfigChange({ showHistory: e.target.checked })
          }
        />
      </HStack>
      <HStack>
        <Text>Numero massimo di elementi nella cronologia</Text>
        <Input
          type="number"
          value={config.maxHistoryItems}
          onChange={(e) =>
            handleConfigChange({ maxHistoryItems: parseInt(e.target.value) })
          }
          min={1}
          max={20}
        />
      </HStack>
    </VStack>
  );
};

const UnitConverterWidget = withWidgetBase<UnitConverterConfig>({
  renderWidget: (props) => <UnitConverterContent {...props} />,
  renderOptions: (props) => <UnitConverterOptions {...props} />,
  defaultConfig,
});

export default UnitConverterWidget;
