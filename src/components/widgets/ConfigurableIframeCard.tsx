import React, { useState } from "react";
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

const IframeContent: React.FC<WidgetProps<IframeConfig>> = ({
  config: rawConfig,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const config = rawConfig ?? defaultConfig;

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
        title="Embedded content from external website"
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
        onLoad={() => setIsLoading(false)}
      />
      {isLoading && (
        <Box
          position="absolute"
          top="0"
          left="0"
          right="0"
          bottom="0"
          bg="gray.100"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Text>Loading...</Text>
        </Box>
      )}
    </Box>
  );
};

const IframeOptions: React.FC<WidgetProps<IframeConfig>> = ({
  config: rawConfig,
  onConfigChange,
}) => {
  const config = rawConfig ?? defaultConfig;

  const toggleSandboxOption = (option: string) => {
    onConfigChange({
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
        onChange={(e) => onConfigChange({ url: e.target.value })}
      />
      <HStack>
        <Switch
          isChecked={config.allowFullscreen}
          onChange={(e) =>
            onConfigChange({ allowFullscreen: e.target.checked })
          }
        />
        <Text>Permetti Fullscreen</Text>
      </HStack>
      <HStack>
        <Switch
          isChecked={config.allowPaymentRequest}
          onChange={(e) =>
            onConfigChange({ allowPaymentRequest: e.target.checked })
          }
        />
        <Text>Permetti Richieste di Pagamento</Text>
      </HStack>
      <HStack>
        <Text>Caricamento:</Text>
        <Button
          size="sm"
          colorScheme={config.loading === "eager" ? "blue" : "gray"}
          onClick={() => onConfigChange({ loading: "eager" })}
        >
          Eager
        </Button>
        <Button
          size="sm"
          colorScheme={config.loading === "lazy" ? "blue" : "gray"}
          onClick={() => onConfigChange({ loading: "lazy" })}
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
      {config.sandbox.length === 0 && (
        <Text color="red.500">
          Warning: No sandbox options selected. This may be a security risk.
        </Text>
      )}
      <Button onClick={() => onConfigChange(defaultConfig)} colorScheme="red">
        Reimposta Configurazione
      </Button>
      <Button size="sm" onClick={() => window.open(config.url, "_blank")}>
        Open in New Tab
      </Button>
      <Text fontSize="sm" color="gray.500" mt={2}>
        Note: The default URL (example.com) is for illustrative purposes only.
      </Text>
    </VStack>
  );
};

const ConfigurableIframeCard = withWidgetBase<IframeConfig>({
  renderWidget: (props) => <IframeContent {...props} />,
  renderOptions: (props) => <IframeOptions {...props} />,
  defaultConfig,
});

export default ConfigurableIframeCard;
