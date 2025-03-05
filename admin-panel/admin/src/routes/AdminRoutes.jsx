import React from "react";
import { Routes, Route } from "react-router-dom";
import AdminLayout from "../pages/AdminLayout";
import Dashboard from "../pages/Dashboard";
import Users from "../pages/User";
import Events from "../pages/Events";
import Profile from "../pages/Profile"; // Admin Profile Page
import Login from "../components/Login";
import EventDetails from "../pages/EventDeails.jsx";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="users" element={<Users />} />
        <Route path="events" element={<Events />} />
        <Route path="profile" element={<Profile />} />
      </Route>
      <Route path="/events/:id" element={<EventDetails />} />
    </Routes>
  );
};

export default AdminRoutes;
