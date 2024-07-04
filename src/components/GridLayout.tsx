import React, { useState } from 'react';
import GridLayout, { Layout, Layouts } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import {
  Box,
  Flex,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Select,
  Switch,
  FormControl,
  FormLabel,
} from '@chakra-ui/react';

interface GridItem extends Layout {
  isResizable: boolean;
  isDraggable: boolean;
}

const initialLayout: GridItem[] = [
  { i: '1', x: 0, y: 0, w: 2, h: 2, isResizable: true, isDraggable: true },
  { i: '2', x: 2, y: 0, w: 2, h: 4, isResizable: true, isDraggable: true },
  { i: '3', x: 4, y: 0, w: 2, h: 5, isResizable: true, isDraggable: true },
  { i: '4', x: 6, y: 0, w: 2, h: 3, isResizable: true, isDraggable: true },
  { i: '5', x: 8, y: 0, w: 2, h: 2, isResizable: true, isDraggable: true },
  { i: '6', x: 10, y: 0, w: 2, h: 4, isResizable: true, isDraggable: true },
];

const MyGridLayout: React.FC = () => {
  const [layout, setLayout] = useState<GridItem[]>(initialLayout);
  const [rowHeight, setRowHeight] = useState<number>(30);
  const [cols, setCols] = useState<number>(12);
  const [width, setWidth] = useState<number>(1200);
  const [compactType, setCompactType] = useState<string|undefined>('vertical');
  const [isResizable, setIsResizable] = useState<boolean>(true);
  const [isDraggable, setIsDraggable] = useState<boolean>(true);

  const onLayoutChange = (newLayout: any): void => {
    setLayout(newLayout as any);
  };

  return (
    <Box>
      <Flex direction="column" align="center" mb={4}>
        <FormControl mb={2}>
          <FormLabel>Row Height</FormLabel>
          <NumberInput value={rowHeight} onChange={(_, value) => setRowHeight(value)}>
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </FormControl>

        <FormControl mb={2}>
          <FormLabel>Columns</FormLabel>
          <NumberInput value={cols} onChange={(_, value) => setCols(value)}>
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </FormControl>

        <FormControl mb={2}>
          <FormLabel>Width</FormLabel>
          <NumberInput value={width} onChange={(_, value) => setWidth(value)}>
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </FormControl>

        <FormControl mb={2}>
          <FormLabel>Compact Type</FormLabel>
          <Select value={compactType} onChange={(e) => setCompactType(e.target.value)}>
            <option value="vertical">Vertical</option>
            <option value="horizontal">Horizontal</option>
          </Select>
        </FormControl>

        <FormControl display="flex" alignItems="center" mb={2}>
          <FormLabel htmlFor="isResizable" mb={0} mr={2}>
            Resizable
          </FormLabel>
          <Switch id="isResizable" isChecked={isResizable} onChange={(e) => setIsResizable(e.target.checked)} />
        </FormControl>

        <FormControl display="flex" alignItems="center" mb={2}>
          <FormLabel htmlFor="isDraggable" mb={0} mr={2}>
            Draggable
          </FormLabel>
          <Switch id="isDraggable" isChecked={isDraggable} onChange={(e) => setIsDraggable(e.target.checked)} />
        </FormControl>
      </Flex>

      <GridLayout
        layout={layout}
        onLayoutChange={onLayoutChange}
        rowHeight={rowHeight}
        cols={cols}
        width={width}
        compactType={compactType as any}
        isResizable={isResizable}
        isDraggable={isDraggable}
      >
        {layout.map((item) => (
          <Box key={item.i} bg="gray.200" p={4}>
            {item.i}
          </Box>
        ))}
      </GridLayout>
    </Box>
  );
};

export default MyGridLayout;