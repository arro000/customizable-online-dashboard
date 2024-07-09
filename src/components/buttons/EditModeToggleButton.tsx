import { SettingsIcon } from "@chakra-ui/icons";
import { Button, Icon, IconButton } from "@chakra-ui/react";

interface EditModeToggleButtonProps {
  editMode: boolean;
  setEditMode: (editMode: boolean) => void;
}

export const EditModeToggleButton = ({
  editMode,
  setEditMode,
}: EditModeToggleButtonProps) => {
  return (
    <IconButton
      icon={<SettingsIcon></SettingsIcon>}
      onClick={() => setEditMode(!editMode)}
      aria-label={""}
    ></IconButton>
  );
};
