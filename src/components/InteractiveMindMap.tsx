import React, { useState, useRef, useEffect } from 'react';
import { Box, Button, Input, VStack, HStack, Text, useToast } from '@chakra-ui/react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { v4 as uuidv4 } from 'uuid';

interface Node {
  id: string;
  content: string;
  x: number;
  y: number;
}

interface Connection {
  source: string;
  target: string;
}

const LOCAL_STORAGE_KEY = 'mindMapData';

const InteractiveMindMap: React.FC = () => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [selectedNodes, setSelectedNodes] = useState<string[]>([]);
  const [newNodeContent, setNewNodeContent] = useState('');
  const [scale, setScale] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const toast = useToast();

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mapX = useTransform(x, (value) => value / scale);
  const mapY = useTransform(y, (value) => value / scale);

  useEffect(() => {
    const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedData) {
      const { nodes: savedNodes, connections: savedConnections } = JSON.parse(savedData);
      setNodes(savedNodes);
      setConnections(savedConnections);
    }
  }, []);

  useEffect(() => {
    const dataToSave = { nodes, connections };
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(dataToSave));
  }, [nodes, connections]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Delete' && selectedNodes.length > 0) {
        deleteSelectedNodes();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [selectedNodes]);

  const addNode = () => {
    if (newNodeContent.trim() === '') {
      toast({
        title: 'Errore',
        description: 'Il contenuto del nodo non può essere vuoto',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const newNode: Node = {
      id: uuidv4(),
      content: newNodeContent,
      x: Math.random() * 300,
      y: Math.random() * 300,
    };

    setNodes(prevNodes => [...prevNodes, newNode]);
    setNewNodeContent('');
  };

  const updateNodePosition = (id: string, x: number, y: number) => {
    setNodes(prevNodes => prevNodes.map(node => node.id === id ? { ...node, x, y } : node));
  };

  const toggleNodeSelection = (id: string) => {
    setSelectedNodes(prev =>
      prev.includes(id) ? prev.filter(nodeId => nodeId !== id) : [...prev, id]
    );
  };

  const connectNodes = () => {
    if (selectedNodes.length !== 2) {
      toast({
        title: 'Errore',
        description: 'Seleziona esattamente due nodi per collegarli',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const [source, target] = selectedNodes;
    const newConnection: Connection = { source, target };
    setConnections([...connections, newConnection]);
    setSelectedNodes([]);
  };

  const deleteSelectedNodes = () => {
    setNodes(nodes.filter(node => !selectedNodes.includes(node.id)));
    setConnections(connections.filter(
      conn => !selectedNodes.includes(conn.source) && !selectedNodes.includes(conn.target)
    ));
    setSelectedNodes([]);
  };

  const handleZoom = (direction: 'in' | 'out') => {
    setScale(prev => Math.max(0.5, Math.min(2, prev + (direction === 'in' ? 0.1 : -0.1))));
  };

  const resetMindMap = () => {
    setNodes([]);
    setConnections([]);
    setSelectedNodes([]);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    toast({
      title: 'Mappa mentale resettata',
      description: 'Tutti i nodi e le connessioni sono stati eliminati',
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <VStack spacing={4} align="stretch" w="100%" h="600px">
      <HStack>
        <Input
          value={newNodeContent}
          onChange={(e) => setNewNodeContent(e.target.value)}
          placeholder="Contenuto del nuovo nodo"
        />
        <Button onClick={addNode}>Aggiungi Nodo</Button>
        <Button onClick={connectNodes} isDisabled={selectedNodes.length !== 2}>
          Collega Nodi
        </Button>
        <Button onClick={deleteSelectedNodes} isDisabled={selectedNodes.length === 0}>
          Elimina Nodi Selezionati
        </Button>
        <Button onClick={() => handleZoom('in')}>Zoom In</Button>
        <Button onClick={() => handleZoom('out')}>Zoom Out</Button>
        <Button onClick={resetMindMap} colorScheme="red">Reset</Button>
      </HStack>
      <Box
        ref={containerRef}
        position="relative"
        overflow="hidden"
        border="1px solid"
        borderColor="gray.200"
        borderRadius="md"
        h="100%"
      >
        <motion.div
          style={{
            x: mapX,
            y: mapY,
            scale,
          }}
          drag
          dragConstraints={containerRef}
        >
          {connections.map((conn, index) => {
            const sourceNode = nodes.find(node => node.id === conn.source);
            const targetNode = nodes.find(node => node.id === conn.target);
            if (!sourceNode || !targetNode) return null;

            return (
              <svg key={index} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
                <line
                  x1={sourceNode.x + 50}
                  y1={sourceNode.y + 25}
                  x2={targetNode.x + 50}
                  y2={targetNode.y + 25}
                  stroke="gray"
                  strokeWidth="2"
                />
              </svg>
            );
          })}
          {nodes.map((node) => (
            <motion.div
              key={node.id}
              style={{
                position: 'absolute',
                top: node.y,
                left: node.x,
                background: selectedNodes.includes(node.id) ? 'lightblue' : 'white',
                border: '1px solid gray',
                borderRadius: '4px',
                padding: '10px',
                cursor: 'move',
                userSelect: 'none',
              }}
              drag
              dragMomentum={false}
              onDrag={(_, info) => {
                updateNodePosition(node.id, node.x + info.delta.x / scale, node.y + info.delta.y / scale);
              }}
              onClick={() => toggleNodeSelection(node.id)}
            >
              <Text>{node.content}</Text>
            </motion.div>
            ))}
        </motion.div>
      </Box>
    </VStack>
  );
};

export default InteractiveMindMap;