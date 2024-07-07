import React, { useState } from "react";
import InternalGridLayout, { Layout, DropCallback } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { Box, IconButton, Flex, Button } from "@chakra-ui/react";
import {
  DeleteIcon,
  DragHandleIcon,
  ExternalLinkIcon,
  ArrowRightIcon,
  ArrowDownIcon,
  LockIcon,
  UnlockIcon,
} from "@chakra-ui/icons";
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
  const [fullscreenWidget, setFullscreenWidget] = useState<string | null>(null);

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

  const toggleFullscreen = (id: string) => {
    setFullscreenWidget(fullscreenWidget === id ? null : id);
  };

  const expandHorizontally = (id: string) => {
    setWidgets((prevWidgets) =>
      prevWidgets.map((widget) =>
        widget.i === id ? { ...widget, w: widget.w * 2 } : widget
      )
    );
  };

  const expandVertically = (id: string) => {
    setWidgets((prevWidgets) =>
      prevWidgets.map((widget) =>
        widget.i === id ? { ...widget, h: widget.h * 2 } : widget
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
        draggableHandle=".react-grid-drag-handle"
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
            style={
              fullscreenWidget === item.i
                ? {
                    position: "absolute",
                    height: "100vh",
                    width: "100vw",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 9999,
                  }
                : {}
            }
          >
            {editMode && (
              <Flex
                alignContent="center"
                alignItems="center"
                justifyContent="space-between"
                p={1}
                color="red.500"
              >
                <Flex>
                  <Flex
                    width="20px"
                    height="20px"
                    mr={1}
                    zIndex={10}
                    className="react-grid-drag-handle"
                  >
                    <DragHandleIcon />
                    <DragHandleIcon />
                    <DragHandleIcon />
                    <DragHandleIcon />
                    <DragHandleIcon />
                    <DragHandleIcon />
                    <DragHandleIcon />
                    <DragHandleIcon />
                    <DragHandleIcon />
                  </Flex>
                </Flex>
                <Flex>
                  <IconButton
                    icon={<ExternalLinkIcon />}
                    aria-label={
                      fullscreenWidget === item.i
                        ? "Reduce"
                        : "Expand to fullscreen"
                    }
                    size="sm"
                    mr={1}
                    onClick={() => toggleFullscreen(item.i)}
                  />
                  <IconButton
                    icon={<ArrowRightIcon />}
                    aria-label="Expand horizontally"
                    size="sm"
                    mr={1}
                    onClick={() => expandHorizontally(item.i)}
                  />
                  <IconButton
                    icon={<ArrowDownIcon />}
                    aria-label="Expand vertically"
                    size="sm"
                    mr={1}
                    onClick={() => expandVertically(item.i)}
                  />
                  <Button
                    zIndex={3}
                    aria-label="Delete widget"
                    size="sm"
                    onClick={() => onDeleteWidget(item.id)}
                  >
                    Delete
                  </Button>
                </Flex>
              </Flex>
            )}

            {renderWidget(item)}
          </Box>
        ))}
      </InternalGridLayout>
    </Box>
  );
};

export default GridLayout;
