// components/widgets/PostIt.tsx
import React from "react";
import {
  Box,
  Textarea,
  Select,
  Input,
  VStack,
  HStack,
  Text,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  SimpleGrid,
} from "@chakra-ui/react";
import WidgetBase from "../WidgetBase";
import { useLocalStorage } from "../../lib/useLocalStorage";

interface PostItProps {
  id: string;
  editMode: boolean;
}

const PostIt: React.FC<PostItProps> = ({ id, editMode }) => {
  const [content, setContent] = useLocalStorage(
    `postit_${id}_content`,
    "Nuovo Post-It"
  );
  const [font, setFont] = useLocalStorage(`postit_${id}_font`, "Arial");
  const [fontSize, setFontSize] = useLocalStorage(`postit_${id}_fontSize`, 16);
  const [color, setColor] = useLocalStorage(`postit_${id}_color`, "#FFFF88");
  const [textColor, setTextColor] = useLocalStorage(
    `postit_${id}_textColor`,
    "#000000"
  );

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  const handleFontChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFont(e.target.value);
  };

  const handleFontSizeChange = (valueString: string) => {
    setFontSize(parseInt(valueString));
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setColor(e.target.value);
  };

  const handleTextColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTextColor(e.target.value);
  };

  const settings = (
    <SimpleGrid columns={2} gap={2}>
      <Text width="100px">Font:</Text>
      <Select value={font} onChange={handleFontChange}>
        <option value="Arial">Arial</option>
        <option value="Helvetica">Helvetica</option>
        <option value="Times New Roman">Times New Roman</option>
        <option value="Courier">Courier</option>
        <option value="Verdana">Verdana</option>
        <option value="Georgia">Georgia</option>
      </Select>

      <Text width="100px">Font Size:</Text>
      <NumberInput
        value={fontSize}
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
      <Input type="color" value={color} onChange={handleColorChange} />

      <Text width="100px">Text Color:</Text>
      <Input type="color" value={textColor} onChange={handleTextColorChange} />
      <Text width="100px">Content:</Text>
      <Textarea
        value={content}
        onChange={handleContentChange}
        placeholder="Inserisci il contenuto del Post-It"
      />
    </SimpleGrid>
  );

  const postItContent = (
    <Box
      bg={color}
      p={4}
      borderRadius="md"
      boxShadow="md"
      height="100%"
      width="100%"
    >
      <Textarea
        value={content}
        onChange={handleContentChange}
        fontFamily={font}
        fontSize={`${fontSize}px`}
        color={textColor}
        height="100%"
        border="none"
        resize="none"
        bg="transparent"
        _focus={{ boxShadow: "none" }}
      />
    </Box>
  );

  return (
   <>
      {postItContent}
      </>
  );
};
PostIt.Options=settings
export default PostIt;
