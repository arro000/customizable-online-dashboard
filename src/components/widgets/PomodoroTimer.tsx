import React, { useCallback, useEffect } from "react";
import {
  Box,
  Text,
  Button,
  VStack,
  HStack,
  CircularProgress,
  CircularProgressLabel,
  useColorModeValue,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Switch,
} from "@chakra-ui/react";
import withWidgetBase from "../hooks/withWidgetBase";
import { WidgetProps } from "../../interfaces/widget";

interface PomodoroTimerConfig {
  workTime: number;
  breakTime: number;
  time: number;
  isActive: boolean;
  isWork: boolean;
  autoStartBreaks: boolean;
  autoStartPomodoros: boolean;
  showProgressBar: boolean;
}

const defaultConfig: PomodoroTimerConfig = {
  workTime: 25,
  breakTime: 5,
  time: 25 * 60,
  isActive: false,
  isWork: true,
  autoStartBreaks: false,
  autoStartPomodoros: false,
  showProgressBar: true,
};

const PomodoroTimerContent: React.FC<WidgetProps<PomodoroTimerConfig>> = ({
  config,
  onConfigChange,
}) => {
  const bgColor = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (config.isActive && config.time > 0) {
      interval = setInterval(() => {
        onConfigChange({ time: config.time - 1 });
      }, 1000);
    } else if (config.time === 0) {
      if (config.isWork) {
        onConfigChange({
          time: config.breakTime * 60,
          isWork: false,
          isActive: config.autoStartBreaks,
        });
      } else {
        onConfigChange({
          time: config.workTime * 60,
          isWork: true,
          isActive: config.autoStartPomodoros,
        });
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [config, onConfigChange]);

  const toggleTimer = useCallback(() => {
    onConfigChange({ isActive: !config.isActive });
  }, [config.isActive, onConfigChange]);

  const resetTimer = useCallback(() => {
    onConfigChange({
      isActive: false,
      time: config.isWork ? config.workTime * 60 : config.breakTime * 60,
    });
  }, [config.isWork, config.workTime, config.breakTime, onConfigChange]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  const progress = config.isWork
    ? ((config.workTime * 60 - config.time) / (config.workTime * 60)) * 100
    : ((config.breakTime * 60 - config.time) / (config.breakTime * 60)) * 100;

  return (
    <VStack spacing={4} align="stretch">
      <Text fontSize="xl" fontWeight="bold">
        Pomodoro Timer
      </Text>
      {config.showProgressBar ? (
        <CircularProgress value={progress} size="120px" thickness="4px">
          <CircularProgressLabel>
            {formatTime(config.time)}
          </CircularProgressLabel>
        </CircularProgress>
      ) : (
        <Text fontSize="3xl" textAlign="center">
          {formatTime(config.time)}
        </Text>
      )}
      <Text textAlign="center">{config.isWork ? "Work" : "Break"}</Text>
      <HStack justify="center">
        <Button onClick={toggleTimer}>
          {config.isActive ? "Pause" : "Start"}
        </Button>
        <Button onClick={resetTimer}>Reset</Button>
      </HStack>
    </VStack>
  );
};

const PomodoroTimerOptions: React.FC<WidgetProps<PomodoroTimerConfig>> = ({
  config,
  onConfigChange,
}) => {
  const handleWorkTimeChange = useCallback(
    (value: number) => {
      onConfigChange({
        workTime: value,
        time: config.isWork ? value * 60 : config.time,
      });
    },
    [config.isWork, config.time, onConfigChange]
  );

  const handleBreakTimeChange = useCallback(
    (value: number) => {
      onConfigChange({
        breakTime: value,
        time: !config.isWork ? value * 60 : config.time,
      });
    },
    [config.isWork, config.time, onConfigChange]
  );

  return (
    <VStack spacing={4} align="stretch">
      <HStack justify="space-between">
        <Text>Work Time (min):</Text>
        <NumberInput
          value={config.workTime}
          onChange={(_, value) => handleWorkTimeChange(value)}
          min={1}
          max={60}
          w="80px"
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </HStack>
      <HStack justify="space-between">
        <Text>Break Time (min):</Text>
        <NumberInput
          value={config.breakTime}
          onChange={(_, value) => handleBreakTimeChange(value)}
          min={1}
          max={30}
          w="80px"
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </HStack>
      <HStack justify="space-between">
        <Text>Auto-start Breaks:</Text>
        <Switch
          isChecked={config.autoStartBreaks}
          onChange={(e) =>
            onConfigChange({ autoStartBreaks: e.target.checked })
          }
        />
      </HStack>
      <HStack justify="space-between">
        <Text>Auto-start Pomodoros:</Text>
        <Switch
          isChecked={config.autoStartPomodoros}
          onChange={(e) =>
            onConfigChange({ autoStartPomodoros: e.target.checked })
          }
        />
      </HStack>
      <HStack justify="space-between">
        <Text>Show Progress Bar:</Text>
        <Switch
          isChecked={config.showProgressBar}
          onChange={(e) =>
            onConfigChange({ showProgressBar: e.target.checked })
          }
        />
      </HStack>
    </VStack>
  );
};

const PomodoroTimer = withWidgetBase<PomodoroTimerConfig>({
  renderWidget: (props) => <PomodoroTimerContent {...props} />,
  renderOptions: (props) => <PomodoroTimerOptions {...props} />,
  defaultConfig,
});

export default PomodoroTimer;
