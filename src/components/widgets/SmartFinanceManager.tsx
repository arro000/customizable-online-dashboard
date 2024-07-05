import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  VStack,
  HStack,
  Text,
  Input,
  Button,
  Select,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useColorModeValue,
  useToast,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { FaPlus, FaChartLine, FaPiggyBank } from "react-icons/fa";
import { FaFileImport, FaFileExport } from "react-icons/fa";
import { parse } from "papaparse";
import WidgetBase from "../WidgetBase";
interface Transaction {
  id: number;
  type: string;
  category: string;
  amount: string;
  description: string;
  date: string;
}

const SmartFinanceManager = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [newTransaction, setNewTransaction] = useState({
    type: "expense",
    category: "",
    amount: "",
    description: "",
  });
  const [balance, setBalance] = useState(0);
  const [savings, setSavings] = useState(0);
  const toast = useToast();

  const bgColor = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const fileInputRef = useRef();

  const handleFileUpload = (event: any) => {
    const file = event.target.files[0];
    if (file) {
      parse(file, {
        complete: (results) => {
          const importedTransactions = results.data.map((row, index) => {
            const r = row as string[];
            return {
              id: Date.now() + index,
              date: r[0],
              type: r[1],
              category: r[2],
              amount: r[3],
              description: r[4],
            };
          });
          setTransactions([...transactions, ...importedTransactions]);
          onClose();
          toast({
            title: "Transazioni importate con successo",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
        },
        header: true,
        skipEmptyLines: true,
      });
    }
  };

  const exportToCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Data,Tipo,Categoria,Importo,Descrizione\n" +
      transactions
        .map(
          (t) =>
            `${t.date},${t.type},${t.category},${t.amount},${t.description}`
        )
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "smart_finance_transactions.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Transazioni esportate con successo",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  useEffect(() => {
    // Carica i dati dal local storage
    const savedTransactions =
      JSON.parse(localStorage.getItem("smartFinanceTransactions") ?? "[]") ||
      [];
    const savedBalance =
      parseFloat(localStorage.getItem("smartFinanceBalance") ?? "0") || 0;
    const savedSavings =
      parseFloat(localStorage.getItem("smartFinanceSavings") ?? "0") || 0;
    setTransactions(savedTransactions);
    setBalance(savedBalance);
    setSavings(savedSavings);
  }, []);

  useEffect(() => {
    // Salva i dati nel local storage quando cambiano
    localStorage.setItem(
      "smartFinanceTransactions",
      JSON.stringify(transactions)
    );
    localStorage.setItem("smartFinanceBalance", balance.toString());
    localStorage.setItem("smartFinanceSavings", savings.toString());
  }, [transactions, balance, savings]);

  const addTransaction = () => {
    if (newTransaction.category && newTransaction.amount) {
      const amount = parseFloat(newTransaction.amount);
      const updatedBalance =
        newTransaction.type === "income" ? balance + amount : balance - amount;
      setBalance(updatedBalance);
      setTransactions([
        ...transactions,
        { ...newTransaction, id: Date.now(), date: new Date().toISOString() },
      ]);
      setNewTransaction({
        type: "expense",
        category: "",
        amount: "",
        description: "",
      });
      toast({
        title: "Transazione aggiunta",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const addToSavings = (amount: number) => {
    if (amount > 0 && amount <= balance) {
      setBalance(balance - amount);
      setSavings(savings + amount);
      toast({
        title: "Risparmi aggiornati",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const getIncomeExpenseStats = () => {
    const income = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);
    const expenses = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);
    return { income, expenses };
  };

  const getCategoryStats = () => {
    const stats: { [key: string]: number } = {};
    transactions.forEach((t) => {
      if (t.type === "expense") {
        stats[t.category] = (stats[t.category] || 0) + parseFloat(t.amount);
      }
    });
    return Object.entries(stats)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  };

  return (
    <WidgetBase>
      <VStack spacing={6} align="stretch">
        <Text
          fontSize="3xl"
          fontWeight="bold"
          color="blue.500"
          textAlign="center"
        >
          Smart Finance Manager
        </Text>

        <HStack justifyContent="space-between">
          <Button
            leftIcon={<FaFileImport />}
            colorScheme="teal"
            onClick={onOpen}
          >
            Importa CSV
          </Button>
          <Button
            leftIcon={<FaFileExport />}
            colorScheme="teal"
            onClick={exportToCSV}
          >
            Esporta CSV
          </Button>
        </HStack>
        <HStack justify="space-between">
          <Stat>
            <StatLabel>Saldo attuale</StatLabel>
            <StatNumber>${balance.toFixed(2)}</StatNumber>
            <StatHelpText>
              <StatArrow type={balance >= 0 ? "increase" : "decrease"} />
              {Math.abs(balance).toFixed(2)}
            </StatHelpText>
          </Stat>
          <Stat>
            <StatLabel>Risparmi</StatLabel>
            <StatNumber>${savings.toFixed(2)}</StatNumber>
          </Stat>
        </HStack>

        <Tabs isFitted variant="enclosed">
          <TabList mb="1em">
            <Tab>Aggiungi Transazione</Tab>
            <Tab>Statistiche</Tab>
            <Tab>Risparmi</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <VStack spacing={4}>
                <Select
                  value={newTransaction.type}
                  onChange={(e) =>
                    setNewTransaction({
                      ...newTransaction,
                      type: e.target.value,
                    })
                  }
                >
                  <option value="expense">Spesa</option>
                  <option value="income">Entrata</option>
                </Select>
                <Input
                  placeholder="Categoria"
                  value={newTransaction.category}
                  onChange={(e) =>
                    setNewTransaction({
                      ...newTransaction,
                      category: e.target.value,
                    })
                  }
                />
                <Input
                  placeholder="Importo"
                  type="number"
                  value={newTransaction.amount}
                  onChange={(e) =>
                    setNewTransaction({
                      ...newTransaction,
                      amount: e.target.value,
                    })
                  }
                />
                <Input
                  placeholder="Descrizione"
                  value={newTransaction.description}
                  onChange={(e) =>
                    setNewTransaction({
                      ...newTransaction,
                      description: e.target.value,
                    })
                  }
                />
                <Button
                  leftIcon={<FaPlus />}
                  colorScheme="green"
                  onClick={addTransaction}
                >
                  Aggiungi Transazione
                </Button>
              </VStack>
            </TabPanel>
            <TabPanel>
              <VStack spacing={4} align="stretch">
                <HStack justify="space-between">
                  <Stat>
                    <StatLabel>Entrate totali</StatLabel>
                    <StatNumber>
                      ${getIncomeExpenseStats().income.toFixed(2)}
                    </StatNumber>
                  </Stat>
                  <Stat>
                    <StatLabel>Spese totali</StatLabel>
                    <StatNumber>
                      ${getIncomeExpenseStats().expenses.toFixed(2)}
                    </StatNumber>
                  </Stat>
                </HStack>
                <Text fontWeight="bold">Top 5 categorie di spesa:</Text>
                {getCategoryStats().map(([category, amount]) => (
                  <HStack key={category} justify="space-between">
                    <Text>{category}</Text>
                    <Text>${amount.toFixed(2)}</Text>
                  </HStack>
                ))}
              </VStack>
            </TabPanel>
            <TabPanel>
              <VStack spacing={4}>
                <Input
                  placeholder="Importo da risparmiare"
                  type="number"
                  value={newTransaction.amount}
                  onChange={(e) =>
                    setNewTransaction({
                      ...newTransaction,
                      amount: e.target.value,
                    })
                  }
                />
                <Button
                  leftIcon={<FaPiggyBank />}
                  colorScheme="purple"
                  onClick={() =>
                    addToSavings(parseFloat(newTransaction.amount))
                  }
                >
                  Aggiungi ai risparmi
                </Button>
              </VStack>
            </TabPanel>
          </TabPanels>
        </Tabs>

        <Box overflowX="auto">
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Data</Th>
                <Th>Tipo</Th>
                <Th>Categoria</Th>
                <Th>Importo</Th>
                <Th>Descrizione</Th>
              </Tr>
            </Thead>
            <Tbody>
              {transactions
                .slice()
                .reverse()
                .map((transaction) => (
                  <Tr key={transaction.id}>
                    <Td>{new Date(transaction.date).toLocaleDateString()}</Td>
                    <Td>
                      {transaction.type === "income" ? "Entrata" : "Spesa"}
                    </Td>
                    <Td>{transaction.category}</Td>
                    <Td
                      color={
                        transaction.type === "income" ? "green.500" : "red.500"
                      }
                    >
                      ${parseFloat(transaction.amount).toFixed(2)}
                    </Td>
                    <Td>{transaction.description}</Td>
                  </Tr>
                ))}
            </Tbody>
          </Table>
        </Box>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Importa transazioni da CSV</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Text mb={4}>
                Seleziona un file CSV con le seguenti colonne: Data, Tipo,
                Categoria, Importo, Descrizione
              </Text>
              <Input
                type="file"
                accept=".csv"
                ref={fileInputRef as any}
                onChange={handleFileUpload}
              />
            </ModalBody>
            <ModalFooter>
              <Button
                colorScheme="blue"
                mr={3}
                onClick={() =>
                  fileInputRef.current
                    ? (fileInputRef.current as any).click()
                    : null
                }
              >
                Scegli file
              </Button>
              <Button variant="ghost" onClick={onClose}>
                Annulla
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </VStack>
    </WidgetBase>
  );
};

export default SmartFinanceManager;
