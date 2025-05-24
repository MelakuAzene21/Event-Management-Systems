import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  useGetEventsAdminQuery,
  useUpdateEventStatusMutation,
} from "../features/api/apiSlices";
import { toast } from "react-toastify";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  Typography,
  Tabs,
  Tab,
  Box,
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Pagination,
} from "@mui/material";
import EventIcon from "@mui/icons-material/Event";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import RestoreIcon from "@mui/icons-material/Restore";
import SearchIcon from "@mui/icons-material/Search";

const Events = () => {
  const { data, error, isLoading } = useGetEventsAdminQuery();
  const [updateEventStatus] = useUpdateEventStatusMutation();
  const events = Array.isArray(data) ? data : data?.events || [];
  const today = new Date();

  // State for tabs, search, filters, and pagination
  const [tabValue, setTabValue] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDate, setFilterDate] = useState("all");
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [filteredEvents, setFilteredEvents] = useState([]);

  // Filter and search logic
  useEffect(() => {
    let result = [...events];

    // Apply tab filter
    if (tabValue !== "all") {
      result = result.filter((event) => event.status === tabValue);
    }

    // Apply search
    if (searchQuery) {
      result = result.filter(
        (event) =>
          event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.organizer?.name
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          event.location.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply date filter
    if (filterDate !== "all") {
      const now = new Date();
      if (filterDate === "upcoming") {
        result = result.filter((event) => new Date(event.eventDate) >= now);
      } else if (filterDate === "past") {
        result = result.filter((event) => new Date(event.eventDate) < now);
      }
    }

    setFilteredEvents(result);
  }, [tabValue, searchQuery, filterDate, events]);

  // Pagination logic
  const paginatedEvents = useMemo(() => {
    const startIndex = (page - 1) * rowsPerPage;
    return filteredEvents.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredEvents, page, rowsPerPage]);

  // Handlers
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setPage(1); // Reset to first page on tab change
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setPage(1); // Reset to first page on search
  };

  const handleFilterDateChange = (event) => {
    setFilterDate(event.target.value);
    setPage(1); // Reset to first page on filter change
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleApproval = async (eventId, status) => {
    try {
      await updateEventStatus({ eventId, status }).unwrap();
      toast.success(
        `Event ${status === "pending" ? "restored" : status} successfully!`
      );
    } catch (error) {
      console.error("Error updating event status:", error);
      toast.error("Failed to update event status.");
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        Failed to load events. Please try again later.
      </Alert>
    );
  }

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        borderRadius: 2,
        maxWidth: "1200px",
        mx: "auto",
        mt: 4,
        bgcolor: "background.paper",
      }}
    >
      <Typography
        variant="h5"
        align="center"
        gutterBottom
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "text.primary",
          fontWeight: "bold",
        }}
      >
        <EventIcon fontSize="large" sx={{ mr: 1, color: "primary.main" }} />
        Event Management Dashboard
      </Typography>

      {/* Search and Filter Controls */}
      <Box sx={{ mb: 3, display: "flex", gap: 2, flexWrap: "wrap" }}>
        <TextField
          label="Search Events"
          variant="outlined"
          value={searchQuery}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <SearchIcon sx={{ mr: 1, color: "text.secondary" }} />
            ),
          }}
          sx={{
            flex: 1,
            minWidth: "200px",
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              bgcolor: "grey.50",
            },
          }}
        />
        <FormControl sx={{ minWidth: "150px" }}>
          <InputLabel>Date Filter</InputLabel>
          <Select
            value={filterDate}
            onChange={handleFilterDateChange}
            label="Date Filter"
            sx={{
              borderRadius: 2,
              bgcolor: "grey.50",
            }}
          >
            <MenuItem value="all">All Dates</MenuItem>
            <MenuItem value="upcoming">Upcoming</MenuItem>
            <MenuItem value="past">Past</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Tabs */}
      <Box sx={{ mb: 3, borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: "bold",
              color: "text.secondary",
            },
            "& .Mui-selected": {
              color: "primary.main",
            },
            "& .MuiTabs-indicator": {
              backgroundColor: "primary.main",
            },
            bgcolor: "grey.100",
            borderRadius: 2,
            p: 1,
          }}
        >
          <Tab label="All" value="all" />
          <Tab label="Pending" value="pending" />
          <Tab label="Approved" value="approved" />
          <Tab label="Rejected" value="rejected" />
        </Tabs>
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 1 }}>
        <Table>
          <TableHead sx={{ bgcolor: "grey.100" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold", color: "text.primary" }}>
                Event Name
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "text.primary" }}>
                Date
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "text.primary" }}>
                Time
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "text.primary" }}>
                Location
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "text.primary" }}>
                Organizer
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "text.primary" }}>
                Status
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "text.primary" }}>
                Total Attendees
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "text.primary" }}>
                Action
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedEvents.map((event) => {
              const eventDate = new Date(event.eventDate);
              const status =
                eventDate < today
                  ? "Completed"
                  : event.status.charAt(0).toUpperCase() +
                    event.status.slice(1);
              const totalAttendees =
                event.ticketTypes?.reduce(
                  (sum, ticket) => sum + ticket.limit,
                  0
                ) || 0;

              return (
                <TableRow
                  key={event._id}
                  sx={{
                    "&:hover": { bgcolor: "grey.50" },
                  }}
                >
                  <TableCell>{event.title}</TableCell>
                  <TableCell>
                    {eventDate.toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </TableCell>
                  <TableCell>{event.eventTime}</TableCell>
                  <TableCell>{event.location.name?.split(",")[0]}</TableCell>
                  <TableCell>
                    {event.organizer?.name} <br />
                    <Typography variant="caption" color="text.secondary">
                      {event.organizer?.email}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      sx={{
                        color:
                          status === "Completed"
                            ? "error.main"
                            : status === "Approved"
                            ? "success.main"
                            : status === "Pending"
                            ? "warning.main"
                            : "error.main",
                        fontWeight: "medium",
                      }}
                    >
                      {status}
                    </Typography>
                  </TableCell>
                  <TableCell>{totalAttendees}</TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                      <Link
                        to={`/events/${event._id}`}
                        style={{
                          textDecoration: "none",
                          fontWeight: "bold",
                          color: "#1E88E5",
                        }}
                        sx={{
                          "&:hover": {
                            textDecoration: "underline",
                          },
                        }}
                      >
                        View Details →
                      </Link>
                      {tabValue === "pending" && event.status === "pending" && (
                        <>
                          <Button
                            variant="contained"
                            color="success"
                            size="small"
                            startIcon={<CheckCircleIcon />}
                            onClick={() =>
                              handleApproval(event._id, "approved")
                            }
                            sx={{
                              textTransform: "none",
                              borderRadius: 2,
                              "&:hover": {
                                bgcolor: "success.dark",
                              },
                            }}
                          >
                            Approve
                          </Button>
                          <Button
                            variant="contained"
                            color="error"
                            size="small"
                            startIcon={<CancelIcon />}
                            onClick={() =>
                              handleApproval(event._id, "rejected")
                            }
                            sx={{
                              textTransform: "none",
                              borderRadius: 2,
                              "&:hover": {
                                bgcolor: "error.dark",
                              },
                            }}
                          >
                            Reject
                          </Button>
                        </>
                      )}
                      {tabValue === "rejected" &&
                        event.status === "rejected" && (
                          <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            startIcon={<RestoreIcon />}
                            onClick={() => handleApproval(event._id, "pending")}
                            sx={{
                              textTransform: "none",
                              borderRadius: 2,
                              "&:hover": {
                                bgcolor: "primary.dark",
                              },
                            }}
                          >
                            Restore
                          </Button>
                        )}
                    </Box>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mt: 3,
          p: 2,
          bgcolor: "grey.100",
          borderRadius: 2,
        }}
      >
        <Pagination
          count={Math.ceil(filteredEvents.length / rowsPerPage)}
          page={page}
          onChange={handlePageChange}
          color="primary"
          sx={{
            "& .MuiPaginationItem-root": {
              borderRadius: 1,
            },
          }}
        />
      </Box>

      {/* Empty State */}
      {filteredEvents.length === 0 && (
        <Typography
          sx={{
            textAlign: "center",
            py: 4,
            color: "text.secondary",
            fontStyle: "italic",
          }}
        >
          No events found for the selected criteria.
        </Typography>
      )}

      
    </Paper>
  );
};

export default Events;
