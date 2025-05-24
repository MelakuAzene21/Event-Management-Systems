import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useGetAllOrganizersQuery,  
} from "../features/api/apiSlices";
import {
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Paper,
  Chip,
  CircularProgress,
} from "@mui/material";

const OrganizersList = () => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All Status");
  const {
    data: organizers = [],
    isLoading,
    
  } = useGetAllOrganizersQuery({ search, status });
  const navigate = useNavigate();

  const stats = organizers.reduce(
    (acc, org) => {
      acc.total++;
      if (org.status === "Approved") acc.approved++;
      if (org.status === "Pending") acc.pending++;
      if (org.status === "Rejected") acc.rejected++;
      return acc;
    },
    { total: 0, approved: 0, pending: 0, rejected: 0 }
  );

  

  const handleViewDetails = (id) => {
    navigate(`/admin/organizers/${id}`);
  };

  return (
    <Box sx={{ p: 4, maxWidth: "1400px", mx: "auto", bgcolor: "#f9fafb" }}>
      <Typography
        variant="h3"
        component="h1"
        gutterBottom
        sx={{ fontWeight: "bold", color: "#1e293b", mb: 4 }}
      >
        Event Organizers
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 6,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box sx={{ display: "flex", gap: 3 }}>
          <TextField
            variant="outlined"
            placeholder="Search by name, organization, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ minWidth: "350px", bgcolor: "white" }}
            InputProps={{ sx: { borderRadius: 2 } }}
          />
          <Select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            variant="outlined"
            sx={{ minWidth: "250px", bgcolor: "white", borderRadius: 2 }}
          >
            <MenuItem value="All Status">All Status</MenuItem>
            <MenuItem value="Approved">Approved</MenuItem>
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Rejected">Rejected</MenuItem>
          </Select>
        </Box>
      </Box>
      <Box
        sx={{
          mb: 6,
          p: 3,
          bgcolor: "white",
          borderRadius: 2,
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        }}
      >
        <Typography variant="h6" sx={{ color: "#64748b", mb: 2 }}>
          Overview
        </Typography>
        <Box sx={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="body1" color="primary">
              👥
            </Typography>
            <Typography variant="body1" color="#1e40af">
              Total Organizers: <strong>{stats.total}</strong>
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="body1" color="#10b981">
              ✔
            </Typography>
            <Typography variant="body1" color="#047857">
              Approved: <strong>{stats.approved}</strong>
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="body1" color="#f59e0b">
              ⏳
            </Typography>
            <Typography variant="body1" color="#d97706">
              Pending: <strong>{stats.pending}</strong>
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="body1" color="#ef4444">
              ✖
            </Typography>
            <Typography variant="body1" color="#dc2626">
              Rejected: <strong>{stats.rejected}</strong>
            </Typography>
          </Box>
        </Box>
      </Box>
      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer
          component={Paper}
          sx={{ boxShadow: "0 4px 12px rgba(0,0,0,0.1)", borderRadius: 2 }}
        >
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#e0e7ff" }}>
                <TableCell sx={{ fontWeight: "bold", color: "#1e40af" }}>
                  Organizer
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#1e40af" }}>
                  Organization
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#1e40af" }}>
                  Contact
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#1e40af" }}>
                  Experience
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#1e40af" }}>
                  Status
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#1e40af" }}>
                  Joined
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {organizers.map((org) => (
                <TableRow
                  key={org._id}
                  onClick={() => handleViewDetails(org._id)}
                  sx={{
                    cursor: "pointer",
                    "&:hover": { backgroundColor: "#f0f4ff" },
                  }}
                >
                  <TableCell sx={{ padding: "12px" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          bgcolor: "#e0e0e0",
                          borderRadius: "50%",
                        }}
                      />
                      <Box>
                        <Typography variant="body1" fontWeight="medium">
                          {org.name}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="primary"
                          component="a"
                          href={`mailto:${org.email}`}
                          sx={{ textDecoration: "none" }}
                        >
                          {org.email}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ padding: "12px" }}>
                    {org.organizationName}
                  </TableCell>
                  <TableCell sx={{ padding: "12px" }}>
                    {org.phoneNumber}
                  </TableCell>
                  <TableCell sx={{ padding: "12px" }}>
                    {org.experience}
                  </TableCell>
                  <TableCell sx={{ padding: "12px" }}>
                    <Chip
                      label={org.status}
                      size="small"
                      sx={{
                        backgroundColor:
                          org.status === "Approved"
                            ? "#e8f5e9"
                            : org.status === "Pending"
                            ? "#fff3e0"
                            : "#fce4ec",
                        color:
                          org.status === "Approved"
                            ? "#2e7d32"
                            : org.status === "Pending"
                            ? "#ed6c02"
                            : "#d32f2f",
                        fontWeight: "bold",
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ padding: "12px" }}>{org.joined}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default OrganizersList;
