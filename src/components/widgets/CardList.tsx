import React, { useState, useRef } from 'react';
import { Box } from '@chakra-ui/react';
import Card from './Card';
import { motion, AnimatePresence } from 'framer-motion';

interface CardData {
    id: string;
    title: string;
    url: string;
    favicon: string;
}

interface CardListProps {
    cards: CardData[];
    onDragEnd: (id: string, newIndex: number) => void;
    isEditMode: boolean;
    onUpdateCard: (id: string, newData: { title: string; url: string }) => void;
}

const CardList: React.FC<CardListProps> = ({ cards, onDragEnd, isEditMode, onUpdateCard }) => {
    const [draggingId, setDraggingId] = useState<string | null>(null);
    const dropZoneRefs = useRef<(HTMLDivElement | null)[]>([]);

    const handleDragStart = (id: string) => {
        setDraggingId(id);
    };

    const handleDragEnd = () => {
        if (draggingId !== null) {
            const dropZoneIndex = findNearestDropZone();
            if (dropZoneIndex !== -1) {
                onDragEnd(draggingId, dropZoneIndex);
            }
            setDraggingId(null);
        }
    };

    const findNearestDropZone = () => {
        if (!draggingId) return -1;

        const draggingElement = document.getElementById(draggingId);
        if (!draggingElement) return -1;

        const draggingRect = draggingElement.getBoundingClientRect();
        const draggingCenter = {
            x: draggingRect.left + draggingRect.width / 2,
            y: draggingRect.top + draggingRect.height / 2
        };

        let nearestIndex = -1;
        let minDistance = Infinity;

        dropZoneRefs.current.forEach((dropZone, index) => {
            if (dropZone) {
                const dropZoneRect = dropZone.getBoundingClientRect();
                const dropZoneCenter = {
                    x: dropZoneRect.left + dropZoneRect.width / 2,
                    y: dropZoneRect.top + dropZoneRect.height / 2
                };
                const distance = Math.sqrt(
                    Math.pow(dropZoneCenter.x - draggingCenter.x, 2) +
                    Math.pow(dropZoneCenter.y - draggingCenter.y, 2)
                );
                if (distance < minDistance) {
                    minDistance = distance;
                    nearestIndex = index;
                }
            }
        });

        return nearestIndex;
    };

    const DropZone = ({ index }: { index: number }) => (
        <AnimatePresence>
            {isEditMode && (
                <motion.div
                    ref={(el) => (dropZoneRefs.current[index] = el)}
                    initial={{ height: 0, opacity: 0 }}

                    animate={{
                        height: draggingId ? '20px' : '10px',
                        opacity: draggingId ? 1 : 0.5,
                        backgroundColor: draggingId ? 'rgba(0, 100, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
                    }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    style={{
                        margin: '5px 0',
                        borderRadius: '4px',
                        width: '100%',
                    }}
                />
            )}
        </AnimatePresence>
    );

    return (
        <Box
            display="grid"
            gridTemplateColumns="repeat(auto-fill, minmax(250px, 1fr))"
            gap={4}
            width="100%"
        >
            {cards.map((card, index) => (
                <React.Fragment key={card.id} >
                    <Box position={"relative"} >
                        <DropZone index={index} />
                        <Card
                            id={card.id}
                            title={card.title}
                            url={card.url}
                            favicon={card.favicon}
                            onDragStart={() => handleDragStart(card.id)}
                            onDragEnd={handleDragEnd}
                            index={index}
                            isEditMode={isEditMode}
                            onUpdate={onUpdateCard}
                        />
                    </Box>

                </React.Fragment>
            ))}
            <DropZone index={cards.length} />
        </Box>
    );
};

export default CardList;