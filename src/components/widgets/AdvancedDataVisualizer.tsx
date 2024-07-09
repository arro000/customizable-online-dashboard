import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  VStack,
  HStack,
  Select,
  Input,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useToast,
  useColorModeValue,
} from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";
import { Chart } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import Papa from "papaparse";
import withWidgetBase from "../hooks/withWidgetBase";
import { WidgetProps } from "../../interfaces/widget";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface DataItem {
  [key: string]: string | number;
}

interface AdvancedDataVisualizerConfig {
  data: DataItem[];
  headers: string[];
  filteredData: DataItem[];
  sortColumn: string;
  sortDirection: "asc" | "desc";
  filterColumn: string;
  filterValue: string;
  chartColumn: string;
}

const defaultConfig: AdvancedDataVisualizerConfig = {
  data: [],
  headers: [],
  filteredData: [],
  sortColumn: "",
  sortDirection: "asc",
  filterColumn: "",
  filterValue: "",
  chartColumn: "",
};

const AdvancedDataVisualizerContent: React.FC<
  WidgetProps<AdvancedDataVisualizerConfig>
> = ({ config: rawConfig, onConfigChange }) => {
  const config = { ...defaultConfig, ...rawConfig };
  const toast = useToast();

  const applyFilterAndSort = useCallback(() => {
    let result = [...config.data];

    if (config.filterColumn && config.filterValue) {
      result = result.filter((item) =>
        String(item[config.filterColumn])
          .toLowerCase()
          .includes(config.filterValue.toLowerCase())
      );
    }

    if (config.sortColumn) {
      result.sort((a, b) => {
        if (a[config.sortColumn] < b[config.sortColumn])
          return config.sortDirection === "asc" ? -1 : 1;
        if (a[config.sortColumn] > b[config.sortColumn])
          return config.sortDirection === "asc" ? 1 : -1;
        return 0;
      });
    }

    onConfigChange({ ...config, filteredData: result });
  }, [config, onConfigChange]);

  useEffect(() => {
    applyFilterAndSort();
  }, [
    config.data,
    config.sortColumn,
    config.sortDirection,
    config.filterColumn,
    config.filterValue,
    applyFilterAndSort,
  ]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      Papa.parse(file, {
        complete: (results) => {
          const parsedData = results.data as DataItem[];
          if (parsedData.length > 0) {
            const newHeaders = Object.keys(parsedData[0]);
            onConfigChange({
              ...config,
              data: parsedData,
              headers: newHeaders,
              filteredData: parsedData,
            });
            toast({
              title: "Dati caricati con successo",
              status: "success",
              duration: 3000,
              isClosable: true,
            });
          }
        },
        header: true,
        dynamicTyping: true,
        delimiter: ",",
      });
    }
  };

  const toggleSort = (column: string) => {
    if (column === config.sortColumn) {
      onConfigChange({
        ...config,
        sortDirection: config.sortDirection === "asc" ? "desc" : "asc",
      });
    } else {
      onConfigChange({
        ...config,
        sortColumn: column,
        sortDirection: "asc",
      });
    }
  };

  const chartData = {
    labels: config.filteredData.map((item) => String(item[config.headers[0]])),
    datasets: [
      {
        label: config.chartColumn,
        data: config.filteredData.map((item) =>
          Number(item[config.chartColumn])
        ),
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };

  const bgColor = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  return (
    <Box p={4}>
      <VStack spacing={4} align="stretch">
        <Input type="file" onChange={handleFileUpload} accept=".csv" />

        <HStack>
          <Select
            value={config.filterColumn}
            onChange={(e) =>
              onConfigChange({ ...config, filterColumn: e.target.value })
            }
          >
            <option value="">Seleziona colonna per filtrare</option>
            {config.headers.map((header) => (
              <option key={header} value={header}>
                {header}
              </option>
            ))}
          </Select>
          <Input
            placeholder="Valore filtro"
            value={config.filterValue}
            onChange={(e) =>
              onConfigChange({ ...config, filterValue: e.target.value })
            }
          />
        </HStack>

        <Select
          value={config.chartColumn}
          onChange={(e) =>
            onConfigChange({ ...config, chartColumn: e.target.value })
          }
        >
          <option value="">Seleziona colonna per il grafico</option>
          {config.headers
            .filter((header) => typeof config.data[0]?.[header] === "number")
            .map((header) => (
              <option key={header} value={header}>
                {header}
              </option>
            ))}
        </Select>

        {config.chartColumn && (
          <Box height="300px">
            <Chart type="line" data={chartData} />
          </Box>
        )}

        <Box overflowX="auto">
          <Table variant="simple">
            <Thead>
              <Tr>
                {config.headers.map((header) => (
                  <Th
                    key={header}
                    onClick={() => toggleSort(header)}
                    cursor="pointer"
                  >
                    {header}
                    {config.sortColumn === header &&
                      (config.sortDirection === "asc" ? " ▲" : " ▼")}
                  </Th>
                ))}
              </Tr>
            </Thead>
            <Tbody>
              <AnimatePresence>
                {config.filteredData.map((item, index) => (
                  <motion.tr
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {config.headers.map((header) => (
                      <Td key={header}>{String(item[header])}</Td>
                    ))}
                  </motion.tr>
                ))}
              </AnimatePresence>
            </Tbody>
          </Table>
        </Box>
      </VStack>
    </Box>
  );
};

const AdvancedDataVisualizer = withWidgetBase<AdvancedDataVisualizerConfig>({
  renderWidget: (props) => <AdvancedDataVisualizerContent {...props} />,
  renderOptions: () => null,
  defaultConfig,
});

export default AdvancedDataVisualizer;
