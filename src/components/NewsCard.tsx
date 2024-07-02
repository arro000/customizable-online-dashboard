import React, { useState, useEffect } from 'react';
import { Box, Text, VStack, Input, Button, UnorderedList, ListItem, Link, IconButton, Spinner, HStack } from '@chakra-ui/react';
import { SettingsIcon, RepeatIcon } from '@chakra-ui/icons';

interface FeedItem {
    title: string;
    link: string;
    pubDate: string;
}

const NewsCard: React.FC = () => {
    const [feeds, setFeeds] = useState<string[]>([]);
    const [newFeed, setNewFeed] = useState('');
    const [news, setNews] = useState<FeedItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showSettings, setShowSettings] = useState(false);

    useEffect(() => {
        const savedFeeds = localStorage.getItem('rssFeeds');
        if (savedFeeds) {
            const parsedFeeds = JSON.parse(savedFeeds);
            setFeeds(parsedFeeds);
            fetchAllFeeds(parsedFeeds);
        }
    }, []);

    const addFeed = () => {
        if (newFeed && !feeds.includes(newFeed)) {
            const updatedFeeds = [...feeds, newFeed];
            setFeeds(updatedFeeds);
            setNewFeed('');
            localStorage.setItem('rssFeeds', JSON.stringify(updatedFeeds));
            fetchAllFeeds(updatedFeeds);
        }
    };

    const removeFeed = (feedToRemove: string) => {
        const updatedFeeds = feeds.filter(feed => feed !== feedToRemove);
        setFeeds(updatedFeeds);
        localStorage.setItem('rssFeeds', JSON.stringify(updatedFeeds));
        fetchAllFeeds(updatedFeeds);
    };

    const fetchFeed = async (url: string) => {
        const response = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(url)}`);
        if (!response.ok) {
            throw new Error(`Errore nel recupero del feed: ${url}`);
        }
        const data = await response.json();
        return data.items.map((item: any) => ({
            title: item.title,
            link: item.link,
            pubDate: new Date(item.pubDate).toISOString(),
        }));
    };

    const fetchAllFeeds = async (feedUrls: string[]) => {
        setLoading(true);
        setError('');
        try {
            const allItems = await Promise.all(feedUrls.map(fetchFeed));
            const flattenedItems = allItems.flat();
            const sortedItems = flattenedItems.sort((a, b) =>
                new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
            );
            setNews(sortedItems.slice(0, 10));
        } catch (err) {
            setError('Errore nel recupero dei feed. Verifica gli URL.');
        } finally {
            setLoading(false);
        }
    };

    const refetchNews = () => {
        fetchAllFeeds(feeds);
    };

    return (
        <Box borderWidth="1px" borderRadius="lg" p={4} width="300px" position="relative">
            <HStack position="absolute" top={2} right={2}>
                <IconButton
                    aria-label="Aggiorna notizie"
                    icon={<RepeatIcon />}
                    size="sm"
                    onClick={refetchNews}
                    isDisabled={loading}
                />
                <IconButton
                    aria-label="Impostazioni"
                    icon={<SettingsIcon />}
                    size="sm"
                    onClick={() => setShowSettings(!showSettings)}
                />
            </HStack>
            <VStack align="start" spacing={4}>
                <Text fontSize="xl" fontWeight="bold">Notizie RSS</Text>
                {showSettings ? (
                    <>
                        <Input
                            placeholder="Aggiungi un nuovo feed RSS"
                            value={newFeed}
                            onChange={(e) => setNewFeed(e.target.value)}
                        />
                        <Button onClick={addFeed} isDisabled={loading}>
                            Aggiungi Feed
                        </Button>
                        <Text fontWeight="bold">Feed attivi:</Text>
                        <UnorderedList>
                            {feeds.map((feed, index) => (
                                <ListItem key={index}>
                                    {feed}
                                    <Button size="xs" ml={2} onClick={() => removeFeed(feed)}>
                                        Rimuovi
                                    </Button>
                                </ListItem>
                            ))}
                        </UnorderedList>
                    </>
                ) : (
                    <>
                        {loading && <Spinner />}
                        {error && <Text color="red.500">{error}</Text>}
                        {news.length > 0 ? (
                            <UnorderedList>
                                {news.map((item, index) => (
                                    <ListItem key={index}>
                                        <Link href={item.link} isExternal>
                                            {item.title}
                                        </Link>
                                    </ListItem>
                                ))}
                            </UnorderedList>
                        ) : (
                            <Text>Nessuna notizia disponibile</Text>
                        )}
                    </>
                )}
            </VStack>
        </Box>
    );
};

export default NewsCard;