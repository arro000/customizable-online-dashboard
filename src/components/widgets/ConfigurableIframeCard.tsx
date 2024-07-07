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
import withWidgetBase from "../hooks/withWidgetBase";
import { WidgetProps } from "../../interfaces/widget";
import { useWidgetConfig } from "../../hooks/useWidgetConfig";

interface IframeConfig {
  url: string;
  allowFullscreen: boolean;
  allowPaymentRequest: boolean;
  loading: "eager" | "lazy";
  sandbox: string[];
}

const defaultConfig: IframeConfig = {
  url: "https://example.com",
  allowFullscreen: true,
  allowPaymentRequest: false,
  loading: "lazy",
  sandbox: ["allow-scripts", "allow-same-origin"],
};

const IframeContent: React.FC<WidgetProps<IframeConfig>> = (props) => {
  const [config] = useWidgetConfig(props);

  return (
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
        sandbox={config.sandbox?.join(" ")}
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
};

const IframeOptions: React.FC<WidgetProps<IframeConfig>> = (props) => {
  const [config, updateConfig] = useWidgetConfig(props);

  const toggleSandboxOption = (option: string) => {
    updateConfig({
      sandbox: config.sandbox.includes(option)
        ? config.sandbox.filter((item) => item !== option)
        : [...config.sandbox, option],
    });
  };

  return (
    <VStack spacing={4} align="stretch" p={4}>
      <Input
        placeholder="URL dell'iframe"
        value={config.url}
        onChange={(e) => updateConfig({ url: e.target.value })}
      />
      <HStack>
        <Switch
          isChecked={config.allowFullscreen}
          onChange={(e) => updateConfig({ allowFullscreen: e.target.checked })}
        />
        <Text>Permetti Fullscreen</Text>
      </HStack>
      <HStack>
        <Switch
          isChecked={config.allowPaymentRequest}
          onChange={(e) =>
            updateConfig({ allowPaymentRequest: e.target.checked })
          }
        />
        <Text>Permetti Richieste di Pagamento</Text>
      </HStack>
      <HStack>
        <Text>Caricamento:</Text>
        <Button
          size="sm"
          colorScheme={config.loading === "eager" ? "blue" : "gray"}
          onClick={() => updateConfig({ loading: "eager" })}
        >
          Eager
        </Button>
        <Button
          size="sm"
          colorScheme={config.loading === "lazy" ? "blue" : "gray"}
          onClick={() => updateConfig({ loading: "lazy" })}
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
      <Button onClick={() => updateConfig(defaultConfig)} colorScheme="red">
        Reimposta Configurazione
      </Button>
    </VStack>
  );
};

const ConfigurableIframeCard = withWidgetBase<IframeConfig>({
  renderWidget: (props) => <IframeContent {...props} />,
  renderOptions: (props) => <IframeOptions {...props} />,
  defaultConfig,
});

export default ConfigurableIframeCard;
