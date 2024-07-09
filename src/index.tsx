import React from "react";
import ReactDOM from "react-dom";
import { ChakraProvider } from "@chakra-ui/react";
import HomePage from "./pages/HomePage";
import "./index.css";

ReactDOM.render(
  <React.StrictMode>
    <ChakraProvider>
      <HomePage />
    </ChakraProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
