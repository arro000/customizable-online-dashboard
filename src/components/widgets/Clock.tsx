import React, { useState, useEffect } from "react";
import { Box, Text, VStack } from "@chakra-ui/react";

const Clock: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <VStack>
      <Text fontSize="6xl" fontWeight="bold" color="white">
        {time.toLocaleTimeString()}
      </Text>
      <Text fontSize="xl" color="white">
        {time.toLocaleDateString()}
      </Text>
    </VStack>
  );
};

export default Clock;
