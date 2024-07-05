import { Box, useColorModeValue } from "@chakra-ui/react";

interface WidgetProps {
  children: React.ReactNode;
}

const WidgetBase = (props: WidgetProps) => {
  const bgColor = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      p={4}
      width="100%"
      height="100%"
      position="relative"
      bg={bgColor}
      borderColor={borderColor}
    >
      {props.children}
    </Box>
  );
};

export default WidgetBase;
