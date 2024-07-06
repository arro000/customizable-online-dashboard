// components/backgrounds/GradientBackground.tsx
import React from "react";
import { Box, Input, VStack } from "@chakra-ui/react";

interface GradientBackgroundProps {
  color1?: string;
  color2?: string;
}

interface OptionsProps {
  props: GradientBackgroundProps;
  setProps: (props: GradientBackgroundProps) => void;
}

const GradientBackground: React.FC<GradientBackgroundProps> & {
  Options: React.FC<OptionsProps>;
} = ({ color1 = "#4158D0", color2 = "#C850C0" }) => {
  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      right={0}
      bottom={0}
      bgGradient={`linear(to-r, ${color1}, ${color2})`}
      zIndex={-1}
    />
  );
};

GradientBackground.Options = ({ props, setProps }) => {
  return (
    <VStack spacing={2}>
      <Input
        type="color"
        value={props.color1 || "#4158D0"}
        onChange={(e) => setProps({ ...props, color1: e.target.value })}
      />
      <Input
        type="color"
        value={props.color2 || "#C850C0"}
        onChange={(e) => setProps({ ...props, color2: e.target.value })}
      />
    </VStack>
  );
};

export default GradientBackground;
