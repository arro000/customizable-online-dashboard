import React, { useState, useEffect } from 'react';
import { Box, Button, VStack, HStack, Text, Select, Input, useToast } from '@chakra-ui/react';
import { motion, Reorder } from 'framer-motion';
import { v4 as uuidv4 } from 'uuid';

type WidgetType = 'text' | 'number' | 'chart';

interface Widget {
  id: string;
  type: WidgetType;
  title: string;
  content: string;
}

const WidgetComponent: React.FC<{ widget: Widget; onEdit: (id: string, content: string) => void }> = ({ widget, onEdit }) => {
  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState(widget.content);

  const handleSave = () => {
    onEdit(widget.id, editContent);
    setEditing(false);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <Box borderWidth="1px" borderRadius="lg" p={4} mb={4} bg="white">
        <Text fontWeight="bold" mb={2}>{widget.title}</Text>
        {editing ? (
          <VStack>
            <Input value={editContent} onChange={(e) => setEditContent(e.target.value)} />
            <Button onClick={handleSave}>Salva</Button>
          </VStack>
        ) : (
          <VStack align="start">
            {widget.type === 'text' && <Text>{widget.content}</Text>}
            {widget.type === 'number' && <Text fontSize="2xl" fontWeight="bold">{widget.content}</Text>}
            {widget.type === 'chart' && <Text>Qui verrebbe visualizzato un grafico basato su: {widget.content}</Text>}
            <Button size="sm" onClick={() => setEditing(true)}>Modifica</Button>
          </VStack>
        )}
      </Box>
    </motion.div>
  );
};

const DynamicDashboard: React.FC = () => {
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [newWidgetType, setNewWidgetType] = useState<WidgetType>('text');
  const [newWidgetTitle, setNewWidgetTitle] = useState('');
  const toast = useToast();

  useEffect(() => {
    const savedWidgets = localStorage.getItem('dashboardWidgets');
    if (savedWidgets) {
      setWidgets(JSON.parse(savedWidgets));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('dashboardWidgets', JSON.stringify(widgets));
  }, [widgets]);

  const addWidget = () => {
    if (!newWidgetTitle) {
      toast({
        title: "Errore",
        description: "Il titolo del widget non può essere vuoto",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    const newWidget: Widget = {
      id: uuidv4(),
      type: newWidgetType,
      title: newWidgetTitle,
      content: '',
    };
    setWidgets([...widgets, newWidget]);
    setNewWidgetTitle('');
  };

  const editWidget = (id: string, content: string) => {
    setWidgets(widgets.map(w => w.id === id ? { ...w, content } : w));
  };

  const removeWidget = (id: string) => {
    setWidgets(widgets.filter(w => w.id !== id));
  };

  return (
    <VStack spacing={4} align="stretch">
      <HStack>
        <Select value={newWidgetType} onChange={(e) => setNewWidgetType(e.target.value as WidgetType)}>
          <option value="text">Testo</option>
          <option value="number">Numero</option>
          <option value="chart">Grafico</option>
        </Select>
        <Input 
          placeholder="Titolo del widget" 
          value={newWidgetTitle} 
          onChange={(e) => setNewWidgetTitle(e.target.value)}
        />
        <Button onClick={addWidget}>Aggiungi Widget</Button>
      </HStack>
      <Reorder.Group axis="y" values={widgets} onReorder={setWidgets}>
        {widgets.map((widget) => (
          <Reorder.Item key={widget.id} value={widget}>
            <motion.div
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <HStack justify="space-between" mb={2}>
                <Text fontWeight="bold">{widget.title}</Text>
                <Button size="sm" onClick={() => removeWidget(widget.id)}>Rimuovi</Button>
              </HStack>
              <WidgetComponent widget={widget} onEdit={editWidget} />
            </motion.div>
          </Reorder.Item>
        ))}
      </Reorder.Group>
    </VStack>
  );
};

export default DynamicDashboard;