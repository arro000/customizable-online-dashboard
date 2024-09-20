import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  VStack,
  HStack,
  Text,
  Link,
  Image,
  IconButton,
  Spinner,
  SimpleGrid,
  Divider,
  useToast,
  Switch,
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Input,
  Button,
} from "@chakra-ui/react";
import { RepeatIcon, SettingsIcon } from "@chakra-ui/icons";
import withWidgetBase from "../hooks/withWidgetBase";
import { WidgetConfig, WidgetProps } from "../../interfaces/widget";
import DOMPurify from "dompurify";

interface FeedItem {
  title: string;
  link: string;
  pubDate: string;
  description: string;
  thumbnail: string;
}

interface NewsCardConfig extends WidgetConfig {
  feeds: string[];
  refreshInterval: number;
  showImages: boolean;
  showDescriptions: boolean;
  maxItems: number;
}

const defaultConfig: NewsCardConfig = {
  feeds: [],
  refreshInterval: 300000, // 5 minutes
  showImages: true,
  showDescriptions: true,
  maxItems: 6,
  id: "",
  i: "",
  x: 0,
  y: 0,
  w: 0,
  h: 0,
  component: "NewsCard",
};

const NewsCardContent: React.FC<WidgetProps<NewsCardConfig>> = ({
  config,
  onConfigChange,
}) => {
  const [news, setNews] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const toast = useToast();

  const fetchFeed = async (url: string) => {
    const response = await fetch(
      `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(url)}`
    );
    if (!response.ok) {
      throw new Error(`Error fetching feed: ${url}`);
    }
    const data = await response.json();
    return data.items.map((item: any) => ({
      title: item.title,
      link: item.link,
      pubDate: new Date(item.pubDate).toISOString(),
      description: item.description,
      thumbnail: item.thumbnail,
    }));
  };

  const fetchAllFeeds = useCallback(async () => {
    if (!config || config.feeds.length === 0) {
      setNews([]);
      return;
    }

    setLoading(true);
    setError("");
    try {
      const allItems = await Promise.all(config.feeds.map(fetchFeed));
      const flattenedItems = allItems.flat();
      const sortedItems = flattenedItems.sort(
        (a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
      );
      setNews(sortedItems.slice(0, config.maxItems));
    } catch (err) {
      setError("Error fetching feeds. Please check the URLs.");
      toast({
        title: "Error fetching feeds",
        description: "Please check your feed URLs and try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  }, [config, toast]);

  useEffect(() => {
    fetchAllFeeds();
    const interval = setInterval(
      fetchAllFeeds,
      config?.refreshInterval || 300000
    );
    return () => clearInterval(interval);
  }, [config?.feeds, config?.refreshInterval, fetchAllFeeds]);

  const handleRefresh = () => {
    fetchAllFeeds();
    toast({
      title: "Refreshing feeds",
      description: "Fetching the latest news...",
      status: "info",
      duration: 2000,
      isClosable: true,
    });
  };

  if (!config) {
    return <Spinner size="xl" />;
  }

  return (
    <Box p={4} overflow="auto">
      <VStack align="stretch" spacing={4}>
        <HStack justifyContent="space-between">
          <Text fontSize="xl" fontWeight="bold">
            RSS News Feed
          </Text>
          <IconButton
            aria-label="Refresh news"
            icon={<RepeatIcon />}
            onClick={handleRefresh}
            isDisabled={loading}
            size="sm"
          />
        </HStack>

        <Divider />

        {loading && (
          <Box textAlign="center" py={4}>
            <Spinner size="lg" />
          </Box>
        )}

        {error && (
          <Box bg="red.100" color="red.700" p={3} borderRadius="md">
            <Text>{error}</Text>
          </Box>
        )}

        {!loading && !error && news.length === 0 && (
          <Box textAlign="center" py={4}>
            <Text>
              No news available. Try adding some RSS feeds in the settings.
            </Text>
          </Box>
        )}

        {!loading && !error && news.length > 0 && (
          <SimpleGrid columns={[1, 2, 3]} spacing={4}>
            {news.map((item, index) => (
              <Box
                key={index}
                borderWidth="1px"
                borderRadius="md"
                overflow="hidden"
              >
                {config.showImages && item.thumbnail && (
                  <Image
                    src={item.thumbnail}
                    alt={item.title}
                    objectFit="cover"
                    height="150px"
                    width="100%"
                  />
                )}
                <Box p={3}>
                  <Link href={item.link} isExternal fontWeight="medium">
                    <Text noOfLines={2}>{item.title}</Text>
                  </Link>
                  {config.showDescriptions && (
                    <div
                      dangerouslySetInnerHTML={DOMPurify.sanitize(
                        item.description
                      )}
                    />
                  )}
                  <Text fontSize="xs" color="gray.500" mt={2}>
                    {new Date(item.pubDate).toLocaleString()}
                  </Text>
                </Box>
              </Box>
            ))}
          </SimpleGrid>
        )}
      </VStack>
    </Box>
  );
};

const NewsCardOptions: React.FC<WidgetProps<NewsCardConfig>> = ({
  config,
  onConfigChange,
}) => {
  const [newFeed, setNewFeed] = useState("");
  const toast = useToast();

  if (!config) {
    return <Spinner />;
  }

  const addFeed = () => {
    if (newFeed && !config.feeds.includes(newFeed)) {
      const updatedFeeds = [...config.feeds, newFeed];
      onConfigChange({ feeds: updatedFeeds });
      setNewFeed("");
      toast({
        title: "Feed added",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const removeFeed = (feedToRemove: string) => {
    const updatedFeeds = config.feeds.filter((feed) => feed !== feedToRemove);
    onConfigChange({ feeds: updatedFeeds });
    toast({
      title: "Feed removed",
      status: "info",
      duration: 2000,
      isClosable: true,
    });
  };

  return (
    <VStack align="start" spacing={4}>
      <FormControl display="flex" alignItems="center">
        <FormLabel htmlFor="show-images" mb="0">
          Show Images
        </FormLabel>
        <Switch
          id="show-images"
          isChecked={config.showImages}
          onChange={(e) => onConfigChange({ showImages: e.target.checked })}
        />
      </FormControl>

      <FormControl display="flex" alignItems="center">
        <FormLabel htmlFor="show-descriptions" mb="0">
          Show Descriptions
        </FormLabel>
        <Switch
          id="show-descriptions"
          isChecked={config.showDescriptions}
          onChange={(e) =>
            onConfigChange({ showDescriptions: e.target.checked })
          }
        />
      </FormControl>

      <FormControl>
        <FormLabel htmlFor="max-items">Max Items</FormLabel>
        <NumberInput
          id="max-items"
          value={config.maxItems}
          onChange={(_, value) => onConfigChange({ maxItems: value })}
          min={1}
          max={20}
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </FormControl>

      <FormControl>
        <FormLabel htmlFor="refresh-interval">Refresh Interval (ms)</FormLabel>
        <NumberInput
          id="refresh-interval"
          value={config.refreshInterval}
          onChange={(_, value) => onConfigChange({ refreshInterval: value })}
          min={5000}
          step={1000}
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </FormControl>

      <Divider />

      <Text fontWeight="bold">RSS Feeds:</Text>
      <VStack align="stretch" width="100%">
        <HStack>
          <Input
            placeholder="Add a new RSS feed URL"
            value={newFeed}
            onChange={(e) => setNewFeed(e.target.value)}
          />
          <Button onClick={addFeed}>Add</Button>
        </HStack>
        {config.feeds.map((feed, index) => (
          <HStack key={index} justifyContent="space-between">
            <Text isTruncated>{feed}</Text>
            <Button size="sm" onClick={() => removeFeed(feed)}>
              Remove
            </Button>
          </HStack>
        ))}
      </VStack>
    </VStack>
  );
};

const NewsCard = withWidgetBase<NewsCardConfig>({
  renderWidget: (props) => <NewsCardContent {...props} />,
  renderOptions: (props) => <NewsCardOptions {...props} />,
  defaultConfig,
});

export default NewsCard;
