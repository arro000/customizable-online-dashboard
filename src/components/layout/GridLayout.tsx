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
    console.log(newLayout);

    setWidgets((prevWidgets) =>
      prevWidgets.map((widget, index) => ({
        ...widget,
        ...newLayout[index],
      }))
    );
  };

  const onDragStop: DropCallback = (layout, item, e) => {
    console.log(layout, item, e);
  };

  const onResizeStop = (layout: Layout[], oldItem: Layout, newItem: Layout) => {
    setWidgets((prevWidgets) =>
      prevWidgets.map((widget) =>
        widget.i === newItem.i ? { ...widget, ...newItem } : widget
      )
    );
  };
  const width = window.innerWidth;
  return (
    <Box>
      <InternalGridLayout
        layout={widgets}
        onLayoutChange={onLayoutChange}
        onResizeStop={onResizeStop}
        onDragStop={onDragStop}
        rowHeight={10}
        width={width}
        cols={100}
        compactType={null}
        isResizable={true}
        isDraggable={true}
        // This turns off rearrangement so items will not be pushed arround.
        preventCollision={true}
        isDroppable={true}
      >
        {widgets.map((item) => (
          <Box key={item.i}>{renderWidget(item)}</Box>
        ))}
      </InternalGridLayout>
    </Box>
  );
};

export default GridLayout;
