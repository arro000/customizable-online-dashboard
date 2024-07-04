import React, { useState, useEffect } from 'react';
import {
  Box,
  Text,
  Button,
  VStack,
  useColorModeValue,
  Spinner,
} from '@chakra-ui/react';

interface Quote {
  text: string;
  author: string;
}

const QuoteGenerator: React.FC = () => {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const fetchQuote = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('https://api.quotable.io/random');
      const data = await response.json();
      setQuote({ text: data.content, author: data.author });
    } catch (error) {
      console.error('Error fetching quote:', error);
      setQuote({ text: 'Failed to fetch quote', author: 'Error' });
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchQuote();
  }, []);

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
          Quote of the Day
        </Text>
        {isLoading ? (
          <Spinner />
        ) : (
          <>
            <Text fontSize="md" fontStyle="italic">
              "{quote?.text}"
            </Text>
            <Text fontSize="sm" textAlign="right">
              - {quote?.author}
            </Text>
          </>
        )}
        <Button onClick={fetchQuote} isLoading={isLoading}>
          New Quote
        </Button>
      </VStack>
    </Box>
  );
};

export default QuoteGenerator;