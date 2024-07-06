// components/backgrounds/BubblesBackground.tsx
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

interface BubblesBackgroundProps {
  bubbleCount?: number;
  maxSize?: number;
  speed?: number;
}

interface OptionsProps {
  props: BubblesBackgroundProps;
  setProps: (props: BubblesBackgroundProps) => void;
}

const BubblesBackground: React.FC<BubblesBackgroundProps> & {
  Options: React.FC<OptionsProps>;
} = ({ bubbleCount = 50, maxSize = 50, speed = 1 }) => {
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

    const bubbles = Array.from({ length: bubbleCount }, () => ({
      x: Math.random() * canvas.width,
      y: canvas.height + Math.random() * canvas.height,
      radius: Math.random() * maxSize + 1,
      speed: Math.random() * speed + 0.1,
    }));

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      bubbles.forEach((bubble) => {
        bubble.y -= bubble.speed;

        if (bubble.y + bubble.radius < 0) {
          bubble.y = canvas.height + bubble.radius;
        }

        ctx.beginPath();
        ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
        ctx.fill();
        ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
        ctx.stroke();
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => window.removeEventListener("resize", resize);
  }, [bubbleCount, maxSize, speed]);

  return (
    <Box position="fixed" top="0" left="0" zIndex="-1">
      <canvas ref={canvasRef} />
    </Box>
  );
};

BubblesBackground.Options = ({ props, setProps }) => {
  return (
    <VStack spacing={4} align="stretch">
      <Text>Bubble Count: {props.bubbleCount}</Text>
      <Slider
        value={props.bubbleCount || 50}
        min={10}
        max={200}
        step={10}
        onChange={(value) => setProps({ ...props, bubbleCount: value })}
      >
        <SliderTrack>
          <SliderFilledTrack />
        </SliderTrack>
        <SliderThumb />
      </Slider>
      <Text>Max Size: {props.maxSize}</Text>
      <Slider
        value={props.maxSize || 50}
        min={10}
        max={100}
        step={5}
        onChange={(value) => setProps({ ...props, maxSize: value })}
      >
        <SliderTrack>
          <SliderFilledTrack />
        </SliderTrack>
        <SliderThumb />
      </Slider>
      <Text>Speed: {props.speed}</Text>
      <Slider
        value={props.speed || 1}
        min={0.1}
        max={5}
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

export default BubblesBackground;
