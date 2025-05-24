import React from "react";
import { Box, Typography, CircularProgress, Alert, Paper } from "@mui/material";
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
import { useGetEventsByCategoryQuery } from "../features/api/apiSlices";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const EventsByCategoryChart = () => {
  const { data, error, isLoading } = useGetEventsByCategoryQuery();

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
        Failed to load data. Please try again later.
      </Alert>
    );
  }

  // Prepare chart data
  const chartData = {
    labels: data.map((item) => item.categoryName),
    datasets: [
      {
        label: "Number of Events",
        data: data.map((item) => item.count),
        backgroundColor: "rgba(25, 118, 210, 0.6)", // MUI primary color
        borderColor: "rgba(25, 118, 210, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Events by Category",
        font: { size: 18 },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Number of Events",
        },
        ticks: {
          stepSize: 1, // Force y-axis to use whole numbers
          precision: 0, // Ensure no decimal places
        },
      },
      x: {
        title: {
          display: true,
          text: "Category",
        },
      },
    },
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        borderRadius: 2,
        maxWidth: "800px",
        mx: "auto",
        mt: 4,
        bgcolor: "background.paper",
      }}
    >
      <Typography
        variant="h5"
        align="center"
        gutterBottom
        sx={{ color: "text.primary", fontWeight: "bold" }}
      >
        Events Distribution by Category
      </Typography>
      <Box sx={{ mt: 2 }}>
        <Bar data={chartData} options={options} />
      </Box>
      {data.length === 0 && (
        <Typography
          sx={{
            textAlign: "center",
            py: 4,
            color: "text.secondary",
            fontStyle: "italic",
          }}
        >
          No events found.
        </Typography>
      )}
    </Paper>
  );
};

export default EventsByCategoryChart;
