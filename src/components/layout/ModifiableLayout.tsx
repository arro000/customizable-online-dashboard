import React, { useState, useEffect } from "react";
import {
  Box,
  VStack,
  HStack,
  Button,
  Select,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  useColorModeValue,
} from "@chakra-ui/react";
import { motion, PanInfo, Reorder } from "framer-motion";
import { v4 as uuidv4 } from "uuid";
import { Resizable } from "re-resizable";

// Importa i tuoi widget qui
import WeatherCard from "../WeatherCard";
import TodoList from "../TodoList";
import QuoteGenerator from "../QuoteGenerator";
import PomodoroTimer from "../PomodoroTimer";
import WidgetSelector from "../WidgetSelector";
// ... altri import

interface WidgetData {
  id: string;
  type: string;
  width: number;
  height: number;
  x: number;
  y: number;
  gridColumn: string;
  gridRow: string;
}

interface LayoutData {
  widgets: WidgetData[];
  type: "float" | "grid";
  gridColumns: number;
  gridRows: number;
}

const widgetComponents: { [key: string]: React.ComponentType } = {
  WeatherCard,
  TodoList,
  QuoteGenerator,
  PomodoroTimer,
  // ... altri widget
};

const ModifiableLayout: React.FC = () => {
  const [layout, setLayout] = useState<LayoutData>({
    widgets: [],
    type: "float",
    gridColumns: 12,
    gridRows: 6,
  });
  const [isEditing, setIsEditing] = useState(false);

  const bgColor = useColorModeValue("gray.100", "gray.700");

  useEffect(() => {
    const savedLayout = localStorage.getItem("dashboardLayout");
    if (savedLayout) {
      setLayout(JSON.parse(savedLayout));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("dashboardLayout", JSON.stringify(layout));
  }, [layout]);

  const addWidget = (type: string) => {
    const newWidget: WidgetData = {
      id: uuidv4(),
      type,
      width: 300,
      height: 200,
      x: 0,
      y: 0,
      gridColumn: "1 / span 3",
      gridRow: "1 / span 2",
    };
    setLayout((prevLayout) => ({
      ...prevLayout,
      widgets: [...prevLayout.widgets, newWidget],
    }));
  };

  const removeWidget = (id: string) => {
    setLayout((prevLayout) => ({
      ...prevLayout,
      widgets: prevLayout.widgets.filter((widget) => widget.id !== id),
    }));
  };

  const updateWidgetSize = (id: string, width: number, height: number) => {
    setLayout((prevLayout) => ({
      ...prevLayout,
      widgets: prevLayout.widgets.map((widget) =>
        widget.id === id ? { ...widget, width, height } : widget
      ),
    }));
  };

  const updateWidgetPosition = (id: string, x: number, y: number) => {
    setLayout((prevLayout) => ({
      ...prevLayout,
      widgets: prevLayout.widgets.map((widget) =>
        widget.id === id ? { ...widget, x, y } : widget
      ),
    }));
  };

  const updateWidgetGrid = (
    id: string,
    gridColumn: string,
    gridRow: string
  ) => {
    setLayout((prevLayout) => ({
      ...prevLayout,
      widgets: prevLayout.widgets.map((widget) =>
        widget.id === id ? { ...widget, gridColumn, gridRow } : widget
      ),
    }));
  };

  const handleLayoutTypeChange = (newType: "float" | "grid") => {
    setLayout((prevLayout) => ({
      ...prevLayout,
      type: newType,
    }));
  };

  const handleGridSizeChange = (
    property: "gridColumns" | "gridRows",
    value: number
  ) => {
    setLayout((prevLayout) => ({
      ...prevLayout,
      [property]: value,
    }));
  };

  const [draggedWidget, setDraggedWidget] = useState<string | null>(null);

  const onDragStart = (id: string) => {
    setDraggedWidget(id);
  };

  const onDragEnd = (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
    id: string
  ) => {
    setDraggedWidget(null);

    if (layout.type === "float") {
      setLayout((prevLayout) => ({
        ...prevLayout,
        widgets: prevLayout.widgets.map((widget) =>
          widget.id === id
            ? {
                ...widget,
                x: widget.x + info.offset.x,
                y: widget.y + info.offset.y,
              }
            : widget
        ),
      }));
    } else if (layout.type === "grid") {
      // Calcola la nuova posizione nella griglia
      const gridItemWidth = 100 / layout.gridColumns;
      const gridItemHeight = 100 / layout.gridRows;

      const newColumn = Math.floor(info.point.x / gridItemWidth) + 1;
      const newRow = Math.floor(info.point.y / gridItemHeight) + 1;

      setLayout((prevLayout) => ({
        ...prevLayout,
        widgets: prevLayout.widgets.map((widget) =>
          widget.id === id
            ? {
                ...widget,
                gridColumn: `${newColumn} / span ${
                  widget.gridColumn.split(" / span ")[1]
                }`,
                gridRow: `${newRow} / span ${
                  widget.gridRow.split(" / span ")[1]
                }`,
              }
            : widget
        ),
      }));
    }
  };

  return (
    <Box p={4}>
      <VStack spacing={4} align="stretch">
        <HStack>
          <Button onClick={() => setIsEditing(!isEditing)}>
            {isEditing ? "Salva Layout" : "Modifica Layout"}
          </Button>
          <Select
            value={layout.type}
            onChange={(e) =>
              handleLayoutTypeChange(e.target.value as "float" | "grid")
            }
            isDisabled={!isEditing}
          >
            <option value="float">Layout Flottante</option>
            <option value="grid">Layout a Griglia</option>
          </Select>
          {layout.type === "grid" && (
            <>
              <NumberInput
                value={layout.gridColumns}
                onChange={(_, value) =>
                  handleGridSizeChange("gridColumns", value)
                }
                min={1}
                max={12}
                isDisabled={!isEditing}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              <NumberInput
                value={layout.gridRows}
                onChange={(_, value) => handleGridSizeChange("gridRows", value)}
                min={1}
                max={12}
                isDisabled={!isEditing}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </>
          )}
          <WidgetSelector onAddWidget={addWidget} isDisabled={!isEditing} />
        </HStack>
        <Box
          position="relative"
          width="100%"
          height="calc(100vh - 100px)"
          bg={bgColor}
          p={4}
          borderRadius="md"
          boxShadow="md"
          display={layout.type === "grid" ? "grid" : "block"}
          gridTemplateColumns={
            layout.type === "grid"
              ? `repeat(${layout.gridColumns}, 1fr)`
              : undefined
          }
          gridTemplateRows={
            layout.type === "grid"
              ? `repeat(${layout.gridRows}, 1fr)`
              : undefined
          }
          gap={4}
        >
          {layout.widgets.map((widget) => (
            <motion.div
              key={widget.id}
              drag={isEditing}
              dragMomentum={false}
              dragElastic={0}
              onDragStart={() => onDragStart(widget.id)}
              onDragEnd={(event, info) => onDragEnd(event, info, widget.id)}
              dragConstraints={
                layout.type === "grid"
                  ? { left: 0, top: 0, right: 0, bottom: 0 }
                  : undefined
              }
              style={{
                position: layout.type === "float" ? "absolute" : "relative",
                left: layout.type === "float" ? widget.x : undefined,
                top: layout.type === "float" ? widget.y : undefined,
                gridColumn:
                  layout.type === "grid" ? widget.gridColumn : undefined,
                gridRow: layout.type === "grid" ? widget.gridRow : undefined,
                width: widget.width,
                height: widget.height,
                zIndex: draggedWidget === widget.id ? 1000 : "auto",
              }}
            >
              <Resizable
                key={widget.id}
                size={{ width: widget.width, height: widget.height }}
                onResizeStop={(e, direction, ref, d) => {
                  updateWidgetSize(
                    widget.id,
                    widget.width + d.width,
                    widget.height + d.height
                  );
                }}
                enable={
                  isEditing
                    ? { top: true, right: true, bottom: true, left: true }
                    : false
                }
                style={{
                  position: layout.type === "float" ? "absolute" : "relative",
                  left: layout.type === "float" ? widget.x : undefined,
                  top: layout.type === "float" ? widget.y : undefined,
                  gridColumn:
                    layout.type === "grid" ? widget.gridColumn : undefined,
                  gridRow: layout.type === "grid" ? widget.gridRow : undefined,
                }}
              >
                <motion.div
                  layout
                  drag={isEditing && layout.type === "float"}
                  dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                  onDragEnd={(_, info) => {
                    if (layout.type === "float") {
                      updateWidgetPosition(
                        widget.id,
                        widget.x + info.offset.x,
                        widget.y + info.offset.y
                      );
                    }
                  }}
                  style={{ width: "100%", height: "100%" }}
                >
                  <Box
                    p={4}
                    borderRadius="md"
                    boxShadow="md"
                    position="relative"
                    width="100%"
                    height="100%"
                  >
                    {isEditing && (
                      <Button
                        position="absolute"
                        top={2}
                        right={2}
                        size="sm"
                        onClick={() => removeWidget(widget.id)}
                      >
                        Rimuovi
                      </Button>
                    )}
                    {React.createElement(widgetComponents[widget.type])}
                    {isEditing && layout.type === "grid" && (
                      <HStack position="absolute" bottom={2} left={2}>
                        <Select
                          size="xs"
                          value={widget.gridColumn.split(" / span ")[1]}
                          onChange={(e) =>
                            updateWidgetGrid(
                              widget.id,
                              `auto / span ${e.target.value}`,
                              widget.gridRow
                            )
                          }
                        >
                          {Array.from(
                            { length: layout.gridColumns },
                            (_, i) => i + 1
                          ).map((span) => (
                            <option key={span} value={span}>
                              Larghezza: {span}
                            </option>
                          ))}
                        </Select>
                        <Select
                          size="xs"
                          value={widget.gridRow.split(" / span ")[1]}
                          onChange={(e) =>
                            updateWidgetGrid(
                              widget.id,
                              widget.gridColumn,
                              `auto / span ${e.target.value}`
                            )
                          }
                        >
                          {Array.from(
                            { length: layout.gridRows },
                            (_, i) => i + 1
                          ).map((span) => (
                            <option key={span} value={span}>
                              Altezza: {span}
                            </option>
                          ))}
                        </Select>
                      </HStack>
                    )}
                  </Box>
                </motion.div>
              </Resizable>
            </motion.div>
          ))}
        </Box>
      </VStack>
    </Box>
  );
};

export default ModifiableLayout;
