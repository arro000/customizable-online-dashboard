import React, { useCallback, useEffect } from "react";
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
  Textarea,
  Switch,
  HStack,
} from "@chakra-ui/react";
import withWidgetBase from "../hooks/withWidgetBase";
import { WidgetProps } from "../../interfaces/widget";

interface WebLinkConfig {
  url: string;
  title: string;
  favicon: string;
  description: string;
  customTitle: string;
  customDescription: string;
  useCustom: boolean;
}

const defaultConfig: WebLinkConfig = {
  url: "",
  title: "",
  favicon: "",
  description: "",
  customTitle: "",
  customDescription: "",
  useCustom: false,
};

const WebLinkContent: React.FC<WidgetProps<WebLinkConfig>> = ({
  config,
  onConfigChange,
}) => {
  const isValidUrl = (urlString: string): boolean => {
    try {
      new URL(urlString);
      return true;
    } catch (e) {
      return false;
    }
  };

  return (
    <Box p={4}>
      <Link
        href={isValidUrl(config.url) ? config.url : "#"}
        isExternal={isValidUrl(config.url)}
      >
        <VStack spacing={2} align="center">
          {config.favicon && (
            <Image src={config.favicon} alt="Site favicon" boxSize="32px" />
          )}
          <Text fontSize="lg" fontWeight="bold">
            {config.useCustom
              ? config.customTitle || "Custom Title"
              : config.title ||
                (isValidUrl(config.url)
                  ? new URL(config.url).hostname
                  : "Invalid URL")}
          </Text>
          {(config.useCustom
            ? config.customDescription
            : config.description) && (
            <Text fontSize="sm" color="gray.600" noOfLines={2}>
              {config.useCustom ? config.customDescription : config.description}
            </Text>
          )}
          {isValidUrl(config.url) && (
            <Text fontSize="sm" color="gray.500">
              {new URL(config.url).pathname + new URL(config.url).search}
            </Text>
          )}
        </VStack>
      </Link>
    </Box>
  );
};

const WebLinkOptions: React.FC<WidgetProps<WebLinkConfig>> = ({
  config,
  onConfigChange,
}) => {
  const toast = useToast();

  const isValidUrl = (urlString: string): boolean => {
    try {
      new URL(urlString);
      return true;
    } catch (e) {
      return false;
    }
  };

  const fetchSiteInfo = useCallback(
    async (urlString: string) => {
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

      try {
        const response = await fetch(
          `https://api.allorigins.win/get?url=${encodeURIComponent(urlString)}`
        );
        const data = await response.json();
        const html = data.contents;

        // Extract title
        const titleMatch = html.match(/<title>(.*?)<\/title>/i);
        const newTitle = titleMatch
          ? titleMatch[1]
          : new URL(urlString).hostname;

        // Extract favicon
        const faviconMatch = html.match(
          /<link[^>]*rel=["'](?:shortcut )?icon["'][^>]*href=["']([^"']+)["'][^>]*>/i
        );
        let newFavicon = "";
        if (faviconMatch) {
          let faviconUrl = faviconMatch[1];
          if (faviconUrl.startsWith("/")) {
            faviconUrl = new URL(faviconUrl, urlString).href;
          }
          newFavicon = faviconUrl;
        } else {
          newFavicon = `https://www.google.com/s2/favicons?domain=${urlString}`;
        }

        // Extract description
        const descriptionMatch = html.match(
          /<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["'][^>]*>/i
        );
        const newDescription = descriptionMatch ? descriptionMatch[1] : "";

        onConfigChange({
          title: newTitle,
          favicon: newFavicon,
          description: newDescription,
        });

        toast({
          title: "Site information fetched successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } catch (error) {
        console.error("Error fetching site information:", error);
        onConfigChange({
          title: new URL(urlString).hostname,
          favicon: `https://www.google.com/s2/favicons?domain=${urlString}`,
          description: "",
        });
        toast({
          title: "Error fetching site information",
          description: "Using default values",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    },
    [onConfigChange, toast]
  );

  useEffect(() => {
    if (
      config.url &&
      isValidUrl(config.url) &&
      (!config.title || !config.favicon || !config.description)
    ) {
      fetchSiteInfo(config.url);
    }
  }, [
    config.url,
    config.title,
    config.favicon,
    config.description,
    fetchSiteInfo,
  ]);

  const handleChange = (key: keyof WebLinkConfig, value: any) => {
    onConfigChange({ [key]: value });
  };

  return (
    <VStack spacing={4} align="stretch">
      <Text>Website URL:</Text>
      <Input
        value={config.url}
        onChange={(e) => handleChange("url", e.target.value)}
        placeholder="https://www.example.com"
      />
      <Button
        onClick={() => fetchSiteInfo(config.url)}
        isDisabled={!isValidUrl(config.url)}
      >
        Refresh Site Info
      </Button>
      <HStack>
        <Switch
          isChecked={config.useCustom}
          onChange={(e) => handleChange("useCustom", e.target.checked)}
        />
        <Text>Use custom title and description</Text>
      </HStack>
      {config.useCustom && (
        <>
          <Text>Custom Title:</Text>
          <Input
            value={config.customTitle}
            onChange={(e) => handleChange("customTitle", e.target.value)}
            placeholder="Custom title"
          />
          <Text>Custom Description:</Text>
          <Textarea
            value={config.customDescription}
            onChange={(e) => handleChange("customDescription", e.target.value)}
            placeholder="Custom description"
          />
        </>
      )}
    </VStack>
  );
};

const WebLink = withWidgetBase<WebLinkConfig>({
  renderWidget: (props) => <WebLinkContent {...props} />,
  renderOptions: (props) => <WebLinkOptions {...props} />,
  defaultConfig,
});

export default WebLink;
