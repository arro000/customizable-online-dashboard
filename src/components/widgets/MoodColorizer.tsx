import React, { useCallback } from "react";
import {
  Box,
  Text,
  VStack,
  Select,
  useColorModeValue,
  Button,
} from "@chakra-ui/react";
import withWidgetBase from "../hooks/withWidgetBase";
import { WidgetProps } from "../../interfaces/widget";

interface MoodColor {
  [key: string]: string;
}

const moodColors: MoodColor = {
  happy: "yellow.200",
  sad: "blue.200",
  excited: "orange.200",
  calm: "green.200",
  angry: "red.200",
  confused: "purple.200",
  tired: "gray.200",
  inspired: "cyan.200",
  anxious: "teal.200",
  mischievous: "pink.200",
  confident: "gold.200",
  curious: "lime.200",
};

const moodPhrases: { [key: string]: string[] } = {
  happy: [
    "You're shining brighter than a disco ball!",
    "Your smile could power a small city!",
    "You're so cheerful, flowers are jealous!",
    "Happiness looks gorgeous on you!",
    "You're walking on sunshine, and don't it feel good?",
  ],
  sad: [
    "Cheer up, even rain clouds get tired and go away!",
    "You're just having a bad day, not a bad life!",
    "Remember, every cloud has a silver lining... and free water!",
    "It's okay to be sad. Your tears are watering the seeds of your future happiness.",
    "You're not alone. Even the Mona Lisa has off days.",
  ],
  excited: [
    "Calm down! You're more hyper than a squirrel on espresso!",
    "Your enthusiasm is so contagious, it should be quarantined!",
    "You're so excited, you make caffeine look like a sedative!",
    "Whoa there, Tigger! Save some bounce for the rest of us!",
    "Your excitement could power a rocket to the moon and back!",
  ],
  calm: [
    "You're so zen, Buddha is asking for tips!",
    "Your calmness is making waves... very small, peaceful waves.",
    "You're so relaxed, sloths think you're their spirit animal!",
    "If tranquility were an Olympic sport, you'd be a gold medalist.",
    "Your inner peace is so strong, it's causing world peace!",
  ],
  angry: [
    "Take a deep breath. Count to ten. If that doesn't work, try pi.",
    "You're so hot-headed, you could fry an egg on your forehead!",
    "Your anger is valid, but have you tried turning it off and on again?",
    "You're not angry, you're just passionate about being displeased.",
    "Channel that anger into productivity. You could probably build a house with all that energy!",
  ],
  confused: [
    "You're so confused, even your confusion is confused!",
    "Don't worry, being confused means you're still learning.",
    "You're not confused, you're just too smart for simple answers.",
    "Confusion is the first step to understanding. You're on your way!",
    "Your brain isn't confused, it's just doing complex yoga poses.",
  ],
  tired: [
    "You're so tired, coffee is asking YOU for a boost!",
    "Even your yawns are yawning.",
    "You're not tired, you're just operating in power-saving mode.",
    "Your energy levels are so low, sloths are offering you pep talks.",
    "Don't worry, being tired means you've been awesome all day!",
  ],
  inspired: [
    "Your ideas are so bright, I need sunglasses!",
    "You're on fire! (Not literally, thankfully.)",
    "Your creativity is off the charts. Time to buy a bigger chart!",
    "You're so inspired, even muses are taking notes.",
    "Watch out world, a genius is having a lightbulb moment!",
  ],
  anxious: [
    "Take a deep breath. Your anxiety is lying to you.",
    "You're stronger than your anxiety. And probably stronger than a small horse.",
    "Your anxiety is just excitement in disguise. You're secretly thrilled about everything!",
    "Anxiety is your body's way of saying, 'Hey, I really care about this!'",
    "You've got this. Your anxiety doesn't stand a chance against your awesomeness.",
  ],
  mischievous: [
    "I see that twinkle in your eye. What are you planning?",
    "You're so mischievous, even troublemakers are taking notes.",
    "That grin of yours is making angels nervous.",
    "I bet you're the reason why we can't have nice things!",
    "Your mischief managed to make Loki jealous.",
  ],
  confident: [
    "Your confidence is so high, mountains look up to you!",
    "You're not confident, you're con-fantastic!",
    "With that level of confidence, you could probably convince water to run uphill.",
    "Your self-assurance is making the sun feel insecure about its brightness.",
    "You're so sure of yourself, doubt is doubting itself around you.",
  ],
  curious: [
    "Your curiosity could give cats a run for their money!",
    "You're so curious, even mysteries want to solve you.",
    "Your thirst for knowledge is making libraries nervous.",
    "With that level of curiosity, you'll probably discover a new element soon.",
    "You're not nosy, you're just collecting information for your autobiography!",
  ],
};

interface MoodColorizerConfig {
  mood: string;
  phrase: string;
}

const defaultConfig: MoodColorizerConfig = {
  mood: "happy",
  phrase: moodPhrases.happy[0],
};

const MoodColorizerContent: React.FC<WidgetProps<MoodColorizerConfig>> = ({
  config: rawConfig,
  onConfigChange,
}) => {
  const config = rawConfig ?? defaultConfig;
  const bgColor = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  const handleMoodChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const newMood = event.target.value;
      const phrases = moodPhrases[newMood];
      const newPhrase = phrases[Math.floor(Math.random() * phrases.length)];
      onConfigChange({ mood: newMood, phrase: newPhrase });
    },
    [onConfigChange]
  );

  const generateNewPhrase = useCallback(() => {
    const phrases = moodPhrases[config.mood];
    const newPhrase = phrases[Math.floor(Math.random() * phrases.length)];
    onConfigChange({ phrase: newPhrase });
  }, [config.mood, onConfigChange]);

  return (
    <Box p={4}>
      <VStack spacing={4} align="stretch">
        <Text fontSize="xl" fontWeight="bold">
          Mood Colorizer
        </Text>
        <Select value={config.mood} onChange={handleMoodChange}>
          {Object.keys(moodColors).map((moodOption) => (
            <option key={moodOption} value={moodOption}>
              {moodOption.charAt(0).toUpperCase() + moodOption.slice(1)}
            </option>
          ))}
        </Select>
        <Box
          bg={moodColors[config.mood]}
          p={4}
          borderRadius="md"
          minHeight="100px"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Text textAlign="center" fontWeight="bold">
            {config.phrase}
          </Text>
        </Box>
        <Button onClick={generateNewPhrase}>New Phrase</Button>
      </VStack>
    </Box>
  );
};

const MoodColorizer = withWidgetBase<MoodColorizerConfig>({
  renderWidget: (props) => <MoodColorizerContent {...props} />,
  renderOptions: () => null,
  defaultConfig,
});

export default MoodColorizer;
