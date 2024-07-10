import React from "react";
import { Box, Flex, IconButton, useToast } from "@chakra-ui/react";
import { motion, Reorder } from "framer-motion";
import { FaTrash, FaExpand, FaGripLines, FaGripLinesVertical, FaTh, FaArrowUp, FaArrowDown, FaFileExport, FaFileImport } from "react-icons/fa";
import { WidgetConfig } from "../../interfaces/widget";
import { useLocalStorage } from "../../lib/useLocalStorage";

interface FlexLayoutProps {
  editMode: boolean;
  widgets: WidgetConfig[];
  setWidgets: React.Dispatch<React.SetStateAction<WidgetConfig[]>>;
  renderWidget: (item: WidgetConfig) => React.ReactNode;
  onDeleteWidget: (id: string) => void;
}

const MotionBox = motion(Box);

const FlexLayout: React.FC<FlexLayoutProps> = ({
  editMode,
  widgets,
  setWidgets,
  renderWidget,
  onDeleteWidget,
}) => {
  const [layout, setLayout] = useLocalStorage("flexLayout", "vertical", "flexLayout");
  const [columns, setColumns] = useLocalStorage("flexColumns", 1, "flexLayout");
  const [fullscreenWidget, setFullscreenWidget] = useLocalStorage("fullscreenWidget", null, "flexLayout");
  const toast = useToast();

  const handleLayoutChange = (newLayout: "vertical" | "horizontal" | "grid") => {
    setLayout(newLayout);
    if (newLayout === "grid") {
      setColumns(2);
    } else {
      setColumns(1);
    }
  };

  const handleColumnChange = (increment: number) => {
    setColumns(Math.max(1, columns + increment));
  };

  const exportSettings = () => {
    const settings = { layout, columns };
    const blob = new Blob([JSON.stringify(settings)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'flex_layout_settings.json';
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Settings exported", status: "success", duration: 2000, isClosable: true });
  };

  const importSettings = (jsonData: string) => {
    try {
      const settings = JSON.parse(jsonData);
      if (settings.layout && settings.columns) {
        setLayout(settings.layout);
        setColumns(settings.columns);
        toast({ title: "Settings imported successfully", status: "success", duration: 2000, isClosable: true });
      } else {
        throw new Error("Invalid settings file");
      }
    } catch (error) {
      console.error("Error importing settings:", error);
      toast({ title: "Error importing settings", status: "error", duration: 2000, isClosable: true });
    }
  };

  const toggleFullscreen = (id: string) => {
    setFullscreenWidget(fullscreenWidget === id ? null : id);
  };

  return (
    <Box>
      {editMode && (
        <Flex justifyContent="center" flexWrap="wrap" gap={2} mb={4}>
          <IconButton aria-label="Vertical layout" icon={<FaGripLines />} onClick={() => handleLayoutChange("vertical")} />
          <IconButton aria-label="Horizontal layout" icon={<FaGripLinesVertical />} onClick={() => handleLayoutChange("horizontal")} />
      {/*    <IconButton aria-label="Grid layout" icon={<FaTh />} onClick={() => handleLayoutChange("grid")} />
          {layout === "grid" && (
            <>
              <IconButton aria-label="Decrease columns" icon={<FaArrowUp />} onClick={() => handleColumnChange(-1)} />
              <Box as="span" alignSelf="center">{columns}</Box>
              <IconButton aria-label="Increase columns" icon={<FaArrowDown />} onClick={() => handleColumnChange(1)} />
            </>
          )}*/}
          <IconButton aria-label="Export settings" icon={<FaFileExport />} onClick={exportSettings} />
          <IconButton 
            aria-label="Import settings" 
            icon={<FaFileImport />} 
            onClick={() => {
              const input = document.createElement('input');
              input.type = 'file';
              input.accept = 'application/json';
              input.onchange = (e) => {
                const file = (e.target as HTMLInputElement).files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (e) => {
                    const content = e.target?.result;
                    if (typeof content === 'string') {
                      importSettings(content);
                    }
                  };
                  reader.readAsText(file);
                }
              };
              input.click();
            }}
          />
        </Flex>
      )}
      <Reorder.Group
        as={Flex}
        gap={2}
        p={3}
        axis={layout === "horizontal" ? "x" : "y"}
        values={widgets}
        onReorder={setWidgets}
        style={{
          listStyleType: "none",
          display: "flex",
          flexDirection: layout === "horizontal" ? "row" : "column",
          flexWrap: layout === "grid" ? "wrap" : "nowrap",
        }}
      >
        {widgets.map((item) => (
          <Reorder.Item 
            key={item.id} 
            value={item} 
            style={{ 
              width: fullscreenWidget === item.id ? "100%" : `calc(${100 / columns}% - ${(columns - 1) * 8 / columns}px)`,
              outline: "none",
              margin: "4px",
            }}
            drag={editMode}
          >
            <MotionBox
              layoutId={item.id}
              style={fullscreenWidget === item.id ? { 
                position: "fixed", 
                top: 0, 
                left: 0, 
                right: 0, 
                bottom: 0, 
                zIndex: 9999,
                width: "100vw",
                height: "100vh",
              } : {}}
            >
              {editMode && (
                <Flex 
                  style={{
                    borderTopLeftRadius: '10px',
                    borderTopRightRadius: '10px'
                  }} 
                  justifyContent="flex-end" 
                  bg="gray.800" 
                  p={1}
                >
                  <IconButton
                    icon={<FaExpand />}
                    aria-label="Toggle fullscreen"
                    size="sm"
                    onClick={() => toggleFullscreen(item.id)}
                  />
                  <IconButton
                    icon={<FaTrash />}
                    aria-label="Delete widget"
                    size="sm"
                    onClick={() => onDeleteWidget(item.id)}
                  />
                </Flex>
              )}
              {renderWidget(item)}
            </MotionBox>
          </Reorder.Item>
        ))}
      </Reorder.Group>
    </Box>
  );
};

export default FlexLayout;