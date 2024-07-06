// components/backgrounds/SolidColorBackground.tsx
import React from "react";
import { Box, Input } from "@chakra-ui/react";

interface SolidColorBackgroundProps {
  color?: string;
}

interface OptionsProps {
  props: SolidColorBackgroundProps;
  setProps: (props: SolidColorBackgroundProps) => void;
}

const SolidColorBackground: React.FC<SolidColorBackgroundProps> & {
  Options: React.FC<OptionsProps>;
} = ({ color = "#ffffff" }) => {
  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      right={0}
      bottom={0}
      bg={color}
      zIndex={-1}
    />
  );
};

SolidColorBackground.Options = ({ props, setProps }) => {
  return (
    <Input
      type="color"
      value={props.color || "#1a1a1a"}
      onChange={(e) => setProps({ ...props, color: e.target.value })}
    />
  );
};

export default SolidColorBackground;
