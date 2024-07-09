import React, { useCallback } from "react";
import {
  Box,
  VStack,
  HStack,
  Text,
  Input,
  Button,
  List,
  ListItem,
  ListIcon,
  Badge,
  useColorModeValue,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { FaCheckCircle, FaHourglassHalf, FaBrain } from "react-icons/fa";
import withWidgetBase from "../hooks/withWidgetBase";
import { WidgetProps } from "../../interfaces/widget";

interface Task {
  id: number;
  text: string;
  status: "pending" | "completed";
  priority: Priority;
  estimatedTime?: number;
}

type Priority = "low" | "medium" | "high";

interface SmartTaskManagerConfig {
  tasks: Task[];
  newTask: string;
  optimizing: boolean;
}

const defaultConfig: SmartTaskManagerConfig = {
  tasks: [],
  newTask: "",
  optimizing: false,
};

const SmartTaskManagerContent: React.FC<
  WidgetProps<SmartTaskManagerConfig>
> = ({ config, onConfigChange }) => {
  const toast = useToast();
  const bgColor = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  const addTask = useCallback(() => {
    if (config.newTask.trim() !== "") {
      onConfigChange({
        tasks: [
          ...config.tasks,
          {
            id: Date.now(),
            text: config.newTask,
            status: "pending",
            priority: "medium",
          },
        ],
        newTask: "",
      });
    }
  }, [config.newTask, config.tasks, onConfigChange]);

  const optimizeTasks = useCallback(() => {
    onConfigChange({ optimizing: true });
    // Simula un'ottimizzazione AI
    setTimeout(() => {
      const optimizedTasks = config.tasks.map((task) => ({
        ...task,
        priority: ["low", "medium", "high"][
          Math.floor(Math.random() * 3)
        ] as Priority,
        estimatedTime: Math.floor(Math.random() * 120) + 15, // 15-135 minuti
      }));
      onConfigChange({ tasks: optimizedTasks, optimizing: false });
      toast({
        title: "Attività ottimizzate",
        description: "L'AI ha analizzato e ottimizzato le tue attività.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    }, 2000);
  }, [config.tasks, onConfigChange, toast]);

  const completeTask = useCallback(
    (id: number) => {
      onConfigChange({
        tasks: config.tasks.map((task) =>
          task.id === id ? { ...task, status: "completed" } : task
        ),
      });
    },
    [config.tasks, onConfigChange]
  );

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case "low":
        return "green";
      case "medium":
        return "yellow";
      case "high":
        return "red";
      default:
        return "gray";
    }
  };

  return (
    <VStack spacing={4} align="stretch">
      <Text fontSize="2xl" fontWeight="bold" color="blue.500">
        Smart Task Manager
      </Text>

      <HStack>
        <Input
          placeholder="Aggiungi una nuova attività"
          value={config.newTask}
          onChange={(e) => onConfigChange({ newTask: e.target.value })}
        />
        <Button colorScheme="blue" onClick={addTask}>
          Aggiungi
        </Button>
      </HStack>

      <Button
        leftIcon={<FaBrain />}
        colorScheme="purple"
        onClick={optimizeTasks}
        isLoading={config.optimizing}
        loadingText="Ottimizzazione in corso"
      >
        Ottimizza con AI
      </Button>

      <List spacing={3}>
        {config.tasks.map((task) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ListItem
              p={2}
              bg={task.status === "completed" ? "gray.100" : "white"}
              borderRadius="md"
              boxShadow="sm"
            >
              <HStack justify="space-between">
                <HStack>
                  <ListIcon
                    as={
                      task.status === "completed"
                        ? FaCheckCircle
                        : FaHourglassHalf
                    }
                    color={
                      task.status === "completed" ? "green.500" : "orange.500"
                    }
                  />
                  <Text>{task.text}</Text>
                </HStack>
                <HStack>
                  {task.estimatedTime && (
                    <Badge colorScheme="blue">{task.estimatedTime} min</Badge>
                  )}
                  <Badge colorScheme={getPriorityColor(task.priority)}>
                    {task.priority}
                  </Badge>
                  {task.status !== "completed" && (
                    <Button
                      size="sm"
                      colorScheme="green"
                      onClick={() => completeTask(task.id)}
                    >
                      Completa
                    </Button>
                  )}
                </HStack>
              </HStack>
            </ListItem>
          </motion.div>
        ))}
      </List>

      {config.optimizing && (
        <Box textAlign="center">
          <Spinner size="xl" color="purple.500" />
          <Text mt={2}>L'AI sta analizzando le tue attività...</Text>
        </Box>
      )}
    </VStack>
  );
};

const SmartTaskManager = withWidgetBase<SmartTaskManagerConfig>({
  renderWidget: (props) => <SmartTaskManagerContent {...props} />,
  rendereOptions: () => null,
  defaultConfig,
});

export default SmartTaskManager;
