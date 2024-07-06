import React, { useState } from "react";
import InternalGridLayout, { Layout, DropCallback } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { Box, IconButton, Flex, Button } from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import { color } from "framer-motion";
import { WidgetConfig } from "../../interfaces/widget";

interface GridLayoutProps {
  editMode: boolean;
  widgets: WidgetConfig[];
  setWidgets: React.Dispatch<React.SetStateAction<WidgetConfig[]>>;
  renderWidget: (item: WidgetConfig) => React.ReactNode;
  onDeleteWidget: (id: string) => void;
}

const GridLayout: React.FC<GridLayoutProps> = ({
  editMode,
  widgets,
  setWidgets,
  renderWidget,
  onDeleteWidget,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);

  const onLayoutChange = (newLayout: Layout[]): void => {
    setWidgets((prevWidgets) =>
      prevWidgets.map((widget, index) => ({
        ...widget,
        ...newLayout[index],
      }))
    );
  };

  const onDragStart: DropCallback = () => {
    setIsDragging(true);
  };

  const onDragStop: DropCallback = () => {
    setIsDragging(false);
  };

  const onResizeStart = () => {
    setIsResizing(true);
  };

  const onResizeStop = (layout: Layout[], oldItem: Layout, newItem: Layout) => {
    setIsResizing(false);
    setWidgets((prevWidgets) =>
      prevWidgets.map((widget) =>
        widget.i === newItem.i ? { ...widget, ...newItem } : widget
      )
    );
  };

  const width = window.innerWidth;

  return (
    <Box position="relative">
      <InternalGridLayout
        layout={widgets}
        onLayoutChange={onLayoutChange}
        onDragStart={onDragStart}
        onDragStop={onDragStop}
        onResizeStart={onResizeStart}
        onResizeStop={onResizeStop}
        rowHeight={10}
        width={width}
        cols={100 * (width / 800)}
        compactType={null}
        isResizable={editMode}
        isDraggable={editMode}
        resizeHandles={["s", "w", "e", "n", "sw", "nw", "se", "ne"]}
        preventCollision={true}
        isDroppable={true}
      >
        {widgets.map((item) => (
          <Box
            key={item.i}
            position="relative"
            borderWidth={editMode ? "2px" : "0px"}
            borderStyle={editMode ? "dashed" : "solid"}
            borderColor={editMode ? "blue.500" : "gray.200"}
            borderRadius="lg"
            overflow="hidden"
            p={editMode ? 2 : 0}
            bg={"gray.800"}
            zIndex={1}
          >
            {editMode && (
              <Flex justifyContent="flex-end" p={1} color="red.500">
                <Button
                  zIndex={3}
                  aria-label="Delete widget"
                  size={"sm"}
                  onClick={() => {
                    onDeleteWidget(item.id);
                  }}
                >
                  Delete
                </Button>
              </Flex>
            )}

            {renderWidget(item)}

            {editMode && (isDragging || isResizing) && (
              <Box
                position="absolute"
                top={0}
                left={0}
                right={0}
                bottom={0}
                bg="transparent"
                zIndex={2}
              />
            )}
          </Box>
        ))}
      </InternalGridLayout>
    </Box>
  );
};

export default GridLayout;
