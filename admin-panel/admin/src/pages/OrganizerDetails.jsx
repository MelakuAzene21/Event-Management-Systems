import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetOrganizerDetailsQuery } from "../features/api/apiSlices";
import {
  Container,
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Avatar,
  Link,
  CircularProgress,
  Chip,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PhoneIcon from "@mui/icons-material/Phone";
import LanguageIcon from "@mui/icons-material/Language";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";

const OrganizerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: organizer, isLoading, error } = useGetOrganizerDetailsQuery(id);

  if (isLoading) {
    return (
      <Container sx={{ py: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 4 }}>
        <Typography color="error">Error loading details</Typography>
      </Container>
    );
  }

  if (!organizer) {
    return (
      <Container sx={{ py: 4 }}>
        <Typography color="text.secondary">Organizer not found</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 6, bgcolor: "#f9fafb" }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate("/admin/organizers")}
        color="primary"
        sx={{ mb: 4, textTransform: "none", fontWeight: "medium" }}
      >
        Back to Organizers
      </Button>

      {/* Profile Section */}
      <Card elevation={3} sx={{ mb: 4, borderRadius: 3 }}>
        <CardContent sx={{ display: "flex", alignItems: "center", p: 4 }}>
          <Avatar sx={{ width: 80, height: 80, mr: 3, bgcolor: "grey.200" }} />
          <Box>
            <Typography variant="h4" fontWeight="bold" color="#1e293b">
              {organizer.name}
            </Typography>
            <Typography variant="h6" color="#64748b" mb={1}>
              {organizer.organizationName}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {organizer.email}
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Chip
                label={organizer.status}
                size="medium"
                sx={{
                  backgroundColor:
                    organizer.status === "Approved"
                      ? "#e8f5e9"
                      : organizer.status === "Pending"
                      ? "#fff3e0"
                      : "#fce4ec",
                  color:
                    organizer.status === "Approved"
                      ? "#2e7d32"
                      : organizer.status === "Pending"
                      ? "#ed6c02"
                      : "#d32f2f",
                  fontWeight: "bold",
                }}
              />
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Contact Info, About, and Social Links */}
      <Box sx={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
        {/* Contact Info Section */}
        <Card
          elevation={3}
          sx={{ flex: 1, minWidth: "300px", borderRadius: 3 }}
        >
          <CardContent sx={{ p: 4 }}>
            <Typography
              variant="h6"
              fontWeight="bold"
              color="#1e293b"
              gutterBottom
            >
              Contact Information
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <PhoneIcon sx={{ color: "#64748b", mr: 2 }} />
              <Typography variant="body1" color="text.secondary">
                {organizer.phoneNumber || "N/A"}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <LanguageIcon sx={{ color: "#64748b", mr: 2 }} />
              <Typography variant="body1">
                {organizer.website ? (
                  <Link
                    href={organizer.website}
                    color="primary"
                    sx={{ textDecoration: "none" }}
                  >
                    {organizer.website}
                  </Link>
                ) : (
                  "N/A"
                )}
              </Typography>
            </Box>
          </CardContent>
        </Card>

        {/* About Section */}
        <Card
          elevation={3}
          sx={{ flex: 2, minWidth: "300px", borderRadius: 3 }}
        >
          <CardContent sx={{ p: 4 }}>
            <Typography
              variant="h6"
              fontWeight="bold"
              color="#1e293b"
              gutterBottom
            >
              About {organizer.organizationName}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {organizer.about ||
                "No information available about this organizer."}
            </Typography>
            <Box sx={{ mt: 3 }}>
              <Typography variant="body1" color="text.secondary">
                <strong>Experience:</strong> {organizer.experience || "N/A"}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                <strong>Joined:</strong> {organizer.joined}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Social Links Section */}
      <Card elevation={3} sx={{ mt: 4, borderRadius: 3 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography
            variant="h6"
            fontWeight="bold"
            color="#1e293b"
            gutterBottom
          >
            Social Media
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={2}>
            Connect with {organizer.name}
          </Typography>
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            {organizer.socialLinks && organizer.socialLinks.length > 0 ? (
              organizer.socialLinks.map((link, index) => {
                const platform = link.toLowerCase();
                return (
                  <Button
                    key={index}
                    variant="outlined"
                    startIcon={
                      platform.includes("facebook") ? (
                        <FacebookIcon />
                      ) : platform.includes("twitter") ? (
                        <TwitterIcon />
                      ) : platform.includes("instagram") ? (
                        <InstagramIcon />
                      ) : platform.includes("linkedin") ? (
                        <LinkedInIcon />
                      ) : null
                    }
                    href={link}
                    target="_blank"
                    sx={{
                      textTransform: "none",
                      borderRadius: 2,
                      color: "#64748b",
                      borderColor: "#e5e7eb",
                      "&:hover": { borderColor: "#1e40af", color: "#1e40af" },
                    }}
                  >
                    {platform.includes("facebook")
                      ? "Facebook"
                      : platform.includes("twitter")
                      ? "Twitter"
                      : platform.includes("instagram")
                      ? "Instagram"
                      : platform.includes("linkedin")
                      ? "LinkedIn"
                      : "Social Link"}
                  </Button>
                );
              })
            ) : (
              <Typography variant="body1" color="text.secondary">
                No social links available.
              </Typography>
            )}
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default OrganizerDetails;
