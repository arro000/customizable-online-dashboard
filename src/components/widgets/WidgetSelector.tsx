import React from "react";
import { Select, Button, HStack } from "@chakra-ui/react";

interface WidgetSelectorProps {
  onAddWidget: (type: string) => void;
  isDisabled: boolean;
}

const WidgetSelector: React.FC<WidgetSelectorProps> = ({
  onAddWidget,
  isDisabled,
}) => {
  const [selectedWidget, setSelectedWidget] = React.useState("");

  const handleAddWidget = () => {
    if (selectedWidget) {
      onAddWidget(selectedWidget);
      setSelectedWidget("");
    }
  };

  return (
    <HStack>
      <Select
        placeholder="Seleziona un widget"
        value={selectedWidget}
        onChange={(e) => setSelectedWidget(e.target.value)}
        isDisabled={isDisabled}
      >
        <option value="WeatherCard">Meteo</option>
        <option value="TodoList">Lista Todo</option>
        <option value="QuoteGenerator">Citazione del Giorno</option>
        <option value="PomodoroTimer">Timer Pomodoro</option>
        {/* Aggiungi altri widget qui */}
      </Select>
      <Button
        onClick={handleAddWidget}
        isDisabled={isDisabled || !selectedWidget}
      >
        Aggiungi Widget
      </Button>
    </HStack>
  );
};

export default WidgetSelector;
