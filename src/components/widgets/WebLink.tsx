import React, { useEffect, useState } from "react";
import {
  Box,
  Input,
  VStack,
  Text,
  Image,
  Link,
  Button,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import WidgetBase from "../WidgetBase";
import { useLocalStorage } from "../../lib/useLocalStorage";

interface WebLinkProps {
  id: string;
  editMode: boolean;
}

const WebLink: React.FC<WebLinkProps> = ({ id, editMode }) => {
  const [url, setUrl] = useLocalStorage(`weblink_${id}_url`, "");
  const [title, setTitle] = useLocalStorage(`weblink_${id}_title`, "");
  const [favicon, setFavicon] = useLocalStorage(`weblink_${id}_favicon`, "");
  const [description, setDescription] = useLocalStorage(
    `weblink_${id}_description`,
    ""
  );
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const isValidUrl = (urlString: string): boolean => {
    try {
      new URL(urlString);
      return true;
    } catch (e) {
      return false;
    }
  };

  const fetchSiteInfo = async (urlString: string) => {
    if (!isValidUrl(urlString)) {
      toast({
        title: "Invalid URL",
        description:
          "Please enter a valid URL including the protocol (e.g., https://)",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `https://api.allorigins.win/get?url=${encodeURIComponent(urlString)}`
      );
      const data = await response.json();
      const html = data.contents;

      // Extract title
      const titleMatch = html.match(/<title>(.*?)<\/title>/i);
      setTitle(titleMatch ? titleMatch[1] : new URL(urlString).hostname);

      // Extract favicon
      const faviconMatch = html.match(
        /<link[^>]*rel=["'](?:shortcut )?icon["'][^>]*href=["']([^"']+)["'][^>]*>/i
      );
      if (faviconMatch) {
        let faviconUrl = faviconMatch[1];
        if (faviconUrl.startsWith("/")) {
          faviconUrl = new URL(faviconUrl, urlString).href;
        }
        setFavicon(faviconUrl);
      } else {
        setFavicon(`https://www.google.com/s2/favicons?domain=${urlString}`);
      }

      // Extract description
      const descriptionMatch = html.match(
        /<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["'][^>]*>/i
      );
      setDescription(descriptionMatch ? descriptionMatch[1] : "");

      toast({
        title: "Site information fetched successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error fetching site information:", error);
      setTitle(new URL(urlString).hostname);
      setFavicon(`https://www.google.com/s2/favicons?domain=${urlString}`);
      setDescription("");
      toast({
        title: "Error fetching site information",
        description: "Using default values",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (url && isValidUrl(url) && (!title || !favicon || !description)) {
      fetchSiteInfo(url);
    }
  }, [url]);

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  };

  const handleRefresh = () => {
    if (url) {
      fetchSiteInfo(url);
    }
  };

  const settings = (
    <VStack spacing={4} align="stretch">
      <Text>Website URL:</Text>
      <Input
        value={url}
        onChange={handleUrlChange}
        placeholder="https://www.example.com"
      />
      <Button
        onClick={handleRefresh}
        isLoading={isLoading}
        isDisabled={!isValidUrl(url)}
      >
        Refresh Site Info
      </Button>
    </VStack>
  );

  const content = (
    <Link
      href={isValidUrl(url) ? url : "#"}
      isExternal={!editMode && isValidUrl(url)}
    >
      <VStack spacing={2} align="center">
        {isLoading ? (
          <Spinner />
        ) : (
          <>
            {favicon && (
              <Image src={favicon} alt="Site favicon" boxSize="32px" />
            )}
            <Text fontSize="lg" fontWeight="bold">
              {title ||
                (isValidUrl(url) ? new URL(url).hostname : "Invalid URL")}
            </Text>
            {description && (
              <Text fontSize="sm" color="gray.600" noOfLines={2}>
                {description}
              </Text>
            )}
            {isValidUrl(url) && (
              <Text fontSize="sm" color="gray.500">
                {new URL(url).pathname + new URL(url).search}
              </Text>
            )}
          </>
        )}
      </VStack>
    </Link>
  );

  return (
    <WidgetBase editMode={editMode} settings={settings}>
      <Box p={4}>{content}</Box>
    </WidgetBase>
  );
};

export default WebLink;
