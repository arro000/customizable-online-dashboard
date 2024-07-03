import React, { useState, useEffect } from 'react';
import { ChakraProvider, Box, VStack, HStack, Flex } from '@chakra-ui/react';
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
interface CardData {
  id: string;
  title: string;
  url: string;
  favicon: string;
}

const App: React.FC = () => {
  const [cards, setCards] = useState<CardData[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    const savedCards = localStorage.getItem('cards');
    if (savedCards) {
      setCards(JSON.parse(savedCards));
    }
  }, []);

  const saveCards = (newCards: CardData[]) => {
    setCards(newCards);
    localStorage.setItem('cards', JSON.stringify(newCards));
  };

  const handleAddCard = () => {
    const newCard: CardData = {
      id: Date.now().toString(),
      title: 'New Card',
      url: 'https://example.com',
      favicon: 'https://example.com/favicon.ico',
    };
    saveCards([...cards, newCard]);
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

  const handleDragEnd = (id: string, newIndex: number) => {
    const newCards = Array.from(cards);
    const [reorderedItem] = newCards.splice(cards.findIndex(card => card.id === id), 1);
    newCards.splice(newIndex, 0, reorderedItem);
    saveCards(newCards);
  };

  const handleUpdateCard = (id: string, newData: { title: string; url: string }) => {
    const updatedCards = cards.map(card =>
      card.id === id ? { ...card, ...newData } : card
    );
    saveCards(updatedCards);
  };

  return (
    <ChakraProvider>
      <DynamicBackground />
      <Box p={4}>
        <VStack spacing={4} align="stretch">
          <HStack justify="space-between">
            <Clock />
            <ActionButtons
              onAddCard={handleAddCard}
              onExportConfig={handleExportConfig}
              onImportConfig={handleImportConfig}
            />
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
            <CardList
              cards={cards}
              onDragEnd={handleDragEnd}
              isEditMode={isEditMode}
              onUpdateCard={handleUpdateCard}
            />
            <DynamicDashboard></DynamicDashboard>
          </Flex>
        </VStack>
      </Box>
    </ChakraProvider>
  );
};

export default App;