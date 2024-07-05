import React, { useState, useEffect, useRef } from "react";
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
} from "@chakra-ui/react";
import WidgetBase from "../WidgetBase";

interface Note {
  frequency: number;
  duration: number;
}

const MoodMusicMixer: React.FC = () => {
  const [text, setText] = useState("");
  const [mood, setMood] = useState(0);
  const [melody, setMelody] = useState<Note[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [tempo, setTempo] = useState(120);

  const audioContext = useRef<AudioContext | null>(null);
  const bgColor = useColorModeValue("gray.100", "gray.700");
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

  const analyzeMood = () => {
    // Semplice analisi del sentiment basata sulle parole chiave
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

    const words = text.toLowerCase().split(/\s+/);
    const happyScore = words.filter((word) => happyWords.includes(word)).length;
    const sadScore = words.filter((word) => sadWords.includes(word)).length;

    const newMood = (happyScore - sadScore) / words.length;
    setMood(newMood);
    generateMelody(newMood);
  };

  const generateMelody = (moodScore: number) => {
    const baseFrequency = 261.63; // C4
    const scale =
      moodScore > 0
        ? [0, 2, 4, 5, 7, 9, 11] // Major scale
        : [0, 2, 3, 5, 7, 8, 10]; // Minor scale

    const newMelody: Note[] = [];
    for (let i = 0; i < 8; i++) {
      const scaleIndex = Math.floor(Math.random() * scale.length);
      const octave = Math.floor(Math.random() * 2);
      const frequency =
        baseFrequency * Math.pow(2, (scale[scaleIndex] + octave * 12) / 12);
      const duration = Math.random() * 0.3 + 0.1;
      newMelody.push({ frequency, duration });
    }
    setMelody(newMelody);
  };

  const playMelody = () => {
    if (!audioContext.current) return;
    setIsPlaying(true);

    let startTime = audioContext.current.currentTime;
    melody.forEach((note) => {
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

    setTimeout(() => setIsPlaying(false), startTime * 1000);
  };

  return (
    <WidgetBase>
      <VStack spacing={4} align="stretch">
        <Text fontSize="2xl" fontWeight="bold" color={textColor}>
          Mood Music Mixer
        </Text>
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Scrivi qualcosa sul tuo umore..."
          resize="vertical"
          minHeight="100px"
        />
        <Button onClick={analyzeMood} colorScheme="blue">
          Analizza Umore e Genera Melodia
        </Button>
        <Text color={textColor}>
          Umore rilevato: {mood.toFixed(2)} (
          {mood > 0 ? "Positivo" : "Negativo"})
        </Text>
        <HStack>
          <Text color={textColor}>Tempo: {tempo} BPM</Text>
          <Slider value={tempo} min={60} max={180} step={1} onChange={setTempo}>
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb />
          </Slider>
        </HStack>
        <Button
          onClick={playMelody}
          isDisabled={melody.length === 0 || isPlaying}
          colorScheme="green"
        >
          {isPlaying ? "Riproduzione in corso..." : "Riproduci Melodia"}
        </Button>
      </VStack>
    </WidgetBase>
  );
};

export default MoodMusicMixer;
