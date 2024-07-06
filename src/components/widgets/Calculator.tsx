import React from "react";
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
} from "@chakra-ui/react";
import WidgetBase from "../WidgetBase";
import { useLocalStorage } from "../../lib/useLocalStorage";

interface CalculatorProps {
  id: string;
  editMode: boolean;
}

const Calculator: React.FC<CalculatorProps> = ({ id, editMode }) => {
  const [display, setDisplay] = useLocalStorage(
    `calculator_${id}_display`,
    "0"
  );
  const [isScientific, setIsScientific] = useLocalStorage(
    `calculator_${id}_isScientific`,
    false
  );

  const bgColor = useColorModeValue("gray.100", "gray.700");
  const buttonColor = useColorModeValue("gray.200", "gray.600");

  const handleClick = (value: string) => {
    setDisplay((prev) => {
      if (prev === "0") {
        return value;
      }
      return prev + value;
    });
  };

  const handleClear = () => {
    setDisplay("0");
  };

  const handleCalculate = () => {
    try {
      setDisplay(eval(display).toString());
    } catch (error) {
      setDisplay("Error");
    }
  };

  const handleScientific = (func: string) => {
    try {
      const result = eval(`Math.${func}(${display})`);
      setDisplay(result.toString());
    } catch (error) {
      setDisplay("Error");
    }
  };

  const buttons = [
    { label: "7", action: () => handleClick("7") },
    { label: "8", action: () => handleClick("8") },
    { label: "9", action: () => handleClick("9") },
    { label: "/", action: () => handleClick("/") },
    { label: "4", action: () => handleClick("4") },
    { label: "5", action: () => handleClick("5") },
    { label: "6", action: () => handleClick("6") },
    { label: "*", action: () => handleClick("*") },
    { label: "1", action: () => handleClick("1") },
    { label: "2", action: () => handleClick("2") },
    { label: "3", action: () => handleClick("3") },
    { label: "-", action: () => handleClick("-") },
    { label: "0", action: () => handleClick("0") },
    { label: ".", action: () => handleClick(".") },
    { label: "=", action: handleCalculate },
    { label: "+", action: () => handleClick("+") },
  ];

  const scientificButtons = [
    { label: "sin", action: () => handleScientific("sin") },
    { label: "cos", action: () => handleScientific("cos") },
    { label: "tan", action: () => handleScientific("tan") },
    { label: "log", action: () => handleScientific("log") },
    { label: "sqrt", action: () => handleScientific("sqrt") },
    { label: "pow", action: () => handleScientific("pow") },
    { label: "exp", action: () => handleScientific("exp") },
    { label: "abs", action: () => handleScientific("abs") },
  ];

  const content = (
    <VStack spacing={4}>
      <HStack>
        <Text>Simple</Text>
        <Switch
          isChecked={isScientific}
          onChange={(e) => setIsScientific(e.target.checked)}
        />
        <Text>Scientific</Text>
      </HStack>
      <Input value={display} readOnly textAlign="right" fontSize="2xl" mb={4} />
      <Grid templateColumns="repeat(4, 1fr)" gap={2}>
        {buttons.map((btn, index) => (
          <Button key={index} onClick={btn.action} bg={buttonColor} size="lg">
            {btn.label}
          </Button>
        ))}
      </Grid>
      {isScientific && (
        <Grid templateColumns="repeat(4, 1fr)" gap={2} mt={2}>
          {scientificButtons.map((btn, index) => (
            <Button key={index} onClick={btn.action} bg={buttonColor} size="lg">
              {btn.label}
            </Button>
          ))}
        </Grid>
      )}
      <Button onClick={handleClear} colorScheme="red" width="100%">
        Clear
      </Button>
    </VStack>
  );

  // Non ci sono impostazioni specifiche per questo widget
  const settings = null;

  return (
    <WidgetBase editMode={editMode} settings={settings}>
      <Box p={4} bg={bgColor} borderRadius="md">
        {content}
      </Box>
    </WidgetBase>
  );
};

export default Calculator;
