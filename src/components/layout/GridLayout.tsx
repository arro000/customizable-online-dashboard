// components/GridLayout.tsx
import React, { useState } from "react";
import InternalGridLayout, { Layout } from "react-grid-layout";
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
  initialLayout: GridItem[];
  renderWidget: (item: GridItem) => React.ReactNode;
}

const GridLayout: React.FC<GridLayoutProps> = ({
  initialLayout,
  renderWidget,
}) => {
  const [layout, setLayout] = useState<GridItem[]>(initialLayout);

  const onLayoutChange = (newLayout: Layout[]): void => {
    setLayout(
      newLayout.map((item, index) => ({
        ...item,
        ...layout[index],
      }))
    );
  };
  console.log(layout);

  return (
    <Box>
      <InternalGridLayout
        layout={layout}
        onLayoutChange={onLayoutChange}
        rowHeight={10}
        cols={100}
        isResizable={true}
        isDraggable={true}
      >
        {layout.map((item) => (
          <Box key={item.i} bg="gray.200" p={4}>
            {renderWidget(item)}
          </Box>
        ))}
      </InternalGridLayout>
    </Box>
  );
};

export default GridLayout;
