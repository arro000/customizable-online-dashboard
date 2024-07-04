import React, { useState, useEffect } from "react";
import {
  ChakraProvider,
  useColorMode,
  Button,
  useToast,
  Spacer,
  Box,
  VStack,
  HStack,
  Flex,
} from "@chakra-ui/react";
import ActionButtons from "../components/widgets/ActionButtons";
import { Clock, DynamicBackground } from "../components/widgets";
import MyGridLayout from "../components/layout/GridLayout";
import WidgetManager from "../components/managers/WidgetManager";
import * as Components from "../components/widgets/index";
import GridLayout from "../components/layout/GridLayout";

interface WidgetConfig {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
  isResizable: boolean;
  isDraggable: boolean;
  component: keyof typeof Components;
  props?: Record<string, any>;
}
const App: React.FC = () => {
  const [widgets, setWidgets] = useState<WidgetConfig[]>([]);

  const addWidget = (
    newWidget: Omit<WidgetConfig, "i" | "isResizable" | "isDraggable">
  ) => {
    const widgetConfig: WidgetConfig = {
      ...newWidget,
      i: Date.now().toString(),
      isResizable: true,
      isDraggable: true,
    };
    setWidgets((prevWidgets) => [...prevWidgets, widgetConfig]);
  };
  return (
    <ChakraProvider>
      <DynamicBackground />
      <Box p={4}>
        <VStack spacing={4} align="stretch">
          <HStack justify="space-between">
            <Clock />
          </HStack>
          <WidgetManager onAddWidget={addWidget} />
          <GridLayout
            initialLayout={widgets}
            renderWidget={(item) => {
              const WidgetComponent = (Components as any)[item.component];
              return <WidgetComponent {...item.props} />;
            }}
          />
        </VStack>
      </Box>
    </ChakraProvider>
  );
};

export default App;
