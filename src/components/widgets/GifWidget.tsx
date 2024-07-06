import React, { useState } from "react";
import {
  Box,
  Input,
  Button,
  Image,
  VStack,
  Text,
  useToast,
} from "@chakra-ui/react";
import WidgetBase from "../WidgetBase";
import { useLocalStorage } from "../../lib/useLocalStorage";

interface GifWidgetProps {
  id: string;
  editMode: boolean;
}

interface GifConfig {
  imageUrl: string;
}

const GifWidget: React.FC<GifWidgetProps> = ({ id, editMode }) => {
  const [config, setConfig] = useLocalStorage<GifConfig>(`gifWidget_${id}`, {
    imageUrl: "",
  });
  const [inputUrl, setInputUrl] = useState(config.imageUrl);
  const toast = useToast();

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputUrl(e.target.value);
  };

  const handleLoadImage = () => {
    if (!inputUrl) {
      toast({
        title: "Errore",
        description: "Inserisci un URL valido",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setConfig({ imageUrl: inputUrl });
    toast({
      title: "Successo",
      description: "Immagine caricata con successo",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const renderSettings = () => (
    <VStack spacing={4} align="stretch">
      <Text fontWeight="bold">Impostazioni GIF/Immagine</Text>
      <Input
        placeholder="URL dell'immagine o GIF"
        value={inputUrl}
        onChange={handleUrlChange}
      />
      <Button onClick={handleLoadImage} colorScheme="blue">
        Carica immagine
      </Button>
    </VStack>
  );

  const renderContent = () => (
    <Box
      width="100%"
      height="100%"
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      {config.imageUrl ? (
        <Image
          src={config.imageUrl}
          alt="GIF/Immagine caricata"
          objectFit="contain"
          maxW="100%"
          maxH="100%"
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

  return (
    <WidgetBase editMode={editMode} settings={renderSettings()}>
      {renderContent()}
    </WidgetBase>
  );
};

export default GifWidget;
