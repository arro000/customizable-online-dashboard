import React, { useCallback, useEffect } from "react";
import {
  Box,
  Text,
  Button,
  VStack,
  useColorModeValue,
  Spinner,
} from "@chakra-ui/react";
import withWidgetBase from "../hooks/withWidgetBase";
import { WidgetProps } from "../../interfaces/widget";

interface QuoteGeneratorConfig {
  quote: {
    text: string;
    author: string;
  } | null;
  isLoading: boolean;
}

const defaultConfig: QuoteGeneratorConfig = {
  quote: null,
  isLoading: false,
};

const QuoteGeneratorContent: React.FC<WidgetProps<QuoteGeneratorConfig>> = ({
  config,
  onConfigChange,
}) => {
  const bgColor = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  const fetchQuote = useCallback(async () => {
    onConfigChange({ isLoading: true });
    try {
      const response = await fetch("https://api.quotable.io/random");
      const data = await response.json();
      onConfigChange({
        quote: { text: data.content, author: data.author },
        isLoading: false,
      });
    } catch (error) {
      console.error("Error fetching quote:", error);
      onConfigChange({
        quote: { text: "Failed to fetch quote", author: "Error" },
        isLoading: false,
      });
    }
  }, [onConfigChange]);

  useEffect(() => {
    if (!config.quote) {
      fetchQuote();
    }
  }, [config.quote, fetchQuote]);

  return (
    <VStack spacing={4} align="stretch">
      <Text fontSize="xl" fontWeight="bold">
        Quote of the Day
      </Text>
      {config.isLoading ? (
        <Spinner />
      ) : (
        <>
          <Text fontSize="md" fontStyle="italic">
            "{config.quote?.text}"
          </Text>
          <Text fontSize="sm" textAlign="right">
            - {config.quote?.author}
          </Text>
        </>
      )}
      <Button onClick={fetchQuote} isLoading={config.isLoading}>
        New Quote
      </Button>
    </VStack>
  );
};

const QuoteGenerator = withWidgetBase<QuoteGeneratorConfig>({
  renderWidget: (props) => <QuoteGeneratorContent {...props} />,
  defaultConfig,
});

export default QuoteGenerator;
