import React from "react";
import InternalGridLayout, { Layout, DropCallback } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { Box } from "@chakra-ui/react";

interface GridItem extends Layout {
  isResizable: boolean;
  isDraggable: boolean;
  component: string;
  props?: Record<string, any>;
}

interface GridLayoutProps {
  widgets: GridItem[];
  setWidgets: React.Dispatch<React.SetStateAction<GridItem[]>>;
  renderWidget: (item: GridItem) => React.ReactNode;
}

const GridLayout: React.FC<GridLayoutProps> = ({
  widgets,
  setWidgets,
  renderWidget,
}) => {
  const onLayoutChange = (newLayout: Layout[]): void => {
    setWidgets((prevWidgets) =>
      prevWidgets.map((widget, index) => ({
        ...widget,
        ...newLayout[index],
      }))
    );
  };

  const onDrop: DropCallback = (layout, item, e) => {
    const newWidget: GridItem = {
      ...item,
      i: `n${Date.now()}`,
      component: item.i,
      isResizable: true,
      isDraggable: true,
    };

    setWidgets((prevWidgets) => [...prevWidgets, newWidget]);
  };

  const onResizeStop = (layout: Layout[], oldItem: Layout, newItem: Layout) => {
    setWidgets((prevWidgets) =>
      prevWidgets.map((widget) =>
        widget.i === newItem.i ? { ...widget, ...newItem } : widget
      )
    );
  };

  return (
    <Box>
      <InternalGridLayout
        layout={widgets}
        onLayoutChange={onLayoutChange}
        onResizeStop={onResizeStop}
        onDrop={onDrop}
        rowHeight={10}
        cols={100}
        isResizable={true}
        isDraggable={true}
        isDroppable={true}
      >
        {widgets.map((item) => (
          <Box key={item.i} bg="gray.200" p={4}>
            {renderWidget(item)}
          </Box>
        ))}
      </InternalGridLayout>
    </Box>
  );
};

export default GridLayout;