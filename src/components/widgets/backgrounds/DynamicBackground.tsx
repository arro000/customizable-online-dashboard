// components/backgrounds/DynamicBackground.tsx
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

interface DynamicBackgroundProps {
  particleCount?: number;
  particleSpeed?: number;
}

interface OptionsProps {
  props: DynamicBackgroundProps;
  setProps: (props: DynamicBackgroundProps) => void;
}

const DynamicBackground: React.FC<DynamicBackgroundProps> & {
  Options: React.FC<OptionsProps>;
} = ({ particleCount = 100, particleSpeed = 2 }) => {
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

    const particles: Array<{
      x: number;
      y: number;
      radius: number;
      color: string;
      vx: number;
      vy: number;
    }> = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 5 + 1,
        color: `hsl(${Math.random() * 360}, 70%, 60%)`,
        vx: (Math.random() - 0.5) * particleSpeed,
        vy: (Math.random() - 0.5) * particleSpeed,
      });
    }

    const animate = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => window.removeEventListener("resize", resize);
  }, [particleCount, particleSpeed]);

  return (
    <Box position="fixed" top="0" left="0" zIndex="-1">
      <canvas ref={canvasRef} />
    </Box>
  );
};

DynamicBackground.Options = ({ props, setProps }) => {
  return (
    <VStack spacing={4} align="stretch">
      <Text>Particle Count: {props.particleCount}</Text>
      <Slider
        value={props.particleCount || 100}
        min={10}
        max={500}
        step={10}
        onChange={(value) => setProps({ ...props, particleCount: value })}
      >
        <SliderTrack>
          <SliderFilledTrack />
        </SliderTrack>
        <SliderThumb />
      </Slider>
      <Text>Particle Speed: {props.particleSpeed}</Text>
      <Slider
        value={props.particleSpeed || 2}
        min={0.5}
        max={5}
        step={0.5}
        onChange={(value) => setProps({ ...props, particleSpeed: value })}
      >
        <SliderTrack>
          <SliderFilledTrack />
        </SliderTrack>
        <SliderThumb />
      </Slider>
    </VStack>
  );
};

export default DynamicBackground;
