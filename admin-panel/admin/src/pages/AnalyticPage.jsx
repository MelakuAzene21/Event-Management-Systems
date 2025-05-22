import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useGetAnalyticsDataQuery } from "../features/api/apiSlices";
import {
  Container,
  Typography,
  Grid,
  Paper,
  Box,
  CircularProgress,
  Alert,
} from "@mui/material";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const AnalyticsDashboard = () => {
  const { data, error, isLoading } = useGetAnalyticsDataQuery();

  if (isLoading) {
    return (
      <Container sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">Error: {error.message}</Alert>
      </Container>
    );
  }

  // Helper function to format labels (e.g., "Jan")
  const formatLabel = (item) => {
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return `${monthNames[item.month - 1]}`;
  };

  // Prepare data for charts
  const attendeeLabels = data.data.attendees.map(formatLabel);
  const attendeeCounts = data.data.attendees.map((item) => item.count);

  const vendorLabels = data.data.vendors.map(formatLabel);
  const vendorCounts = data.data.vendors.map((item) => item.count);

  const eventLabels = data.data.events.map(formatLabel);
  const eventCounts = data.data.events.map((item) => item.count);

  // Chart options (updated y-axis scale)
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, // Hide legend
      },
      title: {
        display: false, // Hide title within the chart
      },
      tooltip: {
        enabled: true,
        backgroundColor: "#1E90FF",
        titleColor: "#fff",
        bodyColor: "#fff",
        borderWidth: 1,
        borderColor: "#1E90FF",
      },
    },
    scales: {
      x: {
        grid: {
          display: false, // Hide x-axis grid lines
        },
        ticks: {
          color: "#555",
          font: {
            size: 12,
          },
        },
      },
      y: {
        beginAtZero: true,
        min: 0,
        max: 50, // Set max to 50 as requested
        ticks: {
          stepSize: 5, // Ticks at 5 intervals (0, 5, 10, ..., 50)
          color: "#555",
          font: {
            size: 12,
          },
        },
        grid: {
          borderDash: [5, 5], // Dashed grid lines
          color: "#e0e0e0", // Light grey grid lines
        },
      },
    },
    elements: {
      bar: {
        borderRadius: 5, // Rounded edges for bars
        borderWidth: 0,
      },
    },
  };

  // Chart data with solid blue color
  const attendeeChartData = {
    labels: attendeeLabels,
    datasets: [
      {
        label: "Attendees Registered",
        data: attendeeCounts,
        backgroundColor: "#1E90FF", // Solid blue color
        borderColor: "#1E90FF",
        borderWidth: 1,
      },
    ],
  };

  const vendorChartData = {
    labels: vendorLabels,
    datasets: [
      {
        label: "Vendors Registered",
        data: vendorCounts,
        backgroundColor: "#1E90FF",
        borderColor: "#1E90FF",
        borderWidth: 1,
      },
    ],
  };

  const eventChartData = {
    labels: eventLabels,
    datasets: [
      {
        label: "Events Created",
        data: eventCounts,
        backgroundColor: "#1E90FF",
        borderColor: "#1E90FF",
        borderWidth: 1,
      },
    ],
  };

  return (
    <Container
      maxWidth="xl"
      sx={{ py: 4, bgcolor: "#f5f5f5", minHeight: "100vh" }}
    >
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        sx={{ fontWeight: "bold", color: "#333" }}
      >
        Admin Analytics Dashboard
      </Typography>
      <Grid container spacing={3}>
        {/* Attendee Chart */}
        <Grid item xs={12} md={6} lg={4}>
          <Paper elevation={3} sx={{ p: 3, bgcolor: "#fff" }}>
            <Typography
              variant="h6"
              sx={{ mb: 2, fontWeight: "medium", color: "#555" }}
            >
              Attendee Growth
            </Typography>
            <Box sx={{ height: "300px" }}>
              <Bar data={attendeeChartData} options={chartOptions} />
            </Box>
          </Paper>
        </Grid>
        {/* Vendor Chart */}
        <Grid item xs={12} md={6} lg={4}>
          <Paper elevation={3} sx={{ p: 3, bgcolor: "#fff" }}>
            <Typography
              variant="h6"
              sx={{ mb: 2, fontWeight: "medium", color: "#555" }}
            >
              Vendor Growth
            </Typography>
            <Box sx={{ height: "300px" }}>
              <Bar data={vendorChartData} options={chartOptions} />
            </Box>
          </Paper>
        </Grid>
        {/* Event Chart */}
        <Grid item xs={12} md={6} lg={4}>
          <Paper elevation={3} sx={{ p: 3, bgcolor: "#fff" }}>
            <Typography
              variant="h6"
              sx={{ mb: 2, fontWeight: "medium", color: "#555" }}
            >
              Events Created
            </Typography>
            <Box sx={{ height: "300px" }}>
              <Bar data={eventChartData} options={chartOptions} />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AnalyticsDashboard;
