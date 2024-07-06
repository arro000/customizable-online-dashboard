// components/backgrounds/WaveBackground.tsx
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

interface WaveBackgroundProps {
  waveCount?: number;
  speed?: number;
  color?: string;
}

interface OptionsProps {
  props: WaveBackgroundProps;
  setProps: (props: WaveBackgroundProps) => void;
}

const WaveBackground: React.FC<WaveBackgroundProps> & {
  Options: React.FC<OptionsProps>;
} = ({ waveCount = 3, speed = 0.01, color = "#3182CE" }) => {
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

    let time = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = color;

      for (let i = 0; i < waveCount; i++) {
        ctx.beginPath();
        ctx.moveTo(0, canvas.height);

        for (let x = 0; x < canvas.width; x++) {
          const y =
            Math.sin(x * 0.01 + time + i * 0.5) * 20 +
            canvas.height / 2 +
            i * 50;
          ctx.lineTo(x, y);
        }

        ctx.lineTo(canvas.width, canvas.height);
        ctx.fill();
      }

      time += speed;
      requestAnimationFrame(animate);
    };

    animate();

    return () => window.removeEventListener("resize", resize);
  }, [waveCount, speed, color]);

  return (
    <Box position="fixed" top="0" left="0" zIndex="-1">
      <canvas ref={canvasRef} />
    </Box>
  );
};

WaveBackground.Options = ({ props, setProps }) => {
  return (
    <VStack spacing={4} align="stretch">
      <Text>Wave Count: {props.waveCount}</Text>
      <Slider
        value={props.waveCount || 3}
        min={1}
        max={10}
        step={1}
        onChange={(value) => setProps({ ...props, waveCount: value })}
      >
        <SliderTrack>
          <SliderFilledTrack />
        </SliderTrack>
        <SliderThumb />
      </Slider>
      <Text>Speed: {props.speed}</Text>
      <Slider
        value={props.speed || 0.01}
        min={0.001}
        max={0.1}
        step={0.001}
        onChange={(value) => setProps({ ...props, speed: value })}
      >
        <SliderTrack>
          <SliderFilledTrack />
        </SliderTrack>
        <SliderThumb />
      </Slider>
      <Text>Color</Text>
      <input
        type="color"
        value={props.color || "#3182CE"}
        onChange={(e) => setProps({ ...props, color: e.target.value })}
      />
    </VStack>
  );
};

export default WaveBackground;
