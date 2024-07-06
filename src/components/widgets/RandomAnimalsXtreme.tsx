import React, { useEffect } from "react";
import {
  Box,
  Button,
  Image,
  Text,
  VStack,
  HStack,
  Spinner,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import WidgetBase from "../WidgetBase";
import { useLocalStorage } from "../../lib/useLocalStorage";
import { WidgetElementBaseProp } from "../../interfaces/widget";

interface RandomAnimalsXtremeProps extends WidgetElementBaseProp {
  id: string;
}

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

const RandomAnimalsXtreme: React.FC<RandomAnimalsXtremeProps> = ({
  id,
  editMode,
}) => {
  const [animal, setAnimal] = useLocalStorage(`randomAnimals_${id}_animal`, "");
  const [action, setAction] = useLocalStorage(`randomAnimals_${id}_action`, "");
  const [background, setBackground] = useLocalStorage(
    `randomAnimals_${id}_background`,
    ""
  );
  const [imageUrl, setImageUrl] = useLocalStorage(
    `randomAnimals_${id}_imageUrl`,
    ""
  );
  const [loading, setLoading] = useLocalStorage(
    `randomAnimals_${id}_loading`,
    false
  );
  const [score, setScore] = useLocalStorage(`randomAnimals_${id}_score`, 0);

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
    if (!animal || !action || !background) {
      generateRandomScene();
    }
  }, []);

  const content = (
    <VStack spacing={4}>
      <Text fontSize="2xl" fontWeight="bold">
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
  );

  // Non ci sono impostazioni specifiche per questo widget
  const settings = null;

  return <WidgetBase editMode={editMode}>{content}</WidgetBase>;
};

export default RandomAnimalsXtreme;
