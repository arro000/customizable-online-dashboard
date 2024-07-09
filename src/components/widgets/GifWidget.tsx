import React, { useState } from "react";
import {
  Box,
  Input,
  Button,
  Image,
  VStack,
  Text,
  useToast,
  Select,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Switch,
  HStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  SimpleGrid,
} from "@chakra-ui/react";
import withWidgetBase from "../hooks/withWidgetBase";
import { WidgetProps } from "../../interfaces/widget";

interface GifConfig {
  imageUrl: string;
  fitType: "contain" | "cover" | "fill";
  borderRadius: number;
  brightness: number;
  grayscale: boolean;
  autoPlay: boolean;
  loop: boolean;
}

const defaultConfig: GifConfig = {
  imageUrl: "",
  fitType: "contain",
  borderRadius: 0,
  brightness: 100,
  grayscale: false,
  autoPlay: true,
  loop: true,
};

const GifContent: React.FC<WidgetProps<GifConfig>> = ({ config }) => {
  const toast = useToast();

  return (
    <Box
      width="100%"
      height="100%"
      display="flex"
      justifyContent="center"
      alignItems="center"
      overflow="hidden"
      borderRadius={`${config.borderRadius}px`}
    >
      {config.imageUrl ? (
        <Image
          as={config.autoPlay ? "img" : "video"}
          src={config.imageUrl}
          alt="GIF/Immagine caricata"
          objectFit={config.fitType}
          maxW="100%"
          maxH="100%"
          filter={`brightness(${config.brightness}%) ${
            config.grayscale ? "grayscale(100%)" : ""
          }`}
          autoPlay={config.autoPlay ?? true}
          loop={config.loop}
          muted
          onError={() => {
            toast({
              title: "Errore",
              description:
                "Impossibile caricare l'immagine. Verifica l'URL e riprova.",
              status: "error",
              duration: 3000,
              isClosable: true,
            });
          }}
        />
      ) : (
        <Text>Nessuna immagine caricata</Text>
      )}
    </Box>
  );
};

const GifOptions: React.FC<WidgetProps<GifConfig>> = ({
  config,
  onConfigChange,
}) => {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<string[]>([]);

  const handleLoadImage = () => {
    if (!config.imageUrl) {
      toast({
        title: "Errore",
        description: "Inserisci un URL valido",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    toast({
      title: "Successo",
      description: "Immagine caricata con successo",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const handleSearch = async () => {
    try {
      const response = await fetch(
        `https://api.giphy.com/v1/gifs/search?api_key=YOUR_GIPHY_API_KEY&q=${searchTerm}&limit=20`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      const gifs = data.data.map((gif: any) => gif.images.fixed_height.url);
      setSearchResults(gifs);
    } catch (error) {
      console.error("Error fetching GIFs:", error);
      toast({
        title: "Errore",
        description: "Impossibile cercare GIF. Riprova più tardi.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleSelectGif = (url: string) => {
    onConfigChange({ ...config, imageUrl: url });
    onClose();
  };

  return (
    <VStack spacing={4} align="stretch">
      <Text fontWeight="bold">Impostazioni GIF/Immagine</Text>
      <Input
        placeholder="URL dell'immagine o GIF"
        value={config.imageUrl}
        onChange={(e) =>
          onConfigChange({ ...config, imageUrl: e.target.value })
        }
      />
      <HStack>
        <Button onClick={handleLoadImage} colorScheme="blue">
          Carica immagine
        </Button>
        <Button onClick={onOpen} colorScheme="green">
          Cerca GIF
        </Button>
      </HStack>
      <Select
        value={config.fitType}
        onChange={(e) =>
          onConfigChange({
            ...config,
            fitType: e.target.value as GifConfig["fitType"],
          })
        }
      >
        <option value="contain">Contain</option>
        <option value="cover">Cover</option>
        <option value="fill">Fill</option>
      </Select>
      <Text>Border Radius: {config.borderRadius}px</Text>
      <Slider
        value={config.borderRadius}
        onChange={(value) => onConfigChange({ ...config, borderRadius: value })}
        min={0}
        max={50}
      >
        <SliderTrack>
          <SliderFilledTrack />
        </SliderTrack>
        <SliderThumb />
      </Slider>
      <Text>Brightness: {config.brightness}%</Text>
      <Slider
        value={config.brightness}
        onChange={(value) => onConfigChange({ ...config, brightness: value })}
        min={0}
        max={200}
      >
        <SliderTrack>
          <SliderFilledTrack />
        </SliderTrack>
        <SliderThumb />
      </Slider>
      <HStack justify="space-between">
        <Text>Grayscale</Text>
        <Switch
          isChecked={config.grayscale}
          onChange={(e) =>
            onConfigChange({ ...config, grayscale: e.target.checked })
          }
        />
      </HStack>
      <HStack justify="space-between">
        <Text>Auto Play</Text>
        <Switch
          isChecked={config.autoPlay}
          onChange={(e) =>
            onConfigChange({ ...config, autoPlay: e.target.checked })
          }
        />
      </HStack>
      <HStack justify="space-between">
        <Text>Loop</Text>
        <Switch
          isChecked={config.loop}
          onChange={(e) =>
            onConfigChange({ ...config, loop: e.target.checked })
          }
        />
      </HStack>

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Cerca GIF</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <Input
                placeholder="Cerca GIF..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button onClick={handleSearch} colorScheme="blue">
                Cerca
              </Button>
              <SimpleGrid columns={3} spacing={4}>
                {searchResults.map((url, index) => (
                  <Image
                    key={index}
                    src={url}
                    alt={`Search result ${index + 1}`}
                    onClick={() => handleSelectGif(url)}
                    cursor="pointer"
                    borderRadius="md"
                    _hover={{ opacity: 0.8 }}
                  />
                ))}
              </SimpleGrid>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Chiudi
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </VStack>
  );
};

const GifWidget = withWidgetBase<GifConfig>({
  renderWidget: (props) => <GifContent {...props} />,
  renderOptions: (props) => <GifOptions {...props} />,
  defaultConfig,
});

export default GifWidget;
