import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import Users from "../pages/User";
import Login from "../components/Login";
  
const AdminRoutes = () => {
    return (
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/users" element={<Users />} />
        </Routes>
      </Router>
    );
};

export default AdminRoutes;
