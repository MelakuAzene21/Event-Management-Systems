import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Divider,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemText,
  Card,
  CardContent,
  Grid,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EmailIcon from "@mui/icons-material/Email";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import StarIcon from "@mui/icons-material/Star";
import EventIcon from "@mui/icons-material/Event";

const UserDetails = ({ user, open, onClose }) => {
  if (!user) return null;

  const renderOrganizerDetails = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Organizer Details
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="subtitle1" color="text.secondary">
                Service Provided
              </Typography>
              <Typography variant="body1">
                {user.serviceProvided || "Not specified"}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="subtitle1" color="text.secondary">
                Price
              </Typography>
              <Typography variant="body1">
                {user.price || "Not specified"}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="subtitle1" color="text.secondary">
                Portfolio
              </Typography>
              <Typography variant="body1">
                {user.portfolio?.length > 0
                  ? user.portfolio.join(", ")
                  : "No portfolio items"}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );

  const renderVendorDetails = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Vendor Details
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="subtitle1" color="text.secondary">
                Service Provided
              </Typography>
              <Typography variant="body1">
                {user.serviceProvided || "Not specified"}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="subtitle1" color="text.secondary">
                Price
              </Typography>
              <Typography variant="body1">
                {user.price || "Not specified"}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="subtitle1" color="text.secondary">
                Availability
              </Typography>
              <Typography variant="body1">
                {user.availability || "Not specified"}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );

  const renderAttendeeDetails = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Attendee Details
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <Card variant="outlined">
        <CardContent>
          <Typography variant="subtitle1" color="text.secondary">
            Followed Organizers
          </Typography>
          <Typography variant="body1">
            {user.followedOrganizers?.length > 0
              ? user.followedOrganizers.join(", ")
              : "None followed"}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );

  const renderDetailsByRole = () => {
    switch (user.role) {
      case "organizer":
        return renderOrganizerDetails();
      case "vendor":
        return renderVendorDetails();
      case "user":
        return renderAttendeeDetails();
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle
        sx={{
          bgcolor: "primary.main",
          color: "white",
          display: "flex",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Avatar
          src={user.avatar}
          alt={user.name}
          sx={{ width: 56, height: 56 }}
        />
        <Box>
          <Typography variant="h5">{user.name}</Typography>
          <Chip label={user.role} color="secondary" size="small" />
        </Box>
      </DialogTitle>
      <DialogContent sx={{ mt: 2 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            General Information
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <List>
            <ListItem>
              <EmailIcon sx={{ mr: 2, color: "text.secondary" }} />
              <ListItemText primary="Email" secondary={user.email} />
            </ListItem>
            <ListItem>
              <LocationOnIcon sx={{ mr: 2, color: "text.secondary" }} />
              <ListItemText
                primary="Location"
                secondary={
                  user.location?.coordinates
                    ? `Lat: ${user.location.coordinates[0]}, Lon: ${user.location.coordinates[1]}`
                    : "Not specified"
                }
              />
            </ListItem>
            <ListItem>
              <EventIcon sx={{ mr: 2, color: "text.secondary" }} />
              <ListItemText
                primary="Joined At"
                secondary={new Date(user.createdAt).toLocaleDateString(
                  "en-US",
                  {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }
                )}
              />
            </ListItem>
            <ListItem>
              <StarIcon sx={{ mr: 2, color: "text.secondary" }} />
              <ListItemText
                primary="Rating"
                secondary={user.rating || "Not rated"}
              />
            </ListItem>
            <ListItem>
              <MonetizationOnIcon sx={{ mr: 2, color: "text.secondary" }} />
              <ListItemText primary="Status" secondary={user.status} />
            </ListItem>
          </List>
        </Box>
        {renderDetailsByRole()}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained" color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserDetails;
