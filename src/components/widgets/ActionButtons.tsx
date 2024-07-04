import React from 'react';
import { Button, VStack } from '@chakra-ui/react';

interface ActionButtonsProps {
    onAddCard: () => void;
    onExportConfig: () => void;
    onImportConfig: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ onAddCard, onExportConfig, onImportConfig }) => {
    return (
        <VStack spacing={2}>
            <Button onClick={onAddCard} size="sm">Aggiungi Card</Button>
            <Button onClick={onExportConfig} size="sm">Esporta</Button>
            <Button as="label" htmlFor="import-config" size="sm">
                Importa
                <input
                    id="import-config"
                    type="file"
                    accept=".json"
                    onChange={onImportConfig}
                    style={{ display: 'none' }}
                />
            </Button>
        </VStack>
    );
};

export default ActionButtons;