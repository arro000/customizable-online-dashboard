import React, { useState, useEffect } from 'react';
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
} from '@chakra-ui/react';

const PomodoroTimer: React.FC = () => {
  const [workTime, setWorkTime] = useState(() => {
    const saved = localStorage.getItem('pomodoroWorkTime');
    return saved ? parseInt(saved) : 25;
  });
  const [breakTime, setBreakTime] = useState(() => {
    const saved = localStorage.getItem('pomodoroBreakTime');
    return saved ? parseInt(saved) : 5;
  });
  const [time, setTime] = useState(workTime * 60);
  const [isActive, setIsActive] = useState(false);
  const [isWork, setIsWork] = useState(true);

  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  useEffect(() => {
    localStorage.setItem('pomodoroWorkTime', workTime.toString());
    localStorage.setItem('pomodoroBreakTime', breakTime.toString());
  }, [workTime, breakTime]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && time > 0) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
    } else if (time === 0) {
      if (isWork) {
        setTime(breakTime * 60);
        setIsWork(false);
      } else {
        setTime(workTime * 60);
        setIsWork(true);
      }
      setIsActive(false);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, time, isWork, workTime, breakTime]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTime(isWork ? workTime * 60 : breakTime * 60);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const progress = isWork
    ? ((workTime * 60 - time) / (workTime * 60)) * 100
    : ((breakTime * 60 - time) / (breakTime * 60)) * 100;

  const handleWorkTimeChange = (value: number) => {
    setWorkTime(value);
    if (isWork) {
      setTime(value * 60);
    }
  };

  const handleBreakTimeChange = (value: number) => {
    setBreakTime(value);
    if (!isWork) {
      setTime(value * 60);
    }
  };

  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      p={4}
      width={{ base: '100%', md: '300px' }}
      bg={bgColor}
      borderColor={borderColor}
    >
      <VStack spacing={4} align="stretch">
        <Text fontSize="xl" fontWeight="bold">
          Pomodoro Timer
        </Text>
        <CircularProgress value={progress} size="120px" thickness="4px">
          <CircularProgressLabel>{formatTime(time)}</CircularProgressLabel>
        </CircularProgress>
        <Text textAlign="center">{isWork ? 'Work' : 'Break'}</Text>
        <HStack justify="center">
          <Button onClick={toggleTimer}>{isActive ? 'Pause' : 'Start'}</Button>
          <Button onClick={resetTimer}>Reset</Button>
        </HStack>
        <HStack justify="space-between">
          <Text>Work Time (min):</Text>
          <NumberInput
            value={workTime}
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
            value={breakTime}
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
      </VStack>
    </Box>
  );
};

export default PomodoroTimer;