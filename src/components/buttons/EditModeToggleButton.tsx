import { SettingsIcon } from "@chakra-ui/icons";
import { IconButton, useColorModeValue } from "@chakra-ui/react";
import { motion, Variants } from "framer-motion";
import React from "react";

// Creiamo un componente motion personalizzato basato su IconButton di Chakra UI
const MotionIconButton = motion(IconButton);

// Definiamo le varianti per le nostre animazioni
const buttonVariants: Variants = {
  idle: {
    scale: 1,
    rotate: 0,
    boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.1)",
  },
  hover: {
    scale: 1.1,
    rotate: 15,
    boxShadow: "0px 0px 15px rgba(0, 0, 0, 0.2)",
  },
  editMode: {
    scale: 1.2,
    rotate: 360,
    boxShadow: "0px 0px 20px rgba(255, 105, 180, 0.6)",
  },
};

interface EditModeToggleButtonProps {
  editMode: boolean;
  setEditMode: (editMode: boolean) => void;
}

export const EditModeToggleButton: React.FC<EditModeToggleButtonProps> = ({
  editMode,
  setEditMode,
}) => {
  const bgColor = useColorModeValue("white", "gray.700");

  return (
    <MotionIconButton
      position="absolute"
      height="60px"
      width="60px"
      bottom="10"
      right="10"
      fontSize="30px"
      icon={<SettingsIcon />}
      onClick={() => setEditMode(!editMode)}
      aria-label="Modalità modifica"
      borderRadius="full"
      bg={bgColor}
      variants={buttonVariants}
      initial="idle"
      animate={editMode ? "editMode" : "idle"}
      whileHover="hover"
      whileTap={{ scale: 1.3 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 15,
      }}
    />
  );
};
