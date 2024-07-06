import { SettingsIcon } from "@chakra-ui/icons";
import { Button } from "@chakra-ui/react";

interface EditModeToggleButtonProps {
  editMode: boolean;
  setEditMode: (editMode: boolean) => void;
}

export const EditModeToggleButton = ({
  editMode,
  setEditMode,
}: EditModeToggleButtonProps) => {
  return (
    <Button
      rightIcon={<SettingsIcon></SettingsIcon>}
      onClick={() => setEditMode(!editMode)}
    >
      {editMode && <span>Turn off edit mode</span>}
    </Button>
  );
};
