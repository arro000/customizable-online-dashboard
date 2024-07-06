// components/backgrounds/NetworkBackground.tsx

import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  VStack,
  Slider,
  Text,
  HStack,
  Switch,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from "@chakra-ui/react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

interface NetworkBackgroundProps {
  particleCount?: number;
  connectionDistance?: number;
  particleSpeed?: number;
  interactive?: boolean;
}

interface OptionsProps {
  props: NetworkBackgroundProps;
  setProps: (props: NetworkBackgroundProps) => void;
}

const NetworkBackground: React.FC<NetworkBackgroundProps> & {
  Options: React.FC<OptionsProps>;
} = ({
  particleCount = 100,
  connectionDistance = 150,
  particleSpeed = 1,
  interactive = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    // Initialize particles
    const newParticles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      newParticles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * particleSpeed,
        vy: (Math.random() - 0.5) * particleSpeed,
        radius: Math.random() * 2 + 1,
      });
    }
    setParticles(newParticles);

    const animate = () => {
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particles.forEach((particle, index) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Bounce off edges
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
        ctx.fill();

        // Connect particles
        for (let j = index + 1; j < particles.length; j++) {
          const dx = particles[j].x - particle.x;
          const dy = particles[j].y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionDistance) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(255, 255, 255, ${
              1 - distance / connectionDistance
            })`;
            ctx.stroke();
          }
        }

        // Connect to mouse if interactive
        if (interactive) {
          const dx = mouse.x - particle.x;
          const dy = mouse.y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionDistance) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(255, 255, 255, ${
              1 - distance / connectionDistance
            })`;
            ctx.stroke();
          }
        }
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => window.removeEventListener("resize", resizeCanvas);
  }, [particleCount, connectionDistance, particleSpeed, interactive]);

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!interactive) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    setMouse({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    });
  };

  return (
    <Box
      position="fixed"
      top="0"
      left="0"
      width="100%"
      height="100%"
      zIndex="-1"
      bg="black"
    >
      <canvas
        ref={canvasRef}
        style={{ display: "block" }}
        onMouseMove={handleMouseMove}
      />
    </Box>
  );
};

NetworkBackground.Options = ({ props, setProps }) => {
  return (
    <Box bg="white" p={4} borderRadius="md" boxShadow="md">
      <VStack spacing={6} align="stretch">
        <Box>
          <Text fontWeight="bold" mb={2}>
            Particle Count: {props.particleCount}
          </Text>
          <HStack>
            <Slider
              flex="1"
              value={props.particleCount || 100}
              min={10}
              max={300}
              step={10}
              onChange={(value) => setProps({ ...props, particleCount: value })}
            >
              {/* Slider components */}
            </Slider>
            <NumberInput
              maxW="100px"
              value={props.particleCount}
              min={10}
              max={300}
              step={10}
              onChange={(valueString, valueNumber) =>
                setProps({ ...props, particleCount: valueNumber })
              }
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </HStack>
        </Box>

        <Box>
          <Text fontWeight="bold" mb={2}>
            Connection Distance: {props.connectionDistance}
          </Text>
          <HStack>
            <Slider
              flex="1"
              value={props.connectionDistance || 150}
              min={50}
              max={300}
              step={10}
              onChange={(value) =>
                setProps({ ...props, connectionDistance: value })
              }
            >
              {/* Slider components */}
            </Slider>
            <NumberInput
              maxW="100px"
              value={props.connectionDistance}
              min={50}
              max={300}
              step={10}
              onChange={(valueString, valueNumber) =>
                setProps({ ...props, connectionDistance: valueNumber })
              }
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </HStack>
        </Box>

        <Box>
          <Text fontWeight="bold" mb={2}>
            Particle Speed: {props.particleSpeed}
          </Text>
          <HStack>
            <Slider
              flex="1"
              value={props.particleSpeed || 1}
              min={0.1}
              max={3}
              step={0.1}
              onChange={(value) => setProps({ ...props, particleSpeed: value })}
            >
              {/* Slider components */}
            </Slider>
            <NumberInput
              maxW="100px"
              value={props.particleSpeed}
              min={0.1}
              max={3}
              step={0.1}
              precision={1}
              onChange={(valueString, valueNumber) =>
                setProps({ ...props, particleSpeed: valueNumber })
              }
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </HStack>
        </Box>

        <HStack justify="space-between">
          <Text fontWeight="bold">Interactive</Text>
          <Switch
            isChecked={props.interactive}
            onChange={(e) =>
              setProps({ ...props, interactive: e.target.checked })
            }
          />
        </HStack>
      </VStack>
    </Box>
  );
};

export default NetworkBackground;

NetworkBackground.Options = ({ props, setProps }) => {
  return (
    <Box p={4}>
      <VStack spacing={6} align="stretch">
        <Box>
          <Text fontWeight="bold" mb={2}>
            Particle Count: {props.particleCount}
          </Text>
          <HStack>
            <Slider
              flex="1"
              value={props.particleCount || 100}
              min={10}
              max={300}
              step={10}
              onChange={(value) => setProps({ ...props, particleCount: value })}
            >
              {/* Slider components */}
            </Slider>
            <NumberInput
              maxW="100px"
              value={props.particleCount}
              min={10}
              max={300}
              step={10}
              onChange={(valueString, valueNumber) =>
                setProps({ ...props, particleCount: valueNumber })
              }
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </HStack>
        </Box>

        <Box>
          <Text fontWeight="bold" mb={2}>
            Connection Distance: {props.connectionDistance}
          </Text>
          <HStack>
            <Slider
              flex="1"
              value={props.connectionDistance || 150}
              min={50}
              max={300}
              step={10}
              onChange={(value) =>
                setProps({ ...props, connectionDistance: value })
              }
            >
              {/* Slider components */}
            </Slider>
            <NumberInput
              maxW="100px"
              value={props.connectionDistance}
              min={50}
              max={300}
              step={10}
              onChange={(valueString, valueNumber) =>
                setProps({ ...props, connectionDistance: valueNumber })
              }
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </HStack>
        </Box>

        <Box>
          <Text fontWeight="bold" mb={2}>
            Particle Speed: {props.particleSpeed}
          </Text>
          <HStack>
            <Slider
              flex="1"
              value={props.particleSpeed || 1}
              min={0.1}
              max={3}
              step={0.1}
              onChange={(value) => setProps({ ...props, particleSpeed: value })}
            >
              {/* Slider components */}
            </Slider>
            <NumberInput
              maxW="100px"
              value={props.particleSpeed}
              min={0.1}
              max={3}
              step={0.1}
              precision={1}
              onChange={(valueString, valueNumber) =>
                setProps({ ...props, particleSpeed: valueNumber })
              }
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </HStack>
        </Box>

        <HStack justify="space-between">
          <Text fontWeight="bold">Interactive</Text>
          <Switch
            isChecked={props.interactive}
            onChange={(e) =>
              setProps({ ...props, interactive: e.target.checked })
            }
          />
        </HStack>
      </VStack>
    </Box>
  );
};
