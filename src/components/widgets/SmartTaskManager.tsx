import React, { useState, useEffect } from "react";
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
interface Task {
  id: number;
  text: string;
  status: string;
  priority: Priority;
  estimatedTime?: number;
}
type Priority = "low" | "medium" | "high";
const SmartTaskManager = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [optimizing, setOptimizing] = useState(false);
  const toast = useToast();

  const bgColor = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  useEffect(() => {
    // Carica le attività salvate dal local storage
    const savedTasks =
      JSON.parse(localStorage.getItem("smartTasks") ?? "[]") || [];
    setTasks(savedTasks);
  }, []);

  useEffect(() => {
    // Salva le attività nel local storage quando cambiano
    localStorage.setItem("smartTasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (newTask.trim() !== "") {
      setTasks([
        ...tasks,
        {
          id: Date.now(),
          text: newTask,
          status: "pending",
          priority: "medium",
        },
      ]);
      setNewTask("");
    }
  };

  const optimizeTasks = () => {
    setOptimizing(true);
    // Simula un'ottimizzazione AI
    setTimeout(() => {
      const optimizedTasks = tasks.map((task) => ({
        ...task,
        priority: ["low", "medium", "high"][
          Math.floor(Math.random() * 3)
        ] as Priority,
        estimatedTime: Math.floor(Math.random() * 120) + 15, // 15-135 minuti
      }));
      setTasks(optimizedTasks);
      setOptimizing(false);
      toast({
        title: "Attività ottimizzate",
        description: "L'AI ha analizzato e ottimizzato le tue attività.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    }, 2000);
  };

  const completeTask = (id: number) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, status: "completed" } : task
      )
    );
  };

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
    <Box
      p={5}
      borderWidth={1}
      borderRadius="lg"
      boxShadow="md"
      bg={bgColor}
      borderColor={borderColor}
    >
      <VStack spacing={4} align="stretch">
        <Text fontSize="2xl" fontWeight="bold" color="blue.500">
          Smart Task Manager
        </Text>

        <HStack>
          <Input
            placeholder="Aggiungi una nuova attività"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
          />
          <Button colorScheme="blue" onClick={addTask}>
            Aggiungi
          </Button>
        </HStack>

        <Button
          leftIcon={<FaBrain />}
          colorScheme="purple"
          onClick={optimizeTasks}
          isLoading={optimizing}
          loadingText="Ottimizzazione in corso"
        >
          Ottimizza con AI
        </Button>

        <List spacing={3}>
          {tasks.map((task) => (
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

        {optimizing && (
          <Box textAlign="center">
            <Spinner size="xl" color="purple.500" />
            <Text mt={2}>L'AI sta analizzando le tue attività...</Text>
          </Box>
        )}
      </VStack>
    </Box>
  );
};

export default SmartTaskManager;
