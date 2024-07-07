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
} from "@chakra-ui/react";
import withWidgetBase from "../hooks/withWidgetBase";
import { WidgetProps } from "../../interfaces/widget";
import { useWidgetConfig } from "../../hooks/useWidgetConfig";

interface ClockConfig {
  showSeconds: boolean;
  showDate: boolean;
  use24HourFormat: boolean;
  timeZone: string;
  textColor: string;
  fontSize: number;
  dateFormat: string;
}

const defaultConfig: ClockConfig = {
  showSeconds: true,
  showDate: true,
  use24HourFormat: false,
  timeZone: "UTC",
  textColor: "#FFFFFF",
  fontSize: 48,
  dateFormat: "en-US",
};

const ClockContent: React.FC<WidgetProps<ClockConfig>> = (props) => {
  const [config] = useWidgetConfig(props);
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

  return (
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
};

const ClockOptions: React.FC<WidgetProps<ClockConfig>> = (props) => {
  const [config, updateConfig] = useWidgetConfig(props);

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

  return (
    <VStack spacing={4} align="stretch">
      <HStack justify="space-between">
        <Text>Show Seconds:</Text>
        <Switch
          isChecked={config.showSeconds}
          onChange={(e) => updateConfig({ showSeconds: e.target.checked })}
        />
      </HStack>
      <HStack justify="space-between">
        <Text>Show Date:</Text>
        <Switch
          isChecked={config.showDate}
          onChange={(e) => updateConfig({ showDate: e.target.checked })}
        />
      </HStack>
      <HStack justify="space-between">
        <Text>24-Hour Format:</Text>
        <Switch
          isChecked={config.use24HourFormat}
          onChange={(e) => updateConfig({ use24HourFormat: e.target.checked })}
        />
      </HStack>
      <HStack justify="space-between">
        <Text>Time Zone:</Text>
        <Select
          value={config.timeZone}
          onChange={(e) => updateConfig({ timeZone: e.target.value })}
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
          onChange={(e) => updateConfig({ dateFormat: e.target.value })}
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
          onChange={(e) => updateConfig({ textColor: e.target.value })}
          width="50px"
          height="30px"
          padding={0}
          border="none"
        />
      </HStack>
      <HStack justify="space-between">
        <Text>Font Size:</Text>
        <NumberInput
          value={config.fontSize}
          onChange={(_, value) => updateConfig({ fontSize: value })}
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

const Clock = withWidgetBase({
  renderWidget: (props) => <ClockContent {...props} />,
  renderOptions: (props) => <ClockOptions {...props} />,
  defaultConfig,
});

export default Clock;
