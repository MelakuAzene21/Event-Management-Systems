import React from "react";
import { Link } from "react-router-dom";
import { Container, Box, Typography, Button, Fade, Paper } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline"; // Icon for the 404 theme
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch"; // Icon for the "Go Home" button

const NotFoundPage = () => {
  return (
    <Container
      component="main"
      maxWidth={false}
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "linear-gradient(145deg, #f0f9ff 0%, #e0e7ff 100%)", // Soft gradient background
        p: { xs: 2, sm: 4 },
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background Decorative Elements */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          opacity: 0.1,
          background: "radial-gradient(circle, #1976d2 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <Fade in timeout={800}>
        <Paper
          elevation={8}
          sx={{
            maxWidth: "32rem",
            width: "100%",
            borderRadius: 4,
            p: { xs: 3, sm: 5 },
            bgcolor: "white",
            boxShadow: "0 12px 40px rgba(0, 0, 0, 0.15)",
            border: "1px solid rgba(0, 0, 0, 0.05)",
            position: "relative",
            zIndex: 1,
            textAlign: "center",
          }}
        >
          {/* 404 Icon */}
          <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
            <ErrorOutlineIcon
              sx={{
                fontSize: 80,
                color: "#ef5350", // Red color for the error icon
                animation: "pulse 2s infinite",
                "@keyframes pulse": {
                  "0%": { transform: "scale(1)" },
                  "50%": { transform: "scale(1.1)" },
                  "100%": { transform: "scale(1)" },
                },
              }}
            />
          </Box>

          {/* 404 Title */}
          <Typography
            variant="h3"
            fontWeight={700}
            color="text.primary"
            gutterBottom
            sx={{
              fontSize: { xs: "2rem", sm: "2.5rem" },
              letterSpacing: "0.5px",
            }}
          >
            404 - Page Not Found
          </Typography>

          {/* Description */}
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mb: 4, px: { xs: 1, sm: 2 }, lineHeight: 1.6 }}
          >
            Oops! It looks like you’ve ventured into uncharted territory. The
            page you’re looking for doesn’t exist—or maybe it’s just hiding from
            you. Let’s get you back on track!
          </Typography>

          {/* Call to Action Button */}
          <Button
            component={Link}
            to="/"
            variant="contained"
            startIcon={<RocketLaunchIcon />}
            sx={{
              py: 1.5,
              px: 4,
              bgcolor: "primary.main",
              color: "white",
              borderRadius: "8px",
              textTransform: "none",
              fontSize: "1rem",
              fontWeight: 500,
              boxShadow: "0 3px 12px rgba(25, 118, 210, 0.3)",
              transition: "all 0.3s ease",
              "&:hover": {
                bgcolor: "primary.dark",
                boxShadow: "0 6px 20px rgba(25, 118, 210, 0.4)",
                transform: "translateY(-2px)",
              },
            }}
          >
            Take Me Home
          </Button>

          
        </Paper>
      </Fade>
    </Container>
  );
};

export default NotFoundPage;
