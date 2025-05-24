// components/VendorList.js

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetAllVendorsQuery } from "../features/api/apiSlices";
import {
    Box,
    Button,
  Typography,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Paper,
  Chip,
  CircularProgress,
  Avatar,
} from "@mui/material";

const VendorList = () => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const {
    data: vendorsData,
    isLoading,
    error,
  } = useGetAllVendorsQuery({ search });
  // Ensure vendors is an array, default to empty array if undefined
  const vendors = vendorsData?.vendors || [];
  // Calculate stats with a fallback if vendors is empty
  const stats = vendors.reduce(
    (acc, vendor) => {
      acc.total++;
      if (vendor.status === "Active") acc.active++;
      if (vendor.status === "Pending") acc.pending++;
      if (vendor.status === "Inactive") acc.inactive++;
      return acc;
    },
    { total: 0, active: 0, pending: 0, inactive: 0 }
  );

  const handleViewDetails = (id) => {
    navigate(`/admin/vendors/${id}`);
  };

  return (
    <Box sx={{ p: 4, maxWidth: "1400px", mx: "auto", bgcolor: "#f9fafb" }}>
      <Typography
        variant="h3"
        component="h1"
        gutterBottom
        sx={{ fontWeight: "bold", color: "#1e293b", mb: 4 }}
      >
        Vendor Management
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={6}>
        Manage and view all vendors in your platform
      </Typography>

      {/* Stats Section */}
      <Box
        sx={{
          mb: 6,
          p: 3,
          bgcolor: "white",
          borderRadius: 2,
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        }}
      >
        <Box sx={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="body1" color="#1e293b">
              Total Vendors: <strong>{stats.total}</strong>
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="body1" color="#1e293b">
              Active: <strong>{stats.active}</strong>
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="body1" color="#1e293b">
              Pending: <strong>{stats.pending}</strong>
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="body1" color="#1e293b">
              Inactive: <strong>{stats.inactive}</strong>
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Search Bar */}
      <Box sx={{ mb: 4 }}>
        <TextField
          variant="outlined"
          placeholder="Search vendors..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ width: "300px", bgcolor: "white", borderRadius: 2 }}
          InputProps={{ sx: { borderRadius: 2 } }}
        />
      </Box>

      {/* Vendors Table */}
      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error">Error loading vendors</Typography>
      ) : vendors.length === 0 ? (
        <Typography color="text.secondary">No vendors found</Typography>
      ) : (
        <TableContainer
          component={Paper}
          sx={{ boxShadow: "0 4px 12px rgba(0,0,0,0.1)", borderRadius: 2 }}
        >
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                <TableCell sx={{ fontWeight: "bold", color: "#1e293b" }}>
                  Vendor
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#1e293b" }}>
                  Service
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#1e293b" }}>
                  Rating
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#1e293b" }}>
                  Price
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#1e293b" }}>
                  Location
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#1e293b" }}>
                  Status
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#1e293b" }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {vendors.map((vendor) => (
                <TableRow
                  key={vendor._id}
                  sx={{
                    "&:hover": { backgroundColor: "#f0f4ff" },
                  }}
                >
                  <TableCell sx={{ padding: "12px" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Avatar
                        sx={{ width: 40, height: 40, bgcolor: "#e0e0e0" }}
                      />
                      <Box>
                        <Typography variant="body1" fontWeight="medium">
                          {vendor.name}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="primary"
                          component="a"
                          href={`mailto:${vendor.email}`}
                          sx={{ textDecoration: "none" }}
                        >
                          {vendor.email}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ padding: "12px" }}>
                    {vendor.serviceProvided || "N/A"}
                  </TableCell>
                  <TableCell sx={{ padding: "12px" }}>
                    ⭐ {vendor.rating || 0}
                  </TableCell>
                  <TableCell sx={{ padding: "12px" }}>
                    $ {vendor.price || 0}
                  </TableCell>
                  <TableCell sx={{ padding: "12px" }}>
                    {vendor.location.name|| "N/A"}
                  </TableCell>
                  <TableCell sx={{ padding: "12px" }}>
                    <Chip
                      label={vendor.status || "Unknown"}
                      size="small"
                      sx={{
                        backgroundColor:
                          vendor.status === "Active"
                            ? "#e8f5e9"
                            : vendor.status === "Pending"
                            ? "#fff3e0"
                            : vendor.status === "Inactive"
                            ? "#fce4ec"
                            : "#e0e0e0",
                        color:
                          vendor.status === "Active"
                            ? "#2e7d32"
                            : vendor.status === "Pending"
                            ? "#ed6c02"
                            : vendor.status === "Inactive"
                            ? "#d32f2f"
                            : "#616161",
                        fontWeight: "bold",
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ padding: "12px" }}>
                    <Button
                      variant="text"
                      color="primary"
                      onClick={() => handleViewDetails(vendor._id)}
                      sx={{ textTransform: "none" }}
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default VendorList;
