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
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from "@chakra-ui/react";
import withWidgetBase from "../hooks/withWidgetBase";
import { WidgetProps } from "../../interfaces/widget";
import { useWidgetConfig } from "../../hooks/useWidgetConfig";

interface CalculatorConfig {
  display: string;
  isScientific: boolean;
  precision: number;
}

const defaultConfig: CalculatorConfig = {
  display: "0",
  isScientific: false,
  precision: 2,
};

const CalculatorContent: React.FC<WidgetProps<CalculatorConfig>> = (props) => {
  const [config, updateConfig] = useWidgetConfig(props);

  const bgColor = useColorModeValue("gray.100", "gray.700");
  const buttonColor = useColorModeValue("gray.200", "gray.600");

  const handleClick = (value: string) => {
    updateConfig((prev) => ({
      display: prev.display === "0" ? value : prev.display + value,
    }));
  };

  const handleClear = () => {
    updateConfig({ display: "0" });
  };

  const handleCalculate = () => {
    try {
      const result = eval(config.display);
      updateConfig({ display: Number(result).toFixed(config.precision) });
    } catch (error) {
      updateConfig({ display: "Error" });
    }
  };

  const handleScientific = (func: string) => {
    try {
      const result = eval(`Math.${func}(${config.display})`);
      updateConfig({ display: Number(result).toFixed(config.precision) });
    } catch (error) {
      updateConfig({ display: "Error" });
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

  return (
    <Box p={4} bg={bgColor} borderRadius="md" height="100%" width="100%">
      <VStack spacing={4} height="100%">
        <HStack>
          <Text>Simple</Text>
          <Switch
            isChecked={config.isScientific}
            onChange={(e) => updateConfig({ isScientific: e.target.checked })}
          />
          <Text>Scientific</Text>
        </HStack>
        <Input
          value={config.display}
          readOnly
          textAlign="right"
          fontSize="2xl"
          mb={4}
        />
        <Grid templateColumns="repeat(4, 1fr)" gap={2} flex={1}>
          {buttons.map((btn, index) => (
            <Button key={index} onClick={btn.action} bg={buttonColor} size="lg">
              {btn.label}
            </Button>
          ))}
        </Grid>
        {config.isScientific && (
          <Grid templateColumns="repeat(4, 1fr)" gap={2} mt={2}>
            {scientificButtons.map((btn, index) => (
              <Button
                key={index}
                onClick={btn.action}
                bg={buttonColor}
                size="lg"
              >
                {btn.label}
              </Button>
            ))}
          </Grid>
        )}
        <Button onClick={handleClear} colorScheme="red" width="100%">
          Clear
        </Button>
      </VStack>
    </Box>
  );
};

const CalculatorOptions: React.FC<WidgetProps<CalculatorConfig>> = (props) => {
  const [config, updateConfig] = useWidgetConfig(props);

  return (
    <VStack spacing={4} align="stretch">
      <HStack justify="space-between">
        <Text>Scientific Mode:</Text>
        <Switch
          isChecked={config.isScientific}
          onChange={(e) => updateConfig({ isScientific: e.target.checked })}
        />
      </HStack>
      <HStack justify="space-between">
        <Text>Precision:</Text>
        <NumberInput
          value={config.precision}
          onChange={(_, value) => updateConfig({ precision: value })}
          min={0}
          max={10}
          step={1}
          w="100px"
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

const Calculator = withWidgetBase({
  renderWidget: (props) => <CalculatorContent {...props} />,
  renderOptions: (props) => <CalculatorOptions {...props} />,
  defaultConfig,
});

export default Calculator;
