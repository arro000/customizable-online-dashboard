import React from "react";
import { Button, useColorMode, useColorModeValue } from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";

const ColorModeButton: React.FC = () => {
  const { toggleColorMode } = useColorMode();
  const SwitchIcon = useColorModeValue(MoonIcon, SunIcon);
  const nextMode = useColorModeValue("dark", "light");

  return (
    <Button
      onClick={toggleColorMode}
      leftIcon={<SwitchIcon />}
      size="md"
      aria-label={`Switch to ${nextMode} mode`}
    >
      {`Switch to ${nextMode} mode`}
    </Button>
  );
};

export default ColorModeButton;
