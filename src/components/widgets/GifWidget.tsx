import React from "react";
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
} from "@chakra-ui/react";
import withWidgetBase from "../hooks/withWidgetBase";
import { WidgetProps } from "../../interfaces/widget";
import { useWidgetConfig } from "../../hooks/useWidgetConfig";

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

const GifContent: React.FC<WidgetProps<GifConfig>> = (props) => {
  const [config] = useWidgetConfig(props);
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

const GifOptions: React.FC<WidgetProps<GifConfig>> = (props) => {
  const [config, updateConfig] = useWidgetConfig(props);
  const toast = useToast();

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

  return (
    <VStack spacing={4} align="stretch">
      <Text fontWeight="bold">Impostazioni GIF/Immagine</Text>
      <Input
        placeholder="URL dell'immagine o GIF"
        value={config.imageUrl}
        onChange={(e) => updateConfig({ imageUrl: e.target.value })}
      />
      <Button onClick={handleLoadImage} colorScheme="blue">
        Carica immagine
      </Button>
      <Select
        value={config.fitType}
        onChange={(e) =>
          updateConfig({ fitType: e.target.value as GifConfig["fitType"] })
        }
      >
        <option value="contain">Contain</option>
        <option value="cover">Cover</option>
        <option value="fill">Fill</option>
      </Select>
      <Text>Border Radius: {config.borderRadius}px</Text>
      <Slider
        value={config.borderRadius}
        onChange={(value) => updateConfig({ borderRadius: value })}
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
        onChange={(value) => updateConfig({ brightness: value })}
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
          onChange={(e) => updateConfig({ grayscale: e.target.checked })}
        />
      </HStack>
      <HStack justify="space-between">
        <Text>Auto Play</Text>
        <Switch
          isChecked={config.autoPlay}
          onChange={(e) => updateConfig({ autoPlay: e.target.checked })}
        />
      </HStack>
      <HStack justify="space-between">
        <Text>Loop</Text>
        <Switch
          isChecked={config.loop}
          onChange={(e) => updateConfig({ loop: e.target.checked })}
        />
      </HStack>
    </VStack>
  );
};

const GifWidget = withWidgetBase<GifConfig>({
  renderWidget: (props) => <GifContent {...props} />,
  renderOptions: (props) => <GifOptions {...props} />,
  defaultConfig,
});

export default GifWidget;
