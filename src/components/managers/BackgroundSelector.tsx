// components/BackgroundSelector.tsx
import React from "react";
import { Select, Box, VStack } from "@chakra-ui/react";
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

  const handleBackgroundChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedBackground(e.target.value);
    setBackgroundProps({});
  };

  const BackgroundComponent = (Backgrounds as any)[selectedBackground];
  const BackgroundOptions = BackgroundComponent.Options;

  return (
    <>
      {editMode && (
        <VStack spacing={4} align="stretch" mb={4}>
          <Select value={selectedBackground} onChange={handleBackgroundChange}>
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
      )}
      <BackgroundComponent {...backgroundProps} />
    </>
  );
};

export default BackgroundSelector;
