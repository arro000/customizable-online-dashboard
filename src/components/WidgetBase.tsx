import React from "react";
import {
  Box,
  IconButton,
  useMediaQuery,
  Fade,
  useColorModeValue,
} from "@chakra-ui/react";
import { EditIcon, CloseIcon } from "@chakra-ui/icons";
import { useLocalStorage } from "../lib/useLocalStorage";

interface WidgetProps {
  children: React.ReactNode;
  settings?: React.ReactNode;
  widgetId: string;
}

const WidgetBase: React.FC<WidgetProps> = ({
  children,
  settings,
  widgetId,
  ...rest
}) => {
  const [isEditMode, setIsEditMode] = useLocalStorage(
    `widget_edit_mode_${widgetId}`,
    false,
    "widget"
  );
  const [isMobile] = useMediaQuery("(max-width: 768px)");
  const [isHovered, setIsHovered] = React.useState(false);
  console.log(rest.bg);
  const toggleEditMode = () => setIsEditMode(!isEditMode);
  const bgColor = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  return (
    <Box
      borderRadius="lg"
      overflow="hidden"
      width="100%"
      height="100%"
      position="relative"
      bg={bgColor}
      borderColor={borderColor}
      zIndex={1}
      transition="box-shadow 0.2s"
      _hover={{ boxShadow: "lg" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...rest}
    >
      {children}
      <Fade in={isEditMode && settings !== undefined}>
        {isEditMode && settings && (
          <Box
            position="absolute"
            top={0}
            left={0}
            right={0}
            bottom={0}
            bg={bgColor}
            borderColor={borderColor}
            zIndex={3}
            overflow="auto"
            p={4}
            boxShadow="inner"
          >
            {settings}
          </Box>
        )}
      </Fade>
      <Fade in={isMobile || isHovered}>
        <IconButton
          icon={isEditMode ? <CloseIcon /> : <EditIcon />}
          aria-label={isEditMode ? "Close settings" : "Edit widget"}
          onClick={toggleEditMode}
          position="absolute"
          right={2}
          bottom={2}
          size="sm"
          colorScheme={isEditMode ? "red" : "blue"}
          variant="solid"
          borderRadius="full"
          boxShadow="md"
          zIndex={4}
        />
      </Fade>
    </Box>
  );
};

export default WidgetBase;
