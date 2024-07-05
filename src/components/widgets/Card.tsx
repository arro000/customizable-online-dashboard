import React, { useState, useEffect } from "react";
import {
  Text,
  Image,
  Input,
  Button,
  VStack,
  HStack,
  Box,
  useColorModeValue,
} from "@chakra-ui/react";
import { motion, MotionProps } from "framer-motion";
import styled from "@emotion/styled";
import WidgetBase from "../WidgetBase";
export interface CardData {
  id: string;
  title: string;
  url: string;
  favicon: string;
}

interface CardProps {
  id: string;
  title: string;
  url: string;
  favicon: string;
  onDragStart: () => void;
  onDragEnd: (id: string) => void;
  index: number;
  isEditMode: boolean;
  onUpdate: (id: string, newData: { title: string; url: string }) => void;
}

const MotionCard = styled(motion.div)<{ isEditMode: boolean }>`
  width: 100%;
  height: 140px;

  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: box-shadow 0.3s ease;

  &:hover {
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
  }

  cursor: ${(props) => (props.isEditMode ? "grab" : "pointer")};
`;

const CardContent = styled.div`
  padding: 16px;
  height: 100%;
  display: flex;
  color: black;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Card: React.FC<CardProps> = ({
  id,
  title,
  url,
  favicon,
  onDragStart,
  onDragEnd,
  index,
  isEditMode,
  onUpdate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(title);
  const [editUrl, setEditUrl] = useState(url);

  useEffect(() => {
    setEditTitle(title);
    setEditUrl(url);
  }, [title, url]);

  const handleSave = () => {
    onUpdate(id, { title: editTitle, url: editUrl });
    setIsEditing(false);
  };

  const handleClick = () => {
    if (!isEditMode && !isEditing) {
      window.open(url, "_blank");
    }
  };

  const motionProps: MotionProps = {
    drag: isEditMode,
    dragConstraints: { left: 0, right: 0, top: 0, bottom: 0 },
    dragElastic: 1,
    dragMomentum: false,
    whileDrag: { scale: 1.05, zIndex: 1 },
    onDragStart: onDragStart,
    onDragEnd: () => onDragEnd(id),
    layout: true,
    transition: {
      type: "spring",
      stiffness: 600,
      damping: 30,
    },
  };
  const bgColor = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  return (
    <WidgetBase>
      <Box
        borderWidth="1px"
        borderRadius="lg"
        p={4}
        width="300px"
        position="relative"
        bg={bgColor}
        borderColor={borderColor}
      >
        <CardContent>
          {isEditing ? (
            <VStack spacing={2} width="100%">
              <Input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="Titolo"
              />
              <Input
                value={editUrl}
                onChange={(e) => setEditUrl(e.target.value)}
                placeholder="URL"
              />
              <HStack>
                <Button size="sm" onClick={handleSave}>
                  Salva
                </Button>
                <Button size="sm" onClick={() => setIsEditing(false)}>
                  Annulla
                </Button>
              </HStack>
            </VStack>
          ) : (
            <VStack spacing={2} align="center" justify="center" height="100%">
              {favicon && <Image src={favicon} alt="Favicon" boxSize="24px" />}
              <Text fontWeight="bold" textAlign="center">
                {title}
              </Text>
              {isEditMode && (
                <Button size="sm" onClick={() => setIsEditing(true)}>
                  Modifica
                </Button>
              )}
            </VStack>
          )}
        </CardContent>
      </Box>
    </WidgetBase>
  );
};

export default Card;
