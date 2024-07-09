import React, { useCallback, useEffect } from "react";
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
import withWidgetBase from "../hooks/withWidgetBase";
import { WidgetProps } from "../../interfaces/widget";

interface RandomAnimalsXtremeConfig {
  animal: string;
  action: string;
  background: string;
  imageUrl: string;
  loading: boolean;
  score: number;
}

const defaultConfig: RandomAnimalsXtremeConfig = {
  animal: "",
  action: "",
  background: "",
  imageUrl: "",
  loading: false,
  score: 0,
};

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

const RandomAnimalsXtremeContent: React.FC<
  WidgetProps<RandomAnimalsXtremeConfig>
> = ({ config, onConfigChange }) => {
  const generateRandomScene = useCallback(() => {
    onConfigChange({ loading: true });
    const newAnimal = animals[Math.floor(Math.random() * animals.length)];
    const newAction = actions[Math.floor(Math.random() * actions.length)];
    const newBackground =
      backgrounds[Math.floor(Math.random() * backgrounds.length)];

    // Simula il caricamento di un'immagine
    setTimeout(() => {
      onConfigChange({
        animal: newAnimal,
        action: newAction,
        background: newBackground,
        imageUrl: `https://source.unsplash.com/400x300/?${newAnimal},${newBackground}`,
        loading: false,
        score: config.score + Math.floor(Math.random() * 100) + 1,
      });
    }, 1500);
  }, [config.score, onConfigChange]);

  useEffect(() => {
    if (!config.animal || !config.action || !config.background) {
      generateRandomScene();
    }
  }, [config.animal, config.action, config.background, generateRandomScene]);

  return (
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
        {config.loading ? (
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
              src={config.imageUrl}
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
                {`${config.animal.toUpperCase()} ${config.action.toUpperCase()}`}
                <br />
                {`ON ${config.background.toUpperCase()}!`}
              </Text>
            </Box>
          </motion.div>
        )}
      </Box>
      <HStack>
        <Button
          colorScheme="teal"
          onClick={generateRandomScene}
          isLoading={config.loading}
        >
          Generate New Scene!
        </Button>
        <Box bg="yellow.400" px={3} py={2} borderRadius="md">
          <Text fontWeight="bold">Score: {config.score}</Text>
        </Box>
      </HStack>
    </VStack>
  );
};

const RandomAnimalsXtreme = withWidgetBase<RandomAnimalsXtremeConfig>({
  renderWidget: (props) => <RandomAnimalsXtremeContent {...props} />,
  rendereOptions: () => null,

  defaultConfig,
});

export default RandomAnimalsXtreme;
