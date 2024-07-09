import React, { useState, useCallback, useMemo } from "react";
import {
  VStack,
  HStack,
  Text,
  Input,
  Button,
  List,
  ListItem,
  IconButton,
  Checkbox,
  useToast,
  Select,
  Badge,
  Collapse,
  useDisclosure,
  Box,
  Textarea,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from "@chakra-ui/react";
import { DeleteIcon, EditIcon, ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import withWidgetBase from "../hooks/withWidgetBase";
import { WidgetProps } from "../../interfaces/widget";
import { useWidgetConfig } from "../../hooks/useWidgetConfig";
import { useLocalStorage } from "../../lib/useLocalStorage";

interface Todo {
  id: number;
  text: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
  dueDate?: string;
  notes?: string;
}

interface TodoListConfig {
  title: string;
  showPriority: boolean;
  showDueDate: boolean;
  showNotes: boolean;
  itemsPerPage: number;
}

const defaultConfig: TodoListConfig = {
  title: "Todo List",
  showPriority: true,
  showDueDate: true,
  showNotes: false,
  itemsPerPage: 10,
};

const TodoListContent: React.FC<WidgetProps<TodoListConfig>> = (props) => {
  const [config] = useWidgetConfig(props);
  const [todos, setTodos] = useLocalStorage<Todo[]>(`todoList_${props.id}_todos`, []);
  const [inputValue, setInputValue] = useState("");
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [filter, setFilter] = useLocalStorage<"all" | "active" | "completed">(`todoList_${props.id}_filter`, "all");
  const [sort, setSort] = useLocalStorage<"added" | "priority" | "dueDate">(`todoList_${props.id}_sort`, "added");
  const [currentPage, setCurrentPage] = useState(1);
  const { isOpen, onToggle } = useDisclosure();
  const toast = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleAddTodo = useCallback(() => {
    if (inputValue.trim() !== "") {
      const newTodo: Todo = {
        id: Date.now(),
        text: inputValue.trim(),
        completed: false,
        priority: "medium",
      };
      setTodos((prevTodos) => [...prevTodos, newTodo]);
      setInputValue("");
      toast({
        title: "Todo added",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    }
  }, [inputValue, setTodos, toast]);

  const handleDeleteTodo = useCallback(
    (id: number) => {
      setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
      toast({
        title: "Todo deleted",
        status: "info",
        duration: 2000,
        isClosable: true,
      });
    },
    [setTodos, toast]
  );

  const handleToggleTodo = useCallback(
    (id: number) => {
      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo.id === id ? { ...todo, completed: !todo.completed } : todo
        )
      );
    },
    [setTodos]
  );

  const handleEditTodo = useCallback((todo: Todo) => {
    setEditingTodo(todo);
    setInputValue(todo.text);
  }, []);

  const handleUpdateTodo = useCallback(() => {
    if (editingTodo && inputValue.trim() !== "") {
      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo.id === editingTodo.id
            ? { ...todo, text: inputValue.trim() }
            : todo
        )
      );
      setEditingTodo(null);
      setInputValue("");
      toast({
        title: "Todo updated",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    }
  }, [editingTodo, inputValue, setTodos, toast]);

  const handleChangePriority = useCallback(
    (id: number, priority: Todo["priority"]) => {
      setTodos((prevTodos) =>
        prevTodos.map((todo) => (todo.id === id ? { ...todo, priority } : todo))
      );
    },
    [setTodos]
  );

  const handleChangeDueDate = useCallback(
    (id: number, dueDate: string) => {
      setTodos((prevTodos) =>
        prevTodos.map((todo) => (todo.id === id ? { ...todo, dueDate } : todo))
      );
    },
    [setTodos]
  );

  const handleChangeNotes = useCallback(
    (id: number, notes: string) => {
      setTodos((prevTodos) =>
        prevTodos.map((todo) => (todo.id === id ? { ...todo, notes } : todo))
      );
    },
    [setTodos]
  );

  const filteredAndSortedTodos = useMemo(() => {
    return todos
      .filter((todo) => {
        if (filter === "active") return !todo.completed;
        if (filter === "completed") return todo.completed;
        return true;
      })
      .sort((a, b) => {
        if (sort === "priority") {
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        }
        if (sort === "dueDate") {
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        }
        return b.id - a.id;
      });
  }, [todos, filter, sort]);

  const paginatedTodos = useMemo(() => {
    const startIndex = (currentPage - 1) * config.itemsPerPage ?? 10;
    return filteredAndSortedTodos.slice(startIndex, startIndex + config.itemsPerPage ??10);
  }, [filteredAndSortedTodos, currentPage, config.itemsPerPage]);

  const totalPages = Math.ceil(filteredAndSortedTodos.length / config.itemsPerPage ??10);

  return (
    <VStack spacing={4} align="stretch" p={4}>
      <Text fontSize="xl" fontWeight="bold">
        {config.title}
      </Text>
      <HStack>
        <Input
          value={inputValue}
          onChange={handleInputChange}
          placeholder={editingTodo ? "Update todo" : "Add a new todo"}
          onKeyPress={(e) =>
            e.key === "Enter" &&
            (editingTodo ? handleUpdateTodo() : handleAddTodo())
          }
        />
        <Button onClick={editingTodo ? handleUpdateTodo : handleAddTodo}>
          {editingTodo ? "Update" : "Add"}
        </Button>
      </HStack>
      <HStack>
        <Select
          value={filter}
          onChange={(e) => setFilter(e.target.value as any)}
        >
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
        </Select>
        <Select value={sort} onChange={(e) => setSort(e.target.value as any)}>
          <option value="added">Date Added</option>
          <option value="priority">Priority</option>
          <option value="dueDate">Due Date</option>
        </Select>
      </HStack>
      <List spacing={2}>
        {paginatedTodos.map((todo) => (
          <ListItem key={todo.id}>
            <HStack justify="space-between">
              <Checkbox
                isChecked={todo.completed}
                onChange={() => handleToggleTodo(todo.id)}
              >
                <Text textDecoration={todo.completed ? "line-through" : "none"}>
                  {todo.text}
                </Text>
              </Checkbox>
              <HStack>
                {config.showPriority && (
                  <Badge
                    colorScheme={
                      todo.priority === "high"
                        ? "red"
                        : todo.priority === "medium"
                        ? "yellow"
                        : "green"
                    }
                  >
                    {todo.priority}
                  </Badge>
                )}
                {config.showDueDate && todo.dueDate && (
                  <Text fontSize="sm">
                    {new Date(todo.dueDate).toLocaleDateString()}
                  </Text>
                )}
                <IconButton
                  aria-label="Edit todo"
                  icon={<EditIcon />}
                  size="sm"
                  onClick={() => handleEditTodo(todo)}
                />
                <IconButton
                  aria-label="Delete todo"
                  icon={<DeleteIcon />}
                  size="sm"
                  onClick={() => handleDeleteTodo(todo.id)}
                />
              </HStack>
            </HStack>
            <Collapse in={isOpen}>
              <Box mt={2}>
                {config.showPriority && (
                  <Select
                    value={todo.priority}
                    onChange={(e) =>
                      handleChangePriority(
                        todo.id,
                        e.target.value as Todo["priority"]
                      )
                    }
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </Select>
                )}
                {config.showDueDate && (
                  <Input
                    type="date"
                    value={todo.dueDate || ""}
                    onChange={(e) => handleChangeDueDate(todo.id, e.target.value)}
                  />
                )}
                {config.showNotes && (
                  <Textarea
                    value={todo.notes || ""}
                    onChange={(e) => handleChangeNotes(todo.id, e.target.value)}
                    placeholder="Add notes..."
                  />
                )}
              </Box>
            </Collapse>
          </ListItem>
        ))}
      </List>
      <HStack justify="space-between">
        <Button
          onClick={onToggle}
          rightIcon={isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
        >
          {isOpen ? "Hide Details" : "Show Details"}
        </Button>
        <HStack>
          <Button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            isDisabled={currentPage === 1}
          >
            Previous
          </Button>
          <Text>{`Page ${currentPage} of ${totalPages}`}</Text>
          <Button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            isDisabled={currentPage === totalPages}
          >
            Next
          </Button>
        </HStack>
      </HStack>
    </VStack>
  );
};

const TodoListOptions: React.FC<WidgetProps<TodoListConfig>> = (props) => {
  const [config, updateConfig] = useWidgetConfig(props);

  return (
    <VStack spacing={4} align="stretch" p={4}>
      <Text fontSize="xl" fontWeight="bold">
        Todo List Settings
      </Text>
      <Input
        value={config.title}
        onChange={(e) => updateConfig({ title: e.target.value })}
        placeholder="Widget Title"
      />
      <Checkbox
        isChecked={config.showPriority}
        onChange={(e) => updateConfig({ showPriority: e.target.checked })}
      >
        Show Priority
      </Checkbox>
      <Checkbox
        isChecked={config.showDueDate}
        onChange={(e) => updateConfig({ showDueDate: e.target.checked })}
      >
        Show Due Date
      </Checkbox>
      <Checkbox
        isChecked={config.showNotes}
        onChange={(e) => updateConfig({ showNotes: e.target.checked })}
      >
        Show Notes
      </Checkbox>
      <HStack>
        <Text>Items per page:</Text>
        <NumberInput
          value={config.itemsPerPage}
          onChange={(_, value) => updateConfig({ itemsPerPage: value })}
          min={1}
          max={50}
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </HStack>
    </VStack>
  );
};

const TodoList = withWidgetBase<TodoListConfig>({
  renderWidget: (props) => <TodoListContent {...props} />,
  renderOptions: (props) => <TodoListOptions {...props} />,
  defaultConfig,
});

export default TodoList;