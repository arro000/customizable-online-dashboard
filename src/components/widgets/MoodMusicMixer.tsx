import React, { useCallback, useEffect, useRef } from "react";
import {
  Box,
  VStack,
  Text,
  Textarea,
  Button,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  HStack,
  useColorModeValue,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from "@chakra-ui/react";
import withWidgetBase from "../hooks/withWidgetBase";
import { WidgetProps } from "../../interfaces/widget";

interface Note {
  frequency: number;
  duration: number;
}

interface MoodMusicMixerConfig {
  text: string;
  mood: number | null;
  melody: Note[];
  isPlaying: boolean;
  tempo: number;
  maxMelodyLength: number;
}

const defaultConfig: MoodMusicMixerConfig = {
  text: "",
  mood: null,
  melody: [],
  isPlaying: false,
  tempo: 120,
  maxMelodyLength: 8,
};

const MoodMusicMixerContent: React.FC<WidgetProps<MoodMusicMixerConfig>> = ({
  config: rawConfig,
  onConfigChange,
}) => {
  // Inizializza config con valori di default se non è definito
  const config: MoodMusicMixerConfig = rawConfig ?? defaultConfig;

  const audioContext = useRef<AudioContext | null>(null);
  const textColor = useColorModeValue("gray.800", "gray.100");

  useEffect(() => {
    audioContext.current = new (window.AudioContext ||
      (window as any).webkitAudioContext)();
    return () => {
      if (audioContext.current) {
        audioContext.current.close();
      }
    };
  }, []);

  const analyzeMood = useCallback(() => {
    const happyWords = [
      "felice",
      "gioioso",
      "entusiasta",
      "eccitato",
      "ottimista",
    ];
    const sadWords = [
      "triste",
      "depresso",
      "infelice",
      "deluso",
      "sconfortato",
    ];

    const words = config.text.toLowerCase().split(/\s+/);
    const happyScore = words.filter((word) => happyWords.includes(word)).length;
    const sadScore = words.filter((word) => sadWords.includes(word)).length;

    const newMood =
      words.length > 0 ? (happyScore - sadScore) / words.length : 0;
    const newMelody = generateMelody(newMood, config.maxMelodyLength);
    onConfigChange({ mood: newMood, melody: newMelody });
  }, [config.text, config.maxMelodyLength, onConfigChange]);

  const generateMelody = (moodScore: number, length: number): Note[] => {
    const baseFrequency = 261.63; // C4
    const scale =
      moodScore > 0 ? [0, 2, 4, 5, 7, 9, 11] : [0, 2, 3, 5, 7, 8, 10];

    return Array.from({ length }, () => {
      const scaleIndex = Math.floor(Math.random() * scale.length);
      const octave = Math.floor(Math.random() * 2);
      const frequency =
        baseFrequency * Math.pow(2, (scale[scaleIndex] + octave * 12) / 12);
      const duration = Math.random() * 0.3 + 0.1;
      return { frequency, duration };
    });
  };

  const playMelody = useCallback(() => {
    if (!audioContext.current) return;
    onConfigChange({ isPlaying: true });

    let startTime = audioContext.current.currentTime;
    config.melody?.forEach((note) => {
      const oscillator = audioContext.current!.createOscillator();
      const gainNode = audioContext.current!.createGain();

      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(note.frequency, startTime);

      gainNode.gain.setValueAtTime(0.5, startTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        startTime + note.duration
      );

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.current!.destination);

      oscillator.start(startTime);
      oscillator.stop(startTime + note.duration);

      startTime += note.duration;
    });

    setTimeout(() => onConfigChange({ isPlaying: false }), startTime * 1000);
  }, [config.melody, onConfigChange]);

  return (
    <Box p={4}>
      <VStack spacing={4} align="stretch">
        <Text fontSize="2xl" fontWeight="bold" color={textColor}>
          Mood Music Mixer
        </Text>
        <Textarea
          value={config.text}
          onChange={(e) => onConfigChange({ text: e.target.value })}
          placeholder="Scrivi qualcosa sul tuo umore..."
          resize="vertical"
          minHeight="100px"
        />
        <Button onClick={analyzeMood} colorScheme="blue">
          Analizza Umore e Genera Melodia
        </Button>
        {config.mood && (
          <Text color={textColor}>
            Umore rilevato: {config.mood.toFixed(2)} (
            {config.mood > 0 ? "Positivo" : "Negativo"})
          </Text>
        )}
        <Button
          onClick={playMelody}
          isDisabled={config.melody?.length === 0 || config.isPlaying}
          colorScheme="green"
        >
          {config.isPlaying ? "Riproduzione in corso..." : "Riproduci Melodia"}
        </Button>
      </VStack>
    </Box>
  );
};

const MoodMusicMixerOptions: React.FC<WidgetProps<MoodMusicMixerConfig>> = ({
  config: rawConfig,
  onConfigChange,
}) => {
  // Inizializza config con valori di default se non è definito
  const config: MoodMusicMixerConfig = rawConfig ?? defaultConfig;

  const textColor = useColorModeValue("gray.800", "gray.100");

  return (
    <Box p={4}>
      <VStack spacing={4} align="stretch">
        <Text fontSize="xl" fontWeight="bold" color={textColor}>
          Opzioni Mood Music Mixer
        </Text>
        <HStack>
          <Text color={textColor}>Tempo: {config.tempo} BPM</Text>
          <Slider
            value={config.tempo}
            min={60}
            max={180}
            step={1}
            onChange={(value) => onConfigChange({ tempo: value })}
          >
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb />
          </Slider>
        </HStack>
        <HStack>
          <Text color={textColor}>Lunghezza massima melodia:</Text>
          <NumberInput
            value={config.maxMelodyLength}
            min={4}
            max={16}
            step={1}
            onChange={(_, value) => onConfigChange({ maxMelodyLength: value })}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </HStack>
      </VStack>
    </Box>
  );
};

const MoodMusicMixer = withWidgetBase<MoodMusicMixerConfig>({
  renderWidget: (props) => <MoodMusicMixerContent {...props} />,
  renderOptions: (props) => <MoodMusicMixerOptions {...props} />,
  defaultConfig,
});

export default MoodMusicMixer;
