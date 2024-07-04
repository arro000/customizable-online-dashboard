import React, { useState } from 'react';
import {
  Box,
  Button,
  Grid,
  Input,
  VStack,
  useColorModeValue,
  Switch,
  Text,
  HStack,
} from '@chakra-ui/react';

const Calculator: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [isScientific, setIsScientific] = useState(false);
  const bgColor = useColorModeValue('gray.100', 'gray.700');
  const buttonColor = useColorModeValue('gray.200', 'gray.600');

  const handleClick = (value: string) => {
    setDisplay((prev) => {
      if (prev === '0') {
        return value;
      }
      return prev + value;
    });
  };

  const handleClear = () => {
    setDisplay('0');
  };

  const handleCalculate = () => {
    try {
      setDisplay(eval(display).toString());
    } catch (error) {
      setDisplay('Error');
    }
  };

  const handleScientific = (func: string) => {
    try {
      const result = eval(`Math.${func}(${display})`);
      setDisplay(result.toString());
    } catch (error) {
      setDisplay('Error');
    }
  };

  const simpleButtons = [
    '7', '8', '9', '/',
    '4', '5', '6', '*',
    '1', '2', '3', '-',
    '0', '.', '=', '+',
  ];

  const scientificButtons = [
    'sin', 'cos', 'tan', 'log',
    'sqrt', 'pow', 'exp', 'abs',
  ];

  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      p={4}
      width={{ base: '100%', md: isScientific ? '400px' : '300px' }}
      bg={bgColor}
    >
      <VStack spacing={4}>
        <HStack>
          <Text>Simple</Text>
          <Switch 
            isChecked={isScientific}
            onChange={(e) => setIsScientific(e.target.checked)}
          />
          <Text>Scientific</Text>
        </HStack>
        <Input
          value={display}
          readOnly
          textAlign="right"
          fontSize="2xl"
          mb={4}
        />
        <Grid templateColumns={isScientific ? "repeat(5, 1fr)" : "repeat(4, 1fr)"} gap={2}>
          {simpleButtons.map((btn) => (
            <Button
              key={btn}
              onClick={() => btn === '=' ? handleCalculate() : handleClick(btn)}
              bg={buttonColor}
              size="lg"
            >
              {btn}
            </Button>
          ))}
          {isScientific && scientificButtons.map((btn) => (
            <Button
              key={btn}
              onClick={() => handleScientific(btn)}
              bg={buttonColor}
              size="lg"
            >
              {btn}
            </Button>
          ))}
        </Grid>
        <Button onClick={handleClear} colorScheme="red" width="100%">
          Clear
        </Button>
      </VStack>
    </Box>
  );
};

export default Calculator;