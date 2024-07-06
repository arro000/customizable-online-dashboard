// components/backgrounds/StarfieldBackground.tsx
import React, { useEffect, useRef } from "react";
import {
  Box,
  VStack,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Text,
} from "@chakra-ui/react";

interface StarfieldBackgroundProps {
  starCount?: number;
  speed?: number;
}

interface OptionsProps {
  props: StarfieldBackgroundProps;
  setProps: (props: StarfieldBackgroundProps) => void;
}

const StarfieldBackground: React.FC<StarfieldBackgroundProps> & {
  Options: React.FC<OptionsProps>;
} = ({ starCount = 200, speed = 0.5 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", resize);
    resize();

    const stars = Array.from({ length: starCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      z: Math.random() * canvas.width,
    }));

    const animate = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      stars.forEach((star) => {
        star.z -= speed;

        if (star.z <= 0) {
          star.z = canvas.width;
        }

        const x = (star.x - canvas.width / 2) * (canvas.width / star.z);
        const y = (star.y - canvas.height / 2) * (canvas.width / star.z);

        const size = (canvas.width / star.z) * 2;
        const brightness = size > 1 ? 255 : Math.floor(255 * size);

        ctx.fillStyle = `rgb(${brightness},${brightness},${brightness})`;
        ctx.fillRect(x + canvas.width / 2, y + canvas.height / 2, size, size);
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => window.removeEventListener("resize", resize);
  }, [starCount, speed]);

  return (
    <Box position="fixed" top="0" left="0" zIndex="-1">
      <canvas ref={canvasRef} />
    </Box>
  );
};

StarfieldBackground.Options = ({ props, setProps }) => {
  return (
    <VStack spacing={4} align="stretch">
      <Text>Star Count: {props.starCount}</Text>
      <Slider
        value={props.starCount || 200}
        min={50}
        max={1000}
        step={50}
        onChange={(value) => setProps({ ...props, starCount: value })}
      >
        <SliderTrack>
          <SliderFilledTrack />
        </SliderTrack>
        <SliderThumb />
      </Slider>
      <Text>Speed: {props.speed}</Text>
      <Slider
        value={props.speed || 0.5}
        min={0.1}
        max={2}
        step={0.1}
        onChange={(value) => setProps({ ...props, speed: value })}
      >
        <SliderTrack>
          <SliderFilledTrack />
        </SliderTrack>
        <SliderThumb />
      </Slider>
    </VStack>
  );
};

export default StarfieldBackground;
