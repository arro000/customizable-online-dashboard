// components/widgets/PostIt.tsx
import React, { useCallback } from "react";
import {
  Box,
  Textarea,
  Select,
  Input,
  Text,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  SimpleGrid,
  VStack,
  HStack,
  Button,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import withWidgetBase from "../hooks/withWidgetBase";
import { WidgetProps } from "../../interfaces/widget";

interface PostItConfig {
  content: string;
  font: string;
  fontSize: number;
  color: string;
  textColor: string;
  rotation: number;
  history: string[];
}

const defaultConfig: PostItConfig = {
  content: "Nuovo Post-It",
  font: "Arial",
  fontSize: 16,
  color: "#FFFF88",
  textColor: "#000000",
  rotation: 0,
  history: [],
};

const PostItContent: React.FC<WidgetProps<PostItConfig>> = ({
  config,
  onConfigChange,
}) => {
  const toast = useToast();

  const handleContentChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newContent = e.target.value;
      onConfigChange({ content: newContent });
    },
    [onConfigChange]
  );

  const saveToHistory = useCallback(() => {
    const newHistory = [config.content, ...config.history.slice(0, 9)];
    onConfigChange({ history: newHistory });
    toast({
      title: "Content saved to history",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  }, [config.content, config.history, onConfigChange, toast]);

  if (!config) {
    return <Spinner />;
  }

  return (
    <Box
      bg={config.color}
      p={4}
      borderRadius="md"
      boxShadow="md"
      height="100%"
      width="100%"
      transform={`rotate(${config.rotation}deg)`}
      transition="transform 0.3s ease-in-out"
    >
      <VStack height="100%" spacing={2}>
        <Textarea
          value={config.content}
          onChange={handleContentChange}
          fontFamily={config.font}
          fontSize={`${config.fontSize}px`}
          color={config.textColor}
          height="calc(100% - 40px)"
          border="none"
          resize="none"
          bg="transparent"
          _focus={{ boxShadow: "none" }}
        />
        <HStack width="100%" justifyContent="space-between">
          <Button size="xs" onClick={saveToHistory}>
            Save
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
};

const PostItOptions: React.FC<WidgetProps<PostItConfig>> = ({
  config,
  onConfigChange,
}) => {
  if (!config) {
    return <Spinner />;
  }

  const handleChange = (key: keyof PostItConfig, value: any) => {
    onConfigChange({ [key]: value });
  };

  return (
    <VStack spacing={4} align="stretch">
      <SimpleGrid columns={2} gap={2}>
        <Text width="100px">Font:</Text>
        <Select
          value={config.font}
          onChange={(e) => handleChange("font", e.target.value)}
        >
          <option value="Arial">Arial</option>
          <option value="Helvetica">Helvetica</option>
          <option value="Times New Roman">Times New Roman</option>
          <option value="Courier">Courier</option>
          <option value="Verdana">Verdana</option>
          <option value="Georgia">Georgia</option>
        </Select>

        <Text width="100px">Font Size:</Text>
        <NumberInput
          value={config.fontSize}
          onChange={(_, value) => handleChange("fontSize", value)}
          min={8}
          max={72}
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>

        <Text width="100px">Background:</Text>
        <Input
          type="color"
          value={config.color}
          onChange={(e) => handleChange("color", e.target.value)}
        />

        <Text width="100px">Text Color:</Text>
        <Input
          type="color"
          value={config.textColor}
          onChange={(e) => handleChange("textColor", e.target.value)}
        />

        <Text width="100px">Rotation:</Text>
        <NumberInput
          value={config.rotation}
          onChange={(_, value) => handleChange("rotation", value)}
          min={-45}
          max={45}
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </SimpleGrid>

      <Text fontWeight="bold">History:</Text>
      <VStack align="stretch" maxHeight="200px" overflowY="auto">
        {config.history.map((content, index) => (
          <Button
            key={index}
            onClick={() => handleChange("content", content)}
            size="sm"
          >
            {content.substring(0, 30)}...
          </Button>
        ))}
      </VStack>
    </VStack>
  );
};

const PostIt = withWidgetBase<PostItConfig>({
  renderWidget: (props) => <PostItContent {...props} />,
  renderOptions: (props) => <PostItOptions {...props} />,
  defaultConfig,
});

export default PostIt;
