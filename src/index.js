import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { ReactFlowContextProvider } from "./context/ReactFlowContextProvider";

ReactDOM.render(
  <React.StrictMode>
    <ReactFlowContextProvider>
      <App />
    </ReactFlowContextProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
