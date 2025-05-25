import React from "react";
import { Routes, Route } from "react-router-dom";
import AdminLayout from "../pages/AdminLayout";
import Dashboard from "../pages/Dashboard";
import Users from "../pages/User";
import Events from "../pages/Events";
import Profile from "../pages/Profile"; // Admin Profile Page
import Login from "../components/Login";
import EventDetails from "../pages/EventDeails.jsx";
import MonthlyRevenueChart from "../pages/MonthlyRevenueChart.jsx";
import EventApproval from "../pages/EventApproval.jsx";
import ForgotPassword from "../components/forgot-password.jsx";
import NotFoundPage from "../components/NotFoundPage.jsx";
import CategoryManagement from "../pages/CategoryManagement.jsx";
import AnalyticsDashboard from "../pages/AnalyticPage.jsx";
import OrganizersList from "../pages/OrganizersList.jsx";
import OrganizerDetails from "../pages/OrganizerDetails.jsx";
import VendorList from "../pages/VendorList.jsx";
import VendorDetails from "../pages/VendorDetails.jsx";
import VerifyOtp  from "../pages/Admin_VerifyOtp.jsx";
const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/verify-otp" element={<VerifyOtp />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="*" element={<NotFoundPage />} />
      <Route path="admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="users" element={<Users />} />
        <Route path="events" element={<Events />} />
        <Route path="profile" element={<Profile />} />
        <Route path="report" element={<MonthlyRevenueChart />} />
        <Route path="analytic" element={<AnalyticsDashboard />} />
        <Route path="organizers" element={<OrganizersList />} />
        <Route path="vendors" element={<VendorList />} />

        <Route path="category" element={<CategoryManagement />} />
      </Route>
      <Route path="/admin/events/:eventId" element={<EventApproval />} />
      <Route path="/events/:id" element={<EventDetails />} />
      <Route path="/admin/organizers/:id" element={<OrganizerDetails />} />
      <Route path="/admin/vendors/:id" element={<VendorDetails />} />
    </Routes>
  );
};

export default AdminRoutes;
