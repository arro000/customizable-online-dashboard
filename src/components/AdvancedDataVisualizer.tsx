import React, { useState, useEffect } from 'react';
import { Box, Button, VStack, HStack, Text, Select, Input, Table, Thead, Tbody, Tr, Th, Td, useToast } from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Chart } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import Papa from 'papaparse';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface DataItem {
  [key: string]: string | number;
}

const AdvancedDataVisualizer: React.FC = () => {
  const [data, setData] = useState<DataItem[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [filteredData, setFilteredData] = useState<DataItem[]>([]);
  const [sortColumn, setSortColumn] = useState('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [filterColumn, setFilterColumn] = useState('');
  const [filterValue, setFilterValue] = useState('');
  const [chartColumn, setChartColumn] = useState('');
  const toast = useToast();

  useEffect(() => {
    applyFilterAndSort();
  }, [data, sortColumn, sortDirection, filterColumn, filterValue]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      Papa.parse(file, {
        complete: (results) => {
          const parsedData = results.data as DataItem[];
          if (parsedData.length > 0) {
            setHeaders(Object.keys(parsedData[0]));
            setData(parsedData);
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
        delimiter:","
      });
    }
  };

  const applyFilterAndSort = () => {
    let result = [...data];

    if (filterColumn && filterValue) {
      result = result.filter(item => 
        String(item[filterColumn]).toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    if (sortColumn) {
      result.sort((a, b) => {
        if (a[sortColumn] < b[sortColumn]) return sortDirection === 'asc' ? -1 : 1;
        if (a[sortColumn] > b[sortColumn]) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    setFilteredData(result);
  };

  const toggleSort = (column: string) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const chartData = {
    labels: filteredData.map(item => String(item[headers[0]])),
    datasets: [
      {
        label: chartColumn,
        data: filteredData.map(item => Number(item[chartColumn])),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  };

  return (
    <VStack spacing={4} align="stretch">
      <Input type="file" onChange={handleFileUpload} accept=".csv" />
      
      <HStack>
        <Select value={filterColumn} onChange={(e) => setFilterColumn(e.target.value)}>
          <option value="">Seleziona colonna per filtrare</option>
          {headers.map(header => (
            <option key={header} value={header}>{header}</option>
          ))}
        </Select>
        <Input 
          placeholder="Valore filtro" 
          value={filterValue} 
          onChange={(e) => setFilterValue(e.target.value)}
        />
      </HStack>

      <Select value={chartColumn} onChange={(e) => setChartColumn(e.target.value)}>
        <option value="">Seleziona colonna per il grafico</option>
        {headers.filter(header => typeof data[0]?.[header] === 'number').map(header => (
          <option key={header} value={header}>{header}</option>
        ))}
      </Select>

      {chartColumn && (
        <Box height="300px">
          <Chart type="line" data={chartData} />
        </Box>
      )}

      <Box overflowX="auto">
        <Table variant="simple">
          <Thead>
            <Tr>
              {headers.map(header => (
                <Th key={header} onClick={() => toggleSort(header)} cursor="pointer">
                  {header}
                  {sortColumn === header && (sortDirection === 'asc' ? ' ▲' : ' ▼')}
                </Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            <AnimatePresence>
              {filteredData.map((item, index) => (
                <motion.tr
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {headers.map(header => (
                    <Td key={header}>{String(item[header])}</Td>
                  ))}
                </motion.tr>
              ))}
            </AnimatePresence>
          </Tbody>
        </Table>
      </Box>
    </VStack>
  );
};

export default AdvancedDataVisualizer;