import React from "react";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Box,
  VStack,
  Select,
} from "@chakra-ui/react";
import { useLocalStorage } from "../../lib/useLocalStorage";
import * as Backgrounds from "../widgets/backgrounds";

interface BackgroundSelectorProps {
  editMode: boolean;
}

const BackgroundSelector: React.FC<BackgroundSelectorProps> = ({
  editMode,
}) => {
  const [selectedBackground, setSelectedBackground] = useLocalStorage(
    "selectedBackground",
    "GradientBackground"
  );
  const [backgroundProps, setBackgroundProps] = useLocalStorage(
    "backgroundProps",
    {}
  );
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleBackgroundChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedBackground(e.target.value);
    setBackgroundProps({});
  };

  const BackgroundComponent = (Backgrounds as any)[selectedBackground];
  const BackgroundOptions = BackgroundComponent.Options;

  return (
    <>
      {editMode && (
        <Button onClick={onOpen} w="full" zIndex={9999}>
          {selectedBackground}
        </Button>
      )}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Background Settings</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <Select
                value={selectedBackground}
                onChange={handleBackgroundChange}
              >
                {Object.keys(Backgrounds).map((bg) => (
                  <option key={bg} value={bg}>
                    {bg}
                  </option>
                ))}
              </Select>
              {BackgroundOptions && (
                <BackgroundOptions
                  props={backgroundProps}
                  setProps={setBackgroundProps}
                />
              )}
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
      <Box position="fixed" top={0} left={0} right={0} bottom={0} zIndex={-1}>
        <BackgroundComponent {...backgroundProps} />
      </Box>
    </>
  );
};

export default BackgroundSelector;
