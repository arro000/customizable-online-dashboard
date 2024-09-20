import React, { useState, useEffect, useCallback } from "react";
import {
  Input,
  Button,
  UnorderedList,
  useToast,
  Box,
  VStack,
  HStack,
  Text,
  Link,
  IconButton,
  Spinner,
  List,
  ListItem,
  Divider,
} from "@chakra-ui/react";
import { ExternalLinkIcon, RepeatIcon } from "@chakra-ui/icons";
import withWidgetBase from "../hooks/withWidgetBase";
import { WidgetConfig, WidgetProps } from "../../interfaces/widget";

interface FeedItem {
  title: string;
  link: string;
  pubDate: string;
}

interface NewsCardConfig extends WidgetConfig {
  feeds: string[];
  refreshInterval: number;
}

const defaultConfig: NewsCardConfig = {
  feeds: [],
  refreshInterval: 300000,
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
    }));
  };

  const fetchAllFeeds = useCallback(async () => {
    if (!config || config.feeds.length === 0) return;

    setLoading(true);
    setError("");
    try {
      const allItems = await Promise.all(config.feeds.map(fetchFeed));
      const flattenedItems = allItems.flat();
      const sortedItems = flattenedItems.sort(
        (a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
      );
      setNews(sortedItems.slice(0, 20));
    } catch (err) {
      setError("Error fetching feeds. Please check the URLs.");
      toast({
        title: "Error fetching feeds",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  }, [config, toast]);

  useEffect(() => {
    fetchAllFeeds();
    const interval = setInterval(fetchAllFeeds, config.refreshInterval);
    return () => clearInterval(interval);
  }, [config.feeds, config.refreshInterval, fetchAllFeeds]);

  if (!config) {
    return <Spinner />;
  }

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

  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      boxShadow="md"
      p={4}
    >
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
          <List spacing={3}>
            {news.map((item, index) => (
              <ListItem key={index}>
                <HStack alignItems="flex-start">
                  <ExternalLinkIcon mt={1} />
                  <VStack align="start" spacing={0}>
                    <Link href={item.link} isExternal fontWeight="medium">
                      {item.title}
                    </Link>
                    <Text fontSize="sm" color="gray.500">
                      {new Date(item.pubDate).toLocaleString()}
                    </Text>
                  </VStack>
                </HStack>
              </ListItem>
            ))}
          </List>
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
      <Text fontWeight="bold">RSS Feeds:</Text>
      <Input
        placeholder="Add a new RSS feed URL"
        value={newFeed}
        onChange={(e) => setNewFeed(e.target.value)}
      />
      <Button onClick={addFeed}>Add Feed</Button>
      <UnorderedList>
        {config.feeds.map((feed, index) => (
          <ListItem key={index}>
            {feed}
            <Button size="xs" ml={2} onClick={() => removeFeed(feed)}>
              Remove
            </Button>
          </ListItem>
        ))}
      </UnorderedList>
      <Text fontWeight="bold">Refresh Interval (ms):</Text>
      <Input
        type="number"
        value={config.refreshInterval}
        onChange={(e) =>
          onConfigChange({ refreshInterval: Number(e.target.value) })
        }
        min={5000}
      />
    </VStack>
  );
};

const NewsCard = withWidgetBase<NewsCardConfig>({
  renderWidget: (props) => <NewsCardContent {...props} />,
  renderOptions: (props) => <NewsCardOptions {...props} />,
  defaultConfig,
});

export default NewsCard;
