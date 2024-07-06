import React, { useState, useCallback, useEffect } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import { Box, Button, VStack, HStack, Text, useToast } from "@chakra-ui/react";
import WidgetBase from "../WidgetBase";
import { useLocalStorage } from "../../lib/useLocalStorage";

interface ChessWidgetProps {
  id: string;
  editMode: boolean;
}

interface ChessConfig {
  fen: string;
}

const INITIAL_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

const ChessWidget: React.FC<ChessWidgetProps> = ({ id, editMode }) => {
  const [config, setConfig] = useLocalStorage<ChessConfig>(
    `chessWidget_${id}`,
    {
      fen: INITIAL_FEN,
    }
  );
  const [game, setGame] = useState<Chess>(new Chess());
  const toast = useToast();

  useEffect(() => {
    const newGame = new Chess();
    try {
      newGame.load(config.fen);
      setGame(newGame);
    } catch (error) {
      console.error("Invalid FEN, resetting to initial position", error);
      newGame.load(INITIAL_FEN);
      setGame(newGame);
      setConfig({ fen: INITIAL_FEN });
    }
  }, [config.fen, setConfig]);

  const makeAMove = useCallback(
    (move: any) => {
      const gameCopy = new Chess(game.fen());
      try {
        const result = gameCopy.move(move);
        if (result) {
          setGame(gameCopy);
          setConfig({ fen: gameCopy.fen() });
          return true;
        }
      } catch (error) {
        return false;
      }
      return false;
    },
    [game, setConfig]
  );

  const onDrop = useCallback(
    (sourceSquare: string, targetSquare: string) => {
      const move = makeAMove({
        from: sourceSquare,
        to: targetSquare,
        promotion: "q", // always promote to a queen for simplicity
      });

      if (!move) {
        return false;
      }

      if (game.isGameOver()) {
        let status = "";
        if (game.isCheckmate()) status = "Scacco matto!";
        else if (game.isDraw()) status = "Patta!";
        else if (game.isStalemate()) status = "Stallo!";
        toast({
          title: "Partita terminata",
          description: status,
          status: "info",
          duration: 3000,
          isClosable: true,
        });
      }

      return true;
    },
    [game, makeAMove, toast]
  );

  const resetBoard = () => {
    const newGame = new Chess();
    setGame(newGame);
    setConfig({ fen: newGame.fen() });
  };

  const undoMove = () => {
    const gameCopy = new Chess(game.fen());
    gameCopy.undo();
    setGame(gameCopy);
    setConfig({ fen: gameCopy.fen() });
  };

  const renderSettings = () => (
    <VStack spacing={4} align="stretch">
      <Text fontWeight="bold">Impostazioni Scacchi</Text>
      <Button onClick={resetBoard} colorScheme="blue">
        Resetta la scacchiera
      </Button>
      <Button
        onClick={undoMove}
        colorScheme="yellow"
        isDisabled={game.history().length === 0}
      >
        Annulla ultima mossa
      </Button>
    </VStack>
  );

  const renderContent = () => (
    <Box
      width="100%"
      height="100%"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      <Chessboard
        position={game.fen()}
        onPieceDrop={onDrop}
        boardWidth={Math.min(400, window.innerWidth - 40)}
      />
      <VStack mt={4} spacing={2}>
        <Text>Turno: {game.turn() === "w" ? "Bianco" : "Nero"}</Text>
        <Text>Mosse: {Math.floor(game.moveNumber() / 2)}</Text>
        {game.isCheck() && <Text color="red">Scacco!</Text>}
      </VStack>
    </Box>
  );

  return (
    <WidgetBase editMode={editMode} settings={renderSettings()}>
      {renderContent()}
    </WidgetBase>
  );
};

export default ChessWidget;
