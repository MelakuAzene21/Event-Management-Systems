import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { useGetMonthlyRevenueQuery } from "../features/api/apiSlices";
import { Card, CardContent, Typography, CircularProgress } from "@mui/material";

const MonthlyRevenueChart = () => {
  const { data, error, isLoading } = useGetMonthlyRevenueQuery();
  const [chartData, setChartData] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);

  useEffect(() => {
    if (data) {
      setTotalRevenue(data.totalRevenue); // Set total revenue

      // Convert API data to chart format
      const formattedData = data.monthlyRevenue.map((item) => ({
        month: new Date(item._id.year, item._id.month - 1).toLocaleString(
          "default",
          { month: "short" }
        ),
        revenue: item.totalRevenue,
      }));
      setChartData(formattedData);
    }
  }, [data]);

  if (isLoading)
    return (
      <Card
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: 200,
          boxShadow: 3,
          borderRadius: 2,
        }}
      >
        <CircularProgress />
      </Card>
    );

  if (error)
    return (
      <Typography
        color="error"
        align="center"
        sx={{ mt: 2, fontSize: "1.2rem", fontWeight: "bold" }}
      >
        Error fetching data
      </Typography>
    );

  return (
    <Card sx={{ boxShadow: 3, borderRadius: 2, p: 3, bgcolor: "#F9FAFB" }}>
      <CardContent>
        {/* Dashboard Title */}
        <Typography variant="h5" fontWeight="bold" color="primary" gutterBottom>
          Revenue Dashboard
        </Typography>

        {/* Total Revenue Display */}
        <Typography
          variant="h4"
          color="success.main"
          fontWeight="bold"
          align="center"
          gutterBottom
        >
          Total Revenue: {totalRevenue.toLocaleString()} ETB
        </Typography>

        {/* Monthly Revenue Chart */}
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
            <XAxis dataKey="month" stroke="#37474F" tick={{ fontSize: 14 }} />
            <YAxis stroke="#37474F" tick={{ fontSize: 14 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#FFF",
                border: "1px solid #CCC",
              }}
            />
            <Bar
              dataKey="revenue"
              fill="#1976D2"
              barSize={50}
              radius={[5, 5, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default MonthlyRevenueChart;
