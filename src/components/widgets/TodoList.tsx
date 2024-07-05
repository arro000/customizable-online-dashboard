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
  IconButton,
  Checkbox,
  useColorModeValue,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import WidgetBase from "../WidgetBase";

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    const savedTodos = localStorage.getItem("todos");
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleAddTodo = () => {
    if (inputValue.trim() !== "") {
      const newTodo: Todo = {
        id: Date.now(),
        text: inputValue.trim(),
        completed: false,
      };
      setTodos([...todos, newTodo]);
      setInputValue("");
    }
  };

  const handleDeleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const handleToggleTodo = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const bgColor = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  return (
    <WidgetBase>
      <VStack spacing={4} align="stretch">
        <Text fontSize="xl" fontWeight="bold">
          Todo List
        </Text>
        <HStack>
          <Input
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Add a new todo"
          />
          <Button onClick={handleAddTodo}>Add</Button>
        </HStack>
        <List spacing={2}>
          {todos.map((todo) => (
            <ListItem key={todo.id}>
              <HStack justify="space-between">
                <Checkbox
                  isChecked={todo.completed}
                  onChange={() => handleToggleTodo(todo.id)}
                >
                  <Text
                    textDecoration={todo.completed ? "line-through" : "none"}
                  >
                    {todo.text}
                  </Text>
                </Checkbox>
                <IconButton
                  aria-label="Delete todo"
                  icon={<DeleteIcon />}
                  size="sm"
                  onClick={() => handleDeleteTodo(todo.id)}
                />
              </HStack>
            </ListItem>
          ))}
        </List>
      </VStack>
    </WidgetBase>
  );
};

export default TodoList;
