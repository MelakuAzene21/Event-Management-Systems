import React from "react";
import { BrowserRouter } from "react-router-dom";
import { Container } from "@mui/material";
import AdminRoutes from "./routes/AdminRoutes";

function App() {
  return (
    <BrowserRouter>
        <AdminRoutes />
      
    </BrowserRouter>
  ); 
}

export default App;
