import React, { useState, useEffect } from 'react';
import { ChakraProvider,useColorMode ,Button, useToast, Spacer, Box, VStack, HStack, Flex } from '@chakra-ui/react';
import ActionButtons from './components/ActionButtons';
import CardList from './components/CardList';
import Clock from './components/Clock';
import DynamicBackground from './components/DynamicBackground';
import NewsCard from './components/NewsCard';
import WeatherCard from './components/WeatherCard';
import TodoList from './components/TodoList';
import QuoteGenerator from './components/QuoteGenerator'
import MoodColorizer from './components/MoodColorizer'
import PomodoroTimer from './components/PomodoroTimer'
import Calculator from './components/Calculator'
import NeuroNetVisualizer from './components/NeuroNetVisualizer';
import MoodMusicMixer from './components/MoodMusicMixer';
import ConfigurableIframeCard from './components/ConfigurableIframeCard'
import InteractiveMindMap from "./components/InteractiveMindMap"
import DynamicDashboard from "./components/DynamicDashboard"
import AdvancedDataVisualizer from "./components/AdvancedDataVisualizer"
import {CardData} from "./components/Card";
import { v4 as uuidv4 } from 'uuid';


const App: React.FC = () => {
  const [cards, setCards] = useState<CardData[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);
const { colorMode, toggleColorMode } = useColorMode();
  const toast = useToast();
  const toggleEditMode = () => setIsEditMode(!isEditMode);
  useEffect(() => {
    const savedCards = localStorage.getItem('cards');
    if (savedCards) {
      setCards(JSON.parse(savedCards));
    }
  }, []);
  const updateCard = (id: string, newData: { title: string; url: string }) => {
    setCards(prevCards =>
        prevCards.map(card =>
            card.id === id ? { ...card, ...newData } : card
        )
    );
  }

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
        const newCard: CardData = {
          id: uuidv4(),
          title:url,
          url,
          favicon:url+"/favicon.ico"
        };

        setCards(prevCards => [...prevCards, newCard]);
        toast({
          title: "Errore",
          description: "Non è stato possibile aggiungere la card. Riprova più tardi.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    }
  }
    
  const saveCards = (newCards: CardData[]) => {
    setCards(newCards);
    localStorage.setItem('cards', JSON.stringify(newCards));
  };


  const handleExportConfig = () => {
    const config = JSON.stringify(cards);
    const blob = new Blob([config], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'dashboard-config.json';
    a.click();
  };

  const handleImportConfig = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        try {
          const importedCards = JSON.parse(content);
          saveCards(importedCards);
        } catch (error) {
          console.error('Error importing configuration:', error);
        }
      };
      reader.readAsText(file);
    }
  };

  

  return (
    <ChakraProvider>
      <DynamicBackground />
      <Box p={4}>
        <VStack spacing={4} align="stretch">
          <HStack justify="space-between">
            <Clock />
            <Flex gap={6} direction={"column"}>
                <Button onClick={toggleColorMode} size="sm">
                Tema: {colorMode === "light" ? "Scuro" : "Chiaro"}
              </Button>
              <Button onClick={toggleEditMode} size="sm" mr={2}>
                {isEditMode ? "Modalità Navigazione" : "Modalità Modifica"}
              </Button>
              <Spacer />
            <ActionButtons
              onAddCard={addCard}
              onExportConfig={handleExportConfig}
              onImportConfig={handleImportConfig}
            />
              
            </Flex>
          
          </HStack>
          <Flex
            flexWrap="wrap"
            justifyContent={{ base: 'center', md: 'flex-start' }}
            gap={4}
          >
            <WeatherCard />
            <NewsCard />
            <TodoList />
            <AdvancedDataVisualizer />
            <QuoteGenerator />
             <Calculator />
            <PomodoroTimer />
            <NeuroNetVisualizer />
             <ConfigurableIframeCard />
            <MoodMusicMixer />
             <MoodColorizer />
             
             <InteractiveMindMap />

            <DynamicDashboard></DynamicDashboard>
            <CardList
                cards={cards}
                onDragEnd={onDragEnd}
                isEditMode={isEditMode}
                onUpdateCard={updateCard}
            />
          </Flex>
        </VStack>
      </Box>
    </ChakraProvider>
  );
};

export default App;