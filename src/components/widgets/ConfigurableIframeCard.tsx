import React from "react";
import {
  Box,
  VStack,
  HStack,
  Text,
  Input,
  Switch,
  Button,
  useColorModeValue,
} from "@chakra-ui/react";
import WidgetBase from "../WidgetBase";
import { useLocalStorage } from "../../lib/useLocalStorage";

interface IframeConfig {
  url: string;
  allowFullscreen: boolean;
  allowPaymentRequest: boolean;
  loading: "eager" | "lazy";
  sandbox: string[];
}

interface ConfigurableIframeCardProps {
  id: string;
  editMode: boolean;
}

const defaultConfig: IframeConfig = {
  url: "https://example.com",
  allowFullscreen: true,
  allowPaymentRequest: false,
  loading: "lazy",
  sandbox: ["allow-scripts", "allow-same-origin"],
};

const ConfigurableIframeCard: React.FC<ConfigurableIframeCardProps> = ({
  id,
  editMode,
}) => {
  const [config, setConfig] = useLocalStorage<IframeConfig>(
    `iframeConfig_${id}`,
    defaultConfig
  );

  const bgColor = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");

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

  const renderSettings = () => (
    <VStack spacing={4} align="stretch" p={4}>
      <Input
        placeholder="URL dell'iframe"
        value={config.url}
        onChange={(e) => handleConfigChange("url", e.target.value)}
      />
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
            colorScheme={config.sandbox.includes(option) ? "green" : "gray"}
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
  );

  const renderContent = () => (
    <Box
      borderWidth="1px"
      borderRadius="md"
      overflow="hidden"
      w="100%"
      h="100%"
      position="relative"
    >
      <iframe
        src={config.url}
        allowFullScreen={config.allowFullscreen}
        loading={config.loading}
        sandbox={config.sandbox.join(" ")}
        style={{
          border: "none",
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
        {...(config.allowPaymentRequest ? { allowPaymentRequest: true } : {})}
      />
    </Box>
  );

  return (
    <WidgetBase editMode={editMode} settings={renderSettings()}>
      {renderContent()}
    </WidgetBase>
  );
};

export default ConfigurableIframeCard;
