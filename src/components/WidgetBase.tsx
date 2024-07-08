import { Box, useColorModeValue } from "@chakra-ui/react";
import { ReactNode, createContext } from "react";

interface WidgetProps {
  editMode: boolean;
  settings?: React.ReactNode;
  children: React.ReactNode;
}

interface WidgetComponentProps {
  widget: ReactNode;
  options: ReactNode;
  config: any;
}

const WidgetBase = (props: WidgetProps) => {
  const bgColor = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      overflow="auto"
      width="100%"
      height="100%"
      position="relative"
      zIndex={1}
      bg={bgColor}
      borderColor={borderColor}
    >
      {props.editMode && props.settings ? props.settings : props.children}
    </Box>
  );
};

export default WidgetBase;
