// components/VendorDetails.js

import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetVendorDetailsQuery } from "../features/api/apiSlices";
import {
  Container,
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Avatar,
  Chip,
  CircularProgress,
  Link,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EmailIcon from "@mui/icons-material/Email";
import WorkIcon from "@mui/icons-material/Work";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import DescriptionIcon from "@mui/icons-material/Description";

// Helper function to format location (handles GeoJSON or string)
const formatLocation = (location) => {
  if (!location) return "Location not specified";
  if (typeof location === "string") return location; // If it's already a string
  if (location.coordinates && Array.isArray(location.coordinates)) {
    const [lng, lat] = location.coordinates;
    return `${lat.toFixed(4)}, ${lng.toFixed(4)}`; // Format GeoJSON coordinates
  }
  return "Location not specified"; // Fallback for unexpected formats
};

// Helper function to format document or portfolio item
const formatItem = (item) => {
  if (!item) return "N/A";
  if (typeof item === "string") return item;
  return item.title || item.description || JSON.stringify(item); // Fallback to object string
};

const VendorDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: vendorData, isLoading, error } = useGetVendorDetailsQuery(id);

  const vendor = vendorData?.vendor;

  if (isLoading) {
    return (
      <Container sx={{ py: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error || !vendor) {
    return (
      <Container sx={{ py: 4 }}>
        <Typography color="error">
          {error ? "Error loading vendor details" : "Vendor not found"}
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 6, bgcolor: "#f9fafb" }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate("/admin/vendors")}
        color="primary"
        sx={{ mb: 4, textTransform: "none", fontWeight: "medium" }}
      >
        Back to Vendors
      </Button>

      <Typography
        variant="h3"
        component="h1"
        gutterBottom
        sx={{ fontWeight: "bold", color: "#1e293b", mb: 2 }}
      >
        Vendor Details
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={6}>
        Complete information about {vendor.name}
      </Typography>

      {/* Profile Section */}
      <Card elevation={3} sx={{ mb: 4, borderRadius: 3 }}>
        <CardContent sx={{ display: "flex", alignItems: "center", p: 4 }}>
          <Avatar sx={{ width: 80, height: 80, mr: 3, bgcolor: "grey.200" }} />
          <Box sx={{ flex: 1 }}>
            <Typography variant="h4" fontWeight="bold" color="#1e293b">
              {vendor.name}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 1 }}>
              <Chip
                label={vendor.status}
                size="medium"
                sx={{
                  backgroundColor:
                    vendor.status === "Active"
                      ? "#e8f5e9"
                      : vendor.status === "Pending"
                      ? "#fff3e0"
                      : "#fce4ec",
                  color:
                    vendor.status === "Active"
                      ? "#2e7d32"
                      : vendor.status === "Pending"
                      ? "#ed6c02"
                      : "#d32f2f",
                  fontWeight: "bold",
                }}
              />
              <Typography variant="body1" color="text.secondary">
                ⭐ {vendor.rating || 0}
              </Typography>
            </Box>
          </Box>
          <Typography variant="h5" fontWeight="bold" color="#1e40af">
            $ {vendor.price || 0}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Starting Price
          </Typography>
        </CardContent>
      </Card>

      {/* Details Section */}
      <Box sx={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
        {/* Left Column: Vendor Info */}
        <Card
          elevation={3}
          sx={{ flex: 2, minWidth: "300px", borderRadius: 3 }}
        >
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h6" fontWeight="bold" color="#1e293b" mb={2}>
              Description
            </Typography>
            <Typography variant="body1" color="text.secondary" mb={4}>
              {vendor.description || "No description available."}
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <EmailIcon sx={{ color: "#64748b", mr: 2 }} />
              <Typography variant="body1">
                <Link
                  href={`mailto:${vendor.email}`}
                  color="primary"
                  sx={{ textDecoration: "none" }}
                >
                  {vendor.email}
                </Link>
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <WorkIcon sx={{ color: "#64748b", mr: 2 }} />
              <Typography variant="body1" color="text.secondary">
                {vendor.serviceProvided || "N/A"}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <LocationOnIcon sx={{ color: "#64748b", mr: 2 }} />
              <Typography variant="body1" color="text.secondary">
                {formatLocation(vendor.location)}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <EventAvailableIcon sx={{ color: "#64748b", mr: 2 }} />
              <Typography variant="body1" color="text.secondary">
                {vendor.availability || "Availability not specified"}
              </Typography>
            </Box>
          </CardContent>
        </Card>

        {/* Right Column: Documents and Portfolio */}
        <Box sx={{ flex: 1, minWidth: "300px" }}>
          <Card elevation={3} sx={{ mb: 4, borderRadius: 3 }}>
            <CardContent sx={{ p: 4 }}>
              <Typography
                variant="h6"
                fontWeight="bold"
                color="#1e293b"
                gutterBottom
              >
                Documents & Licenses
              </Typography>
              {vendor.documents && vendor.documents.length > 0 ? (
                vendor.documents.map((doc, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      p: 2,
                      bgcolor: "#f9fafb",
                      borderRadius: 2,
                      mb: 1,
                    }}
                  >
                    <Typography variant="body1" color="text.secondary">
                      {formatItem(doc)}
                    </Typography>
                    <DescriptionIcon sx={{ color: "#64748b" }} />
                  </Box>
                ))
              ) : (
                <Typography variant="body1" color="text.secondary">
                  No documents available.
                </Typography>
              )}
            </CardContent>
          </Card>

          <Card elevation={3} sx={{ borderRadius: 3 }}>
            <CardContent sx={{ p: 4 }}>
              <Typography
                variant="h6"
                fontWeight="bold"
                color="#1e293b"
                gutterBottom
              >
                Portfolio
              </Typography>
              {vendor.portfolio && vendor.portfolio.length > 0 ? (
                vendor.portfolio.map((item, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      p: 2,
                      bgcolor: "#f9fafb",
                      borderRadius: 2,
                      mb: 1,
                    }}
                  >
                    <Typography variant="body1" color="text.secondary">
                      {formatItem(item)}
                    </Typography>
                    <DescriptionIcon sx={{ color: "#64748b" }} />
                  </Box>
                ))
              ) : (
                <Typography variant="body1" color="text.secondary">
                  No portfolio items available.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Container>
  );
};

export default VendorDetails;
