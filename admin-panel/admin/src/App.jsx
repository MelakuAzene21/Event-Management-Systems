import React from "react";
import { Container } from "@mui/material";
import AdminRoutes from "./routes/AdminRoutes";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
function App() {
  return (
    <Container>
      <ToastContainer position="top-center" />

      <AdminRoutes />
    </Container>
  );
}

export default App;
