import React, { useState, useEffect } from "react";
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
} from "@mui/material";
import EventIcon from "@mui/icons-material/Event";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import RestoreIcon from "@mui/icons-material/Restore";

const Events = () => {
  const { data, error, isLoading } = useGetEventsAdminQuery();
  const [updateEventStatus] = useUpdateEventStatusMutation();
  const events = Array.isArray(data) ? data : data?.events || [];
  const today = new Date();

  // State for tabs and filtered events
  const [tabValue, setTabValue] = useState("all");
  const [filteredEvents, setFilteredEvents] = useState([]);

  // Filter events based on tab selection
  useEffect(() => {
    let result = [...events];
    if (tabValue !== "all") {
      result = result.filter((event) => event.status === tabValue);
    }
    setFilteredEvents(result);
  }, [tabValue, events]);

  // Handlers
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
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
      sx={{ p: 3, borderRadius: 3, maxWidth: "1200px", mx: "auto", mt: 4 }}
    >
      <Typography
        variant="h5"
        align="center"
        gutterBottom
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <EventIcon fontSize="large" sx={{ mr: 1 }} />
        Event List
      </Typography>

      {/* Tabs */}
      <Box sx={{ mb: 3, borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            "& .MuiTab-root": { textTransform: "none", fontWeight: "bold" },
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
          <TableHead sx={{ backgroundColor: "#f4f4f4" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Event Name</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Date</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Time</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Location</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Organizer</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Total Attendees</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredEvents.map((event) => {
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
                  sx={{ "&:hover": { backgroundColor: "#f9f9f9" } }}
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
                    <Typography variant="caption" color="textSecondary">
                      {event.organizer?.email}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      color={
                        status === "Completed"
                          ? "error"
                          : status === "Approved"
                          ? "success"
                          : status === "Pending"
                          ? "warning"
                          : "error"
                      }
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
                            sx={{ textTransform: "none" }}
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
                            sx={{ textTransform: "none" }}
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
                            sx={{ textTransform: "none" }}
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

      {/* Empty State */}
      {filteredEvents.length === 0 && (
        <Typography
          sx={{ textAlign: "center", py: 4, color: "text.secondary" }}
        >
          No events found for the selected status.
        </Typography>
      )}
    </Paper>
  );
};

export default Events;
