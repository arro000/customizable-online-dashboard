import React, { useState, useEffect } from "react";
import {
  Box,
  Text,
  VStack,
  HStack,
  Select,
  Switch,
  Input,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Radio,
  RadioGroup,
} from "@chakra-ui/react";
import withWidgetBase from "../hooks/withWidgetBase";
import { WidgetProps } from "../../interfaces/widget";

interface ClockConfig {
  showSeconds: boolean;
  showDate: boolean;
  use24HourFormat: boolean;
  timeZone: string;
  textColor: string;
  fontSize: number;
  dateFormat: string;
  clockType: "digital" | "analog";
  backgroundColor: string;
  transparency: number;
}

const defaultConfig: ClockConfig = {
  showSeconds: true,
  showDate: true,
  use24HourFormat: false,
  timeZone: "UTC",
  textColor: "#FFFFFF",
  fontSize: 48,
  dateFormat: "en-US",
  clockType: "digital",
  backgroundColor: "#000000",
  transparency: 0,
};

const ClockContent: React.FC<WidgetProps<ClockConfig>> = ({
  config: rawConfig,
}) => {
  const config = { ...defaultConfig, ...rawConfig };
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      hour: "numeric",
      minute: "numeric",
      second: config.showSeconds ? "numeric" : undefined,
      hour12: !config.use24HourFormat,
      timeZone: config.timeZone,
    };
    return date.toLocaleTimeString(config.dateFormat, options);
  };

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: config.timeZone,
    };
    return date.toLocaleDateString(config.dateFormat, options);
  };

  const renderDigitalClock = () => (
    <VStack
      spacing={2}
      align="center"
      justify="center"
      height="100%"
      width="100%"
    >
      <Text
        fontSize={`${config.fontSize}px`}
        fontWeight="bold"
        color={config.textColor}
        textAlign="center"
      >
        {formatTime(time)}
      </Text>
      {config.showDate && (
        <Text
          fontSize={`${config.fontSize / 3}px`}
          color={config.textColor}
          textAlign="center"
        >
          {formatDate(time)}
        </Text>
      )}
    </VStack>
  );

  const renderAnalogClock = () => {
    const seconds = time.getSeconds();
    const minutes = time.getMinutes();
    const hours = time.getHours() % 12;

    return (
      <Box position="relative" width="100%" height="100%">
        <svg viewBox="0 0 100 100" width="100%" height="100%">
          {/* Clock face */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke={config.textColor}
            strokeWidth="2"
          />

          {/* Hour marks */}
          {[...Array(12)].map((_, i) => (
            <line
              key={i}
              x1="50"
              y1="10"
              x2="50"
              y2="15"
              transform={`rotate(${i * 30} 50 50)`}
              stroke={config.textColor}
              strokeWidth="2"
            />
          ))}

          {/* Hour hand */}
          <line
            x1="50"
            y1="50"
            x2="50"
            y2="25"
            transform={`rotate(${(hours + minutes / 60) * 30} 50 50)`}
            stroke={config.textColor}
            strokeWidth="3"
          />

          {/* Minute hand */}
          <line
            x1="50"
            y1="50"
            x2="50"
            y2="15"
            transform={`rotate(${minutes * 6} 50 50)`}
            stroke={config.textColor}
            strokeWidth="2"
          />

          {/* Second hand */}
          {config.showSeconds && (
            <line
              x1="50"
              y1="50"
              x2="50"
              y2="10"
              transform={`rotate(${seconds * 6} 50 50)`}
              stroke={config.textColor}
              strokeWidth="1"
            />
          )}
        </svg>
        {config.showDate && (
          <Text
            position="absolute"
            bottom="10%"
            left="50%"
            transform="translateX(-50%)"
            fontSize={`${config.fontSize / 4}px`}
            color={config.textColor}
            textAlign="center"
          >
            {formatDate(time)}
          </Text>
        )}
      </Box>
    );
  };

  return (
    <Box height="100%" width="100%">
      {config.clockType === "digital"
        ? renderDigitalClock()
        : renderAnalogClock()}
    </Box>
  );
};

const ClockOptions: React.FC<WidgetProps<ClockConfig>> = ({
  config: rawConfig,
  onConfigChange,
}) => {
  const config = { ...defaultConfig, ...rawConfig };

  const timeZones = [
    "UTC",
    "America/New_York",
    "America/Los_Angeles",
    "Europe/London",
    "Europe/Paris",
    "Asia/Tokyo",
    "Australia/Sydney",
  ];

  const dateFormats = [
    "en-US",
    "en-GB",
    "de-DE",
    "fr-FR",
    "it-IT",
    "es-ES",
    "ja-JP",
    "zh-CN",
  ];

  const handleConfigChange = (newConfig: Partial<ClockConfig>) => {
    onConfigChange({ ...config, ...newConfig });
  };

  return (
    <VStack spacing={4} align="stretch" p={4}>
      <RadioGroup
        value={config.clockType}
        onChange={(value) =>
          handleConfigChange({ clockType: value as "digital" | "analog" })
        }
      >
        <HStack>
          <Radio value="digital">Digital</Radio>
          <Radio value="analog">Analog</Radio>
        </HStack>
      </RadioGroup>
      <HStack justify="space-between">
        <Text>Show Seconds:</Text>
        <Switch
          isChecked={config.showSeconds}
          onChange={(e) =>
            handleConfigChange({ showSeconds: e.target.checked })
          }
        />
      </HStack>
      <HStack justify="space-between">
        <Text>Show Date:</Text>
        <Switch
          isChecked={config.showDate}
          onChange={(e) => handleConfigChange({ showDate: e.target.checked })}
        />
      </HStack>
      <HStack justify="space-between">
        <Text>24-Hour Format:</Text>
        <Switch
          isChecked={config.use24HourFormat}
          onChange={(e) =>
            handleConfigChange({ use24HourFormat: e.target.checked })
          }
        />
      </HStack>
      <HStack justify="space-between">
        <Text>Time Zone:</Text>
        <Select
          value={config.timeZone}
          onChange={(e) => handleConfigChange({ timeZone: e.target.value })}
          width="150px"
        >
          {timeZones.map((tz) => (
            <option key={tz} value={tz}>
              {tz}
            </option>
          ))}
        </Select>
      </HStack>
      <HStack justify="space-between">
        <Text>Date Format:</Text>
        <Select
          value={config.dateFormat}
          onChange={(e) => handleConfigChange({ dateFormat: e.target.value })}
          width="150px"
        >
          {dateFormats.map((format) => (
            <option key={format} value={format}>
              {format}
            </option>
          ))}
        </Select>
      </HStack>
      <HStack justify="space-between">
        <Text>Text Color:</Text>
        <Input
          type="color"
          value={config.textColor}
          onChange={(e) => handleConfigChange({ textColor: e.target.value })}
          width="50px"
          height="30px"
          padding={0}
          border="none"
        />
      </HStack>
      <HStack justify="space-between">
        <Text>Background Color:</Text>
        <Input
          type="color"
          value={config.backgroundColor}
          onChange={(e) =>
            handleConfigChange({ backgroundColor: e.target.value })
          }
          width="50px"
          height="30px"
          padding={0}
          border="none"
        />
      </HStack>
      <HStack justify="space-between">
        <Text>Transparency:</Text>
        <NumberInput
          value={config.transparency}
          onChange={(_, value) => handleConfigChange({ transparency: value })}
          min={0}
          max={100}
          step={1}
          width="100px"
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </HStack>
      <HStack justify="space-between">
        <Text>Font Size:</Text>
        <NumberInput
          value={config.fontSize}
          onChange={(_, value) => handleConfigChange({ fontSize: value })}
          min={12}
          max={100}
          step={1}
          width="100px"
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </HStack>
    </VStack>
  );
};

const Clock = withWidgetBase<ClockConfig>({
  renderWidget: (props) => <ClockContent {...props} />,
  renderOptions: (props) => <ClockOptions {...props} />,
  defaultConfig,
  widgetStyleConfig: { bg: "#ffffff00", borderColor: "none" },
});

export default Clock;
