// components/widgets/PostIt.tsx
import React from "react";
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
} from "@chakra-ui/react";
import withWidgetBase from "../hooks/withWidgetBase";
import { WidgetProps } from "../../interfaces/widget";
import { useWidgetConfig } from "../../hooks/useWidgetConfig";

interface PostItConfig {
  content: string;
  font: string;
  fontSize: number;
  color: string;
  textColor: string;
}

const defaultConfig: PostItConfig = {
  content: "Nuovo Post-It",
  font: "Arial",
  fontSize: 16,
  color: "#FFFF88",
  textColor: "#000000",
};

const PostItContent: React.FC<WidgetProps<PostItConfig>> = (props) => {
  const [config, updateConfig] = useWidgetConfig(props);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateConfig({ content: e.target.value });
  };

  return (
    <Box
      bg={config.color}
      p={4}
      borderRadius="md"
      boxShadow="md"
      height="100%"
      width="100%"
    >
      <Textarea
        value={config.content}
        onChange={handleContentChange}
        fontFamily={config.font}
        fontSize={`${config.fontSize}px`}
        color={config.textColor}
        height="100%"
        border="none"
        resize="none"
        bg="transparent"
        _focus={{ boxShadow: "none" }}
      />
    </Box>
  );
};

const PostItOptions: React.FC<WidgetProps<PostItConfig>> = (props) => {
  const [config, updateConfig] = useWidgetConfig(props);

  const handleFontChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateConfig({ font: e.target.value });
  };

  const handleFontSizeChange = (valueString: string) => {
    updateConfig({ fontSize: parseInt(valueString) });
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateConfig({ color: e.target.value });
  };

  const handleTextColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateConfig({ textColor: e.target.value });
  };

  return (
    <SimpleGrid columns={2} gap={2}>
      <Text width="100px">Font:</Text>
      <Select value={config.font} onChange={handleFontChange}>
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
        onChange={handleFontSizeChange}
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
      <Input type="color" value={config.color} onChange={handleColorChange} />

      <Text width="100px">Text Color:</Text>
      <Input
        type="color"
        value={config.textColor}
        onChange={handleTextColorChange}
      />
    </SimpleGrid>
  );
};

const PostIt = withWidgetBase<PostItConfig>({
  renderWidget: (props) => <PostItContent {...props} />,
  renderOptions: (props) => <PostItOptions {...props} />,
  defaultConfig,
});

export default PostIt;
