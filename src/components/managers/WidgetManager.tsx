// components/WidgetManager.tsx
import React, { useState } from "react";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Select,
  Box,
} from "@chakra-ui/react";
import * as Components from "../widgets/index";
import { v4 as uuidv4 } from "uuid";

interface WidgetManagerProps {
  onAddWidget: (widget: {
    id: string;
    x: number;
    y: number;
    w: number;
    h: number;
    component: keyof typeof Components;
    props?: Record<string, any>;
  }) => void;
}

const WidgetManager: React.FC<WidgetManagerProps> = ({ onAddWidget }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedWidget, setSelectedWidget] = useState<
    keyof typeof Components | ""
  >("");

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const addWidget = () => {
    if (selectedWidget) {
      onAddWidget({
        id: uuidv4(),
        x: 0,
        y: 0,
        w: 25,
        h: 20,
        component: selectedWidget,
      });
      closeModal();
    }
  };

  return (
    <>
      <Button onClick={openModal}>Aggiungi Widget</Button>

      <Modal isOpen={isOpen} onClose={closeModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Aggiungi nuovo widget</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Select
              placeholder="Seleziona un widget"
              onChange={(e) =>
                setSelectedWidget(e.target.value as keyof typeof Components)
              }
            >
              {Object.keys(Components).map((componentName) => (
                <option key={componentName} value={componentName}>
                  {componentName}
                </option>
              ))}
            </Select>

            {selectedWidget && (
              <Box
                mt={4}
                p={4}
                border="1px"
                borderColor="gray.200"
                borderRadius="md"
              >
                <h3>Anteprima:</h3>
                {React.createElement((Components as any)[selectedWidget])}
              </Box>
            )}
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={addWidget}
              isDisabled={!selectedWidget}
            >
              Conferma
            </Button>
            <Button variant="ghost" onClick={closeModal}>
              Annulla
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default WidgetManager;
