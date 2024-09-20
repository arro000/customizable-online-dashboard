import React, { useState } from "react";
import {
  ChakraProvider,
  Box,
  VStack,
  Flex,
  Button,
  Select,
} from "@chakra-ui/react";

import WidgetManager from "../components/managers/WidgetManager";
import * as Components from "../components/widgets/index";
import GridLayout from "../components/layout/GridLayout";
import FlexLayout from "../components/layout/FlexLayout";
import { useLocalStorage } from "../lib/useLocalStorage";
import ColorModeButton from "../components/buttons/ColorModeButton";
import { EditModeToggleButton } from "../components/buttons/EditModeToggleButton";
import { FaTimesCircle } from "react-icons/fa";
import { WidgetConfig } from "../interfaces/widget";
import BackgroundSelector from "../components/managers/BackgroundSelector";

const App: React.FC = () => {
  const [widgets, setWidgets, exportWidgets, importWidgets] = useLocalStorage(
    "widgets",
    [],
    "app"
  );
  const [gridLayoutConfig, setGridLayoutConfig] = useLocalStorage(
    "gridLayoutConfig",
    {},
    "app"
  );
  const [flexLayoutConfig, setFlexLayoutConfig] = useLocalStorage(
    "flexLayoutConfig",
    {},
    "app"
  );
  const [editMode, setEditMode] = useState(false);
  const [layoutType, setLayoutType] = useLocalStorage(
    "layoutType",
    "grid",
    "app"
  );

  const addWidget = (newWidget: WidgetConfig) => {
    const widgetConfig: WidgetConfig = {
      ...newWidget,
    };
    setWidgets((prevWidgets: WidgetConfig[]) => [...prevWidgets, widgetConfig]);
  };

  const resetWidgetState = () => {
    setWidgets([]);
    setGridLayoutConfig({});
    setFlexLayoutConfig({});
  };

  const cleanLocalStorage = (widgetId: string) => {
    const keysToRemove = Object.keys(localStorage).filter((key) =>
      key.includes(`_${widgetId}_`)
    );
    keysToRemove.forEach((key) => localStorage.removeItem(key));
  };

  const handleDeleteWidget = (widgetId: string) => {
    setWidgets((prevWidgets: WidgetConfig[]) =>
      prevWidgets.filter((widget) => widget.id !== widgetId)
    );
    cleanLocalStorage(widgetId);
    setGridLayoutConfig((prev) => {
      const { [widgetId]: _, ...rest } = prev;
      return rest;
    });
    setFlexLayoutConfig((prev) => {
      const { [widgetId]: _, ...rest } = prev;
      return rest;
    });
  };

  const renderWidget = (item: WidgetConfig, draggableHandle?: any) => {
    const WidgetComponent = (Components as any)[item.component];
    if (!WidgetComponent) {
      console.error(`Widget component ${item.component} not found`);
      return null;
    }
    return (
      <WidgetComponent
        key={item.id}
        id={item.id}
        editMode={editMode}
        draggableHandle={draggableHandle}
        {...item.props}
      />
    );
  };

  const handleLayoutChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setLayoutType(event.target.value);
  };

  return (
    <ChakraProvider>
      <Box h="100%">
        <VStack align="stretch">
          {layoutType === "grid" ? (
            <GridLayout
              editMode={editMode}
              widgets={widgets}
              setWidgets={setWidgets}
              onDeleteWidget={handleDeleteWidget}
              renderWidget={renderWidget}
            />
          ) : (
            <FlexLayout
              editMode={editMode}
              widgets={widgets}
              setWidgets={setWidgets}
              onDeleteWidget={handleDeleteWidget}
              renderWidget={renderWidget}
            />
          )}
        </VStack>
      </Box>
      <VStack
        position="fixed"
        direction="column"
        width="200px"
        bottom="10"
        right="10"
        spacing={4}
      >
        <VStack spacing={4} display={editMode ? "flex" : "none"} zIndex={9999}>
          <ColorModeButton />
          <WidgetManager onAddWidget={addWidget} />
          <Button
            onClick={resetWidgetState}
            w="full"
            rightIcon={<FaTimesCircle />}
          >
            Reset Widgets
          </Button>
          <Select value={layoutType} onChange={handleLayoutChange}>
            <option value="grid">Grid Layout</option>
            <option value="flex">Flex Layout</option>
          </Select>
        </VStack>
        <BackgroundSelector editMode={editMode} />
        <Flex justifyContent="flex-end" mt={4} w="full" zIndex={9999}>
          <EditModeToggleButton editMode={editMode} setEditMode={setEditMode} />
        </Flex>
      </VStack>
    </ChakraProvider>
  );
};

export default App;
