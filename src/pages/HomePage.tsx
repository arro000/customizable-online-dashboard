import React, { useState, useEffect } from "react";
import { ChakraProvider, Box, VStack, HStack, Flex } from "@chakra-ui/react";
import { Clock, DynamicBackground } from "../components/widgets";
import WidgetManager from "../components/managers/WidgetManager";
import * as Components from "../components/widgets/index";
import GridLayout from "../components/layout/GridLayout";
import { useLocalStorage } from "../lib/useLocalStorage";
import ColorModeButton from "../components/buttons/ColorModeButton";

interface WidgetConfig {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
  isResizable: boolean;
  isDraggable: boolean;
  resizeHandles: string[];
  component: keyof typeof Components;
  props?: Record<string, any>;
}

const App: React.FC = () => {
  const [widgets, setWidgets, exportWidgets, importWidgets] = useLocalStorage<
    WidgetConfig[]
  >("widgets", [], "app");
  const [counter, setCounter] = useState(0);

  const addWidget = (
    newWidget: Omit<WidgetConfig, "i" | "isResizable" | "isDraggable">
  ) => {
    setCounter(counter + 1);
    const widgetConfig: WidgetConfig = {
      ...newWidget,
      i: Date.now().toString(),
      isResizable: true,
      isDraggable: true,
      resizeHandles: ["s", "w", "e", "n", "sw", "nw", "se", "ne"],
    };
    setWidgets((prevWidgets) => [...prevWidgets, widgetConfig]);
  };

  return (
    <ChakraProvider>
      <DynamicBackground />
      <Box p={4}>
        <Flex direction="row" justifyContent="flex-end" gap={5}>
          <ColorModeButton />
          <WidgetManager onAddWidget={addWidget} />
        </Flex>
        <VStack spacing={4} align="stretch">
          <Flex justifyContent="center">
            <Clock />
          </Flex>

          <GridLayout
            widgets={widgets}
            setWidgets={setWidgets}
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
