import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  Box,
  VStack,
  Textarea,
  Select,
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

interface EmbeddedContentWidgetConfig {
  embedCode: string;
  aspectRatio: string;
  refreshInterval: number;
}

const defaultConfig: EmbeddedContentWidgetConfig = {
  embedCode: "",
  aspectRatio: "16:9",
  refreshInterval: 0,
};

const EmbeddedContentWidgetContent: React.FC<
  WidgetProps<EmbeddedContentWidgetConfig>
> = ({ config, onConfigChange }) => {
  const [key, setKey] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  config = { ...defaultConfig, ...config };

  useEffect(() => {
    if (config.refreshInterval > 0) {
      const interval = setInterval(() => {
        setKey((prevKey) => prevKey + 1);
      }, config.refreshInterval * 1000);
      return () => clearInterval(interval);
    }
  }, [config.refreshInterval]);

  useEffect(() => {
    if (containerRef.current) {
      const container = containerRef.current;
      container.innerHTML = config.embedCode;

      // Extract and load external scripts
      const scripts = container.getElementsByTagName("script");
      Array.from(scripts).forEach((script) => {
        if (script.src) {
          const newScript = document.createElement("script");
          newScript.src = script.src;
          newScript.async = true;
          document.body.appendChild(newScript);
        } else if (script.textContent) {
          const newScript = document.createElement("script");
          newScript.textContent = script.textContent;
          document.body.appendChild(newScript);
        }
        script.parentNode?.removeChild(script);
      });
    }
  }, [config.embedCode, key]);

  const [aspectWidth, aspectHeight] = config.aspectRatio.split(":").map(Number);
  const paddingTop = `${(aspectHeight / aspectWidth) * 100}%`;

  return (
    <Box>
      <Box position="relative" paddingTop={paddingTop}>
        <Box position="absolute" top="0" left="0" right="0" bottom="0">
          <div
            ref={containerRef}
            key={key}
            style={{ width: "100%", height: "100%" }}
          />
        </Box>
      </Box>
    </Box>
  );
};

const EmbeddedContentWidgetOptions: React.FC<
  WidgetProps<EmbeddedContentWidgetConfig>
> = ({ config, onConfigChange }) => {
  const handleEmbedCodeChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onConfigChange({ embedCode: e.target.value });
    },
    [onConfigChange]
  );

  const handleAspectRatioChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      onConfigChange({ aspectRatio: e.target.value });
    },
    [onConfigChange]
  );

  const handleRefreshIntervalChange = useCallback(
    (_: string, value: number) => {
      onConfigChange({ refreshInterval: value });
    },
    [onConfigChange]
  );

  return (
    <Box>
      <VStack spacing={4} align="stretch">
        <Textarea
          value={config.embedCode}
          onChange={handleEmbedCodeChange}
          placeholder="Inserisci il codice HTML per l'embedding"
          minHeight="150px"
        />
        <Select value={config.aspectRatio} onChange={handleAspectRatioChange}>
          <option value="16:9">16:9</option>
          <option value="4:3">4:3</option>
          <option value="1:1">1:1</option>
          <option value="21:9">21:9</option>
        </Select>
        <HStack>
          <Text>Refresh Interval (seconds):</Text>
          <NumberInput
            value={config.refreshInterval}
            min={0}
            max={3600}
            onChange={handleRefreshIntervalChange}
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

const EmbeddedContentWidget = withWidgetBase<EmbeddedContentWidgetConfig>({
  renderWidget: (props) => <EmbeddedContentWidgetContent {...props} />,
  renderOptions: (props) => <EmbeddedContentWidgetOptions {...props} />,
  defaultConfig,
  widgetStyleConfig: { bg: "#ffffff00", borderColor: "none" },
});

export default EmbeddedContentWidget;
