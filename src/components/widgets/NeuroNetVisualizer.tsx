import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Box,
  Button,
  VStack,
  HStack,
  Text,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  useColorModeValue,
} from '@chakra-ui/react';

interface Neuron {
  x: number;
  y: number;
  connections: number[];
  activation: number;
}

const useResizeObserver = (ref: React.RefObject<HTMLElement>) => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const observeTarget = ref.current;
    if (!observeTarget) return;

    const resizeObserver = new ResizeObserver(entries => {
      entries.forEach(entry => {
        setDimensions({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      });
    });

    resizeObserver.observe(observeTarget);

    return () => {
      resizeObserver.unobserve(observeTarget);
    };
  }, [ref]);

  return dimensions;
};

const NeuroNetVisualizer: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [neurons, setNeurons] = useState<Neuron[]>([]);
  const [learningRate, setLearningRate] = useState(0.1);
  const [iterations, setIterations] = useState(0);
  
  const { width, height } = useResizeObserver(containerRef);

  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.800', 'white');

  const initializeNeurons = useCallback(() => {
    const newNeurons: Neuron[] = [];
    for (let i = 0; i < 20; i++) {
      newNeurons.push({
        x: Math.random() * width,
        y: Math.random() * height,
        connections: [],
        activation: Math.random(),
      });
    }
    // Create random connections
    newNeurons.forEach((neuron, i) => {
      for (let j = 0; j < 3; j++) {
        const target = Math.floor(Math.random() * newNeurons.length);
        if (target !== i && !neuron.connections.includes(target)) {
          neuron.connections.push(target);
        }
      }
    });
    setNeurons(newNeurons);
  }, [width, height]);

  useEffect(() => {
    if (width > 0 && height > 0) {
      initializeNeurons();
    }
  }, [width, height, initializeNeurons]);

  useEffect(() => {
    drawNetwork();
  }, [neurons, iterations, width, height]);

  const drawNetwork = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw connections
    neurons.forEach((neuron, i) => {
      neuron.connections.forEach(target => {
        ctx.beginPath();
        ctx.moveTo(neuron.x, neuron.y);
        ctx.lineTo(neurons[target].x, neurons[target].y);
        ctx.strokeStyle = `rgba(255, 255, 255, ${neuron.activation})`;
        ctx.lineWidth = neuron.activation * 3;
        ctx.stroke();
      });
    });

    // Draw neurons
    neurons.forEach(neuron => {
      ctx.beginPath();
      ctx.arc(neuron.x, neuron.y, 10, 0, 2 * Math.PI);
      ctx.fillStyle = `rgb(${neuron.activation * 255}, 100, 100)`;
      ctx.fill();
    });
  };

  const updateNetwork = () => {
    setNeurons(prevNeurons => {
      return prevNeurons.map(neuron => {
        const inputSum = neuron.connections.reduce((sum, target) => {
          return sum + prevNeurons[target].activation;
        }, 0);
        const newActivation = Math.tanh(inputSum * learningRate);
        return { ...neuron, activation: newActivation };
      });
    });
    setIterations(prev => prev + 1);
  };

  const handleClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    setNeurons(prevNeurons => {
      return prevNeurons.map(neuron => {
        const distance = Math.sqrt((neuron.x - x) ** 2 + (neuron.y - y) ** 2);
        if (distance < 50) {
          return { ...neuron, activation: 1 };
        }
        return neuron;
      });
    });
  };

  return (
    <Box
      ref={containerRef}
      borderWidth="1px"
      borderRadius="lg"
      p={4}
      width="100%"
      height="600px"
      bg={bgColor}
      borderColor={borderColor}
    >
      <VStack spacing={4} align="stretch" height="100%">
        <Text fontSize="xl" fontWeight="bold" color={textColor}>NeuroNet Visualizer</Text>
        <Box flexGrow={1} position="relative">
          <Box
            as="canvas"
            ref={canvasRef}
            position="absolute"
            top={0}
            left={0}
            width="100%"
            height="100%"
            onClick={handleClick}
            cursor="pointer"
            bg="gray.900"
          />
        </Box>
        <HStack>
          <Button onClick={updateNetwork} colorScheme="blue">Update Network</Button>
          <Button onClick={initializeNeurons} colorScheme="green">Reset</Button>
        </HStack>
        <HStack>
          <Text color={textColor}>Learning Rate:</Text>
          <Slider
            value={learningRate}
            min={0.01}
            max={1}
            step={0.01}
            onChange={setLearningRate}
          >
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb />
          </Slider>
          <Text color={textColor}>{learningRate.toFixed(2)}</Text>
        </HStack>
        <Text color={textColor}>Iterations: {iterations}</Text>
      </VStack>
    </Box>
  );
};

export default NeuroNetVisualizer;