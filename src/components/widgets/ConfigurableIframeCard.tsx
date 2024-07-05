import React, { useState, useEffect } from "react";
import {
  Box,
  VStack,
  HStack,
  Text,
  Input,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Switch,
  Button,
  useColorModeValue,
  Collapse,
} from "@chakra-ui/react";
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import WidgetBase from "../WidgetBase";

interface IframeConfig {
  url: string;
  width: number;
  height: number;
  allowFullscreen: boolean;
  allowPaymentRequest: boolean;
  loading: "eager" | "lazy";
  sandbox: string[];
}

const defaultConfig: IframeConfig = {
  url: "https://example.com",
  width: 600,
  height: 400,
  allowFullscreen: true,
  allowPaymentRequest: false,
  loading: "lazy",
  sandbox: ["allow-scripts", "allow-same-origin"],
};

const ConfigurableIframeCard: React.FC = () => {
  const [config, setConfig] = useState<IframeConfig>(defaultConfig);
  const [showConfig, setShowConfig] = useState(false);

  const bgColor = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  useEffect(() => {
    const savedConfig = localStorage.getItem("iframeConfig");
    if (savedConfig) {
      setConfig(JSON.parse(savedConfig));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("iframeConfig", JSON.stringify(config));
  }, [config]);

  const handleConfigChange = (key: keyof IframeConfig, value: any) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  const toggleSandboxOption = (option: string) => {
    setConfig((prev) => ({
      ...prev,
      sandbox: prev.sandbox.includes(option)
        ? prev.sandbox.filter((item) => item !== option)
        : [...prev.sandbox, option],
    }));
  };

  const resetConfig = () => {
    setConfig(defaultConfig);
  };

  return (
    <WidgetBase>
      <VStack spacing={4} align="stretch" p={4}>
        <HStack justifyContent="space-between">
          <Text fontSize="xl" fontWeight="bold">
            Iframe Configurabile
          </Text>
          <Button
            onClick={() => setShowConfig(!showConfig)}
            rightIcon={showConfig ? <ChevronUpIcon /> : <ChevronDownIcon />}
          >
            {showConfig ? "Nascondi" : "Mostra"} Configurazione
          </Button>
        </HStack>

        <Collapse in={showConfig} animateOpacity>
          <VStack
            spacing={4}
            align="stretch"
            borderWidth="1px"
            borderRadius="md"
            p={4}
          >
            <Input
              placeholder="URL dell'iframe"
              value={config.url}
              onChange={(e) => handleConfigChange("url", e.target.value)}
            />
            <HStack>
              <NumberInput
                value={config.width}
                onChange={(_, value) => handleConfigChange("width", value)}
                min={100}
                max={1200}
              >
                <NumberInputField placeholder="Larghezza" />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              <NumberInput
                value={config.height}
                onChange={(_, value) => handleConfigChange("height", value)}
                min={100}
                max={1200}
              >
                <NumberInputField placeholder="Altezza" />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </HStack>
            <HStack>
              <Switch
                isChecked={config.allowFullscreen}
                onChange={(e) =>
                  handleConfigChange("allowFullscreen", e.target.checked)
                }
              />
              <Text>Permetti Fullscreen</Text>
            </HStack>
            <HStack>
              <Switch
                isChecked={config.allowPaymentRequest}
                onChange={(e) =>
                  handleConfigChange("allowPaymentRequest", e.target.checked)
                }
              />
              <Text>Permetti Richieste di Pagamento</Text>
            </HStack>
            <HStack>
              <Text>Caricamento:</Text>
              <Button
                size="sm"
                colorScheme={config.loading === "eager" ? "blue" : "gray"}
                onClick={() => handleConfigChange("loading", "eager")}
              >
                Eager
              </Button>
              <Button
                size="sm"
                colorScheme={config.loading === "lazy" ? "blue" : "gray"}
                onClick={() => handleConfigChange("loading", "lazy")}
              >
                Lazy
              </Button>
            </HStack>
            <Text fontWeight="bold">Opzioni Sandbox:</Text>
            <HStack wrap="wrap">
              {[
                "allow-scripts",
                "allow-same-origin",
                "allow-forms",
                "allow-popups",
              ].map((option) => (
                <Button
                  key={option}
                  size="sm"
                  colorScheme={
                    config.sandbox.includes(option) ? "green" : "gray"
                  }
                  onClick={() => toggleSandboxOption(option)}
                >
                  {option}
                </Button>
              ))}
            </HStack>
            <Button onClick={resetConfig} colorScheme="red">
              Reimposta Configurazione
            </Button>
          </VStack>
        </Collapse>

        <Box borderWidth="1px" borderRadius="md" overflow="hidden">
          <iframe
            src={config.url}
            width={config.width}
            height={config.height}
            allowFullScreen={config.allowFullscreen}
            loading={config.loading}
            sandbox={config.sandbox.join(" ")}
            style={{ border: "none" }}
            {...(config.allowPaymentRequest
              ? { allowPaymentRequest: true }
              : {})}
          />
        </Box>
      </VStack>
    </WidgetBase>
  );
};

export default ConfigurableIframeCard;
