import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  useColorMode,
  ChakraProvider,
  Flex,
  Spacer,
  VStack,
  Container, useToast, HStack,
} from '@chakra-ui/react';
import CardList from './components/CardList';
import ActionButtons from './components/ActionButtons';
import Clock from './components/Clock';
import DynamicBackground from './components/DynamicBackground';
import {CardData} from "./components/Card";
import { v4 as uuidv4 } from 'uuid';
import WeatherCard from "./components/WeatherCard";
import NewsCard from "./components/NewsCard";


function App() {
  const [cards, setCards] = useState<CardData[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const { colorMode, toggleColorMode } = useColorMode();
  const toast = useToast();
  useEffect(() => {
    const savedCards = JSON.parse(localStorage.getItem('cards') || '[]') as CardData[];
    setCards(savedCards);
  }, []);

  useEffect(() => {
    localStorage.setItem('cards', JSON.stringify(cards));
  }, [cards]);

  const onDragEnd = (id: string, newIndex: number) => {
    setCards(prevCards => {
      const newCards = Array.from(prevCards);
      const draggedCardIndex = newCards.findIndex(card => card.id === id);
      console.log(draggedCardIndex, newIndex);
      if (draggedCardIndex === -1 || draggedCardIndex === newIndex) return prevCards;

      const [draggedCard] = newCards.splice(draggedCardIndex, 1);
      newCards.splice(newIndex, 0, draggedCard);

      return newCards.filter(card => card !== undefined);
    });
  };
  const addCard = async () => {
    const url = prompt('Inserisci l\'URL del sito:');
    if (url) {
      try {
        const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
        const response = await fetch(proxyUrl);
        const data = await response.json();

        if (data.status.http_code !== 200) {
          throw new Error('Errore nel recupero delle informazioni del sito');
        }

        const parser = new DOMParser();
        const doc = parser.parseFromString(data.contents, 'text/html');

        const title = doc.querySelector('title')?.textContent ||
            doc.querySelector('meta[property="og:title"]')?.getAttribute('content') ||
            'Sito sconosciuto';

        let favicon = doc.querySelector('link[rel="icon"]')?.getAttribute('href') ||
            doc.querySelector('link[rel="shortcut icon"]')?.getAttribute('href') ||
            '/default-favicon.ico';

        // Assicuriamoci che l'URL della favicon sia assoluto
        if (favicon && !favicon.startsWith('http')) {
          favicon = new URL(favicon, url).href;
        }

        const newCard: CardData = {
          id: uuidv4(),
          title,
          url,
          favicon
        };

        setCards(prevCards => [...prevCards, newCard]);

        toast({
          title: "Card aggiunta",
          description: "La nuova card è stata aggiunta con successo.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } catch (error) {
        console.error('Errore nell\'aggiunta della card:', error);
        toast({
          title: "Errore",
          description: "Non è stato possibile aggiungere la card. Riprova più tardi.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };


  const updateCard = (id: string, newData: { title: string; url: string }) => {
    setCards(prevCards =>
        prevCards.map(card =>
            card.id === id ? { ...card, ...newData } : card
        )
    );
  };

  const toggleEditMode = () => setIsEditMode(!isEditMode);
  const exportConfig = () => {
    const config = JSON.stringify(cards);
    const blob = new Blob([config], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'home-config.json';
    a.click();
  };

  const importConfig = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      try {
        const importedCards = JSON.parse(e.target?.result as string) as CardData[];
        setCards(importedCards);
      } catch (error) {
        alert('Errore durante l\'importazione della configurazione');
      }
    };
    reader.readAsText(file);
  };
  return (
      <ChakraProvider>
        <DynamicBackground />
        <Container maxW="container.xl" p={5}>
          <VStack spacing={4} align="stretch">
            <Flex>
              <Button onClick={toggleColorMode} size="sm">
                Tema: {colorMode === "light" ? "Scuro" : "Chiaro"}
              </Button>
              <Spacer />
              <Button onClick={toggleEditMode} size="sm" mr={2}>
                {isEditMode ? "Modalità Navigazione" : "Modalità Modifica"}
              </Button>
              <ActionButtons
                  onAddCard={addCard}
                  onExportConfig={exportConfig}
                  onImportConfig={importConfig}
              />
            </Flex>
            <Box alignSelf="center">
              <Clock />
            </Box>
            <HStack spacing={4} justify="center">
              <WeatherCard />
              <NewsCard />
            </HStack>
            <Box>
              <CardList
                  cards={cards}
                  onDragEnd={onDragEnd}
                  isEditMode={isEditMode}
                  onUpdateCard={updateCard}
              />
            </Box>
          </VStack>
        </Container>
      </ChakraProvider>
  );
}

export default App;