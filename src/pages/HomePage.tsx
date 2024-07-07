import React, { useState } from "react";
import { ChakraProvider, Box, VStack, Flex, Button } from "@chakra-ui/react";

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

  const addWidget = (newWidget: WidgetConfig) => {
    console.log(newWidget);
    const widgetConfig: WidgetConfig = {
      ...newWidget,
    };
    setWidgets((prevWidgets: WidgetConfig[]) => [...prevWidgets, widgetConfig]);
  };

  const resetWidgetState = () => setWidgets([]);

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
  };

  return (
    <ChakraProvider>
      <Box p={4}>
        <Flex direction="row" justifyContent="flex-end" wrap="wrap" gap={5}>
          <BackgroundSelector editMode={editMode} />

          {editMode && (
            <>
              <ColorModeButton />
              <WidgetManager onAddWidget={addWidget} />
              <Button onClick={resetWidgetState} rightIcon={<FaTimesCircle />}>
                Reset Widgets
              </Button>
            </>
          )}
          <EditModeToggleButton editMode={editMode} setEditMode={setEditMode} />
        </Flex>
        <VStack align="stretch">
          <GridLayout
            editMode={editMode}
            widgets={widgets}
            setWidgets={setWidgets}
            onDeleteWidget={handleDeleteWidget}
            renderWidget={(item: WidgetConfig) => {
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
                  {...item.props}
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
