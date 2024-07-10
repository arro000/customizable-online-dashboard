import React, { useState, useCallback, useEffect, useRef } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import {
  Box,
  Button,
  VStack,
  HStack,
  Text,
  useToast,
  Select,
} from "@chakra-ui/react";
import withWidgetBase from "../hooks/withWidgetBase";
import { WidgetProps } from "../../interfaces/widget";

interface ChessConfig {
  fen: string;
  gameMode: "pvp" | "pvc";
  difficulty: "easy" | "medium" | "hard";
}

const INITIAL_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

const defaultConfig: ChessConfig = {
  fen: INITIAL_FEN,
  gameMode: "pvp",
  difficulty: "medium",
};

const ChessContent: React.FC<WidgetProps<ChessConfig>> = ({
  config,
  onConfigChange,
}) => {
  const [game, setGame] = useState<Chess>(new Chess(config.fen));
  const [fen, setFen] = useState(config.fen);
  const toast = useToast();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const newGame = new Chess();
    try {
      newGame.load(config.fen);
      setGame(newGame);
      setFen(config.fen);
    } catch (error) {
      console.error("Invalid FEN, resetting to initial position", error);
      newGame.reset();
      setGame(newGame);
      setFen(newGame.fen());
      onConfigChange({ ...config, fen: newGame.fen() });
    }
  }, [config.fen, onConfigChange]);

  const makeAMove = useCallback(
    (move: any) => {
      const gameCopy = new Chess(game.fen());
      try {
        const result = gameCopy.move(move);
        if (result) {
          setGame(gameCopy);
          setFen(gameCopy.fen());
          onConfigChange({ ...config, fen: gameCopy.fen() });
          return true;
        }
      } catch (error) {
        return false;
      }
      return false;
    },
    [game, config, onConfigChange]
  );

  const computerMove = useCallback(() => {
    const gameCopy = new Chess(game.fen());
    const moves = gameCopy.moves();

    if (moves.length > 0) {
      let move;
      switch (config.difficulty) {
        case "easy":
          move = moves[Math.floor(Math.random() * moves.length)];
          break;
        case "medium":
          // Implementa una logica più avanzata per la difficoltà media
          move = moves[Math.floor(Math.random() * moves.length)];
          break;
        case "hard":
          // Implementa una logica ancora più avanzata per la difficoltà difficile
          move = moves[Math.floor(Math.random() * moves.length)];
          break;
        default:
          move = moves[Math.floor(Math.random() * moves.length)];
      }
      makeAMove(move);
    }
  }, [game, config.difficulty, makeAMove]);

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
      } else if (config.gameMode === "pvc") {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(computerMove, 300);
      }

      return true;
    },
    [game, makeAMove, toast, config.gameMode, computerMove]
  );

  return (
    <Box
      width="100%"
      height="100%"
      display="flex"
      minHeight="500px"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      p={4}
      position="absolute"
    >
      <Chessboard />
      <VStack mt={4} spacing={2}>
        <Text>Turno: {game.turn() === "w" ? "Bianco" : "Nero"}</Text>
        <Text>Mosse: {Math.floor(game.moveNumber() / 2)}</Text>
        {game.isCheck() && <Text color="red">Scacco!</Text>}
      </VStack>
    </Box>
  );
};

const ChessOptions: React.FC<WidgetProps<ChessConfig>> = ({
  config,
  onConfigChange,
}) => {
  const resetBoard = () => {
    const newGame = new Chess();
    onConfigChange({ ...config, fen: newGame.fen() });
  };

  const undoMove = () => {
    const gameCopy = new Chess(config.fen);
    gameCopy.undo();
    onConfigChange({ ...config, fen: gameCopy.fen() });
  };

  return (
    <VStack spacing={4} align="stretch" p={4}>
      <Text fontWeight="bold">Impostazioni Scacchi</Text>
      <Select
        value={config.gameMode}
        onChange={(e) =>
          onConfigChange({
            ...config,
            gameMode: e.target.value as "pvp" | "pvc",
          })
        }
      >
        <option value="pvp">Giocatore vs Giocatore</option>
        <option value="pvc">Giocatore vs Computer</option>
      </Select>
      {config.gameMode === "pvc" && (
        <Select
          value={config.difficulty}
          onChange={(e) =>
            onConfigChange({
              ...config,
              difficulty: e.target.value as "easy" | "medium" | "hard",
            })
          }
        >
          <option value="easy">Facile</option>
          <option value="medium">Medio</option>
          <option value="hard">Difficile</option>
        </Select>
      )}
      <Button onClick={resetBoard} colorScheme="blue">
        Resetta la scacchiera
      </Button>
      <Button
        onClick={undoMove}
        colorScheme="yellow"
        isDisabled={new Chess(config.fen).history().length === 0}
      >
        Annulla ultima mossa
      </Button>
    </VStack>
  );
};

const ChessWidget = withWidgetBase<ChessConfig>({
  renderWidget: (props) => <ChessContent {...props} />,
  renderOptions: (props) => <ChessOptions {...props} />,
  defaultConfig,
});

export default ChessWidget;
