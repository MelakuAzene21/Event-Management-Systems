import React from "react";
import { useGetEventsQuery } from "../features/api/apiSlices";
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
} from "@mui/material";
import EventIcon from "@mui/icons-material/Event";

const Events = () => {
  const { data, error, isLoading } = useGetEventsQuery();
  const events = Array.isArray(data) ? data : data?.events || [];

  if (isLoading) {
    return (
      <div
        style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}
      >
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <Alert severity="error">
        Failed to load events. Please try again later.
      </Alert>
    );
  }

  return (
    <Paper elevation={3} sx={{ padding: 3, borderRadius: 3 }}>
      <Typography variant="h5" align="center" gutterBottom>
        <EventIcon fontSize="large" style={{ marginRight: "10px" }} />
        Event List
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: "#f4f4f4" }}>
            <TableRow>
              <TableCell>
                <strong>Event Name</strong>
              </TableCell>
              <TableCell>
                <strong>Date</strong>
              </TableCell>
              <TableCell>
                <strong>Time</strong>
              </TableCell>
              <TableCell>
                <strong>Location</strong>
              </TableCell>
              <TableCell>
                <strong>Organizer</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {events.map((event) => (
              <TableRow key={event._id}>
                <TableCell>{event.title}</TableCell>
                <TableCell>
                  {new Date(event.eventDate).toLocaleDateString()}
                </TableCell>
                <TableCell>{event.eventTime}</TableCell>
                <TableCell>{event.location}</TableCell>
                <TableCell>
                 
                  {event.organizer?.name} <br />
                  <Typography variant="caption" color="textSecondary">
                    {event.organizer?.email}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default Events;
