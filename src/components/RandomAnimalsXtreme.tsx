import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Image,
  Text,
  VStack,
  HStack,
  Spinner,
  useColorModeValue,
} from "@chakra-ui/react";
import { motion } from "framer-motion";

const animals = [
  "cat",
  "dog",
  "elephant",
  "lion",
  "penguin",
  "koala",
  "giraffe",
  "hippo",
];
const actions = [
  "dancing",
  "singing",
  "skateboarding",
  "cooking",
  "painting",
  "skydiving",
];
const backgrounds = [
  "beach",
  "moon",
  "jungle",
  "city",
  "underwater",
  "volcano",
];

const RandomAnimalsXtreme = () => {
  const [animal, setAnimal] = useState("");
  const [action, setAction] = useState("");
  const [background, setBackground] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState(0);

  const generateRandomScene = () => {
    setLoading(true);
    const newAnimal = animals[Math.floor(Math.random() * animals.length)];
    const newAction = actions[Math.floor(Math.random() * actions.length)];
    const newBackground =
      backgrounds[Math.floor(Math.random() * backgrounds.length)];
    setAnimal(newAnimal);
    setAction(newAction);
    setBackground(newBackground);

    // Simula il caricamento di un'immagine
    setTimeout(() => {
      setImageUrl(
        `https://source.unsplash.com/400x300/?${newAnimal},${newBackground}`
      );
      setLoading(false);
      setScore((prevScore) => prevScore + Math.floor(Math.random() * 100) + 1);
    }, 1500);
  };

  useEffect(() => {
    generateRandomScene();
  }, []);
  const bgColor = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  return (
    <Box
      p={5}
      borderWidth={2}
      borderRadius="lg"
      boxShadow="lg"
      bgColor={bgColor}
      borderColor={borderColor}
    >
      <VStack spacing={4}>
        <Text fontSize="2xl" fontWeight="bold" color="purple.500">
          Random Animals Xtreme!
        </Text>
        <Box
          height="300px"
          width="100%"
          position="relative"
          overflow="hidden"
          borderRadius="md"
        >
          {loading ? (
            <Spinner
              size="xl"
              position="absolute"
              top="50%"
              left="50%"
              transform="translate(-50%, -50%)"
            />
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Image
                src={imageUrl}
                alt="Random scene"
                objectFit="cover"
                width="100%"
                height="100%"
              />
              <Box
                position="absolute"
                top={0}
                left={0}
                width="100%"
                height="100%"
                bg="rgba(0,0,0,0.4)"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Text
                  fontSize="3xl"
                  fontWeight="bold"
                  color="white"
                  textAlign="center"
                  textShadow="2px 2px 4px rgba(0,0,0,0.5)"
                >
                  {`${animal.toUpperCase()} ${action.toUpperCase()}`}
                  <br />
                  {`ON ${background.toUpperCase()}!`}
                </Text>
              </Box>
            </motion.div>
          )}
        </Box>
        <HStack>
          <Button
            colorScheme="teal"
            onClick={generateRandomScene}
            isLoading={loading}
          >
            Generate New Scene!
          </Button>
          <Box bg="yellow.400" px={3} py={2} borderRadius="md">
            <Text fontWeight="bold">Score: {score}</Text>
          </Box>
        </HStack>
      </VStack>
    </Box>
  );
};

export default RandomAnimalsXtreme;
