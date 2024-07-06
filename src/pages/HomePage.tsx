import React, { useState, useEffect } from "react";
import {
  ChakraProvider,
  Box,
  VStack,
  HStack,
  Flex,
  Button,
} from "@chakra-ui/react";
import { Clock, DynamicBackground } from "../components/widgets";
import WidgetManager from "../components/managers/WidgetManager";
import * as Components from "../components/widgets/index";
import GridLayout from "../components/layout/GridLayout";
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
  const [editMode, setEditMode] = useState(false);

  const addWidget = (
    newWidget: Omit<WidgetConfig, "i" | "isResizable" | "isDraggable">
  ) => {
    const widgetConfig: WidgetConfig = {
      ...newWidget,
      i: Date.now().toString(),
    };
    setWidgets((prevWidgets: WidgetConfig[]) => [...prevWidgets, widgetConfig]);
  };
  const resetWidgetState = () => setWidgets([]);
  const cleanLocalStorage = (widgetId: string) => {
    console.log(Object.keys(localStorage));
    const keysToRemove = Object.keys(localStorage).filter((key) =>
      key.includes(`_${widgetId}_`)
    );
    keysToRemove.forEach((key) => localStorage.removeItem(key));
  };

  const handleDeleteWidget = (widgetId: string) => {
    console.log(widgetId);
    setWidgets((prevWidgets: WidgetConfig[]) => {
      return prevWidgets.filter((widget) => widget.id !== widgetId);
    });
    cleanLocalStorage(widgetId);
  };

  return (
    <ChakraProvider>
      <Box p={4}>
        <Flex direction="row" justifyContent="flex-end" gap={5}>
          <BackgroundSelector editMode={editMode} />

          {editMode && (
            <>
              <ColorModeButton />
              <WidgetManager onAddWidget={addWidget} />
              <Button
                onClick={resetWidgetState}
                rightIcon={<FaTimesCircle> </FaTimesCircle>}
              >
                Reset Widgets
              </Button>
            </>
          )}
          <EditModeToggleButton
            editMode={editMode}
            setEditMode={setEditMode}
          ></EditModeToggleButton>
        </Flex>
        <VStack spacing={4} align="stretch">
          <Flex justifyContent="center">
            <Clock />
          </Flex>

          <GridLayout
            editMode={editMode}
            widgets={widgets}
            setWidgets={setWidgets}
            onDeleteWidget={handleDeleteWidget}
            renderWidget={(item: WidgetConfig) => {
              const WidgetComponent = (Components as any)[item.component];
              return (
                <WidgetComponent
                  {...{ ...item.props, editMode, id: item.id }}
                />
              );
            }}
          />
        </VStack>
      </Box>
    </ChakraProvider>
  );
};

export default App;
