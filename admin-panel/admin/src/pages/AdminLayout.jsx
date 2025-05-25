/* eslint-disable no-undef */
import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Box,
  CssBaseline,
  AppBar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Badge,
  Divider,
  Fade,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import EventIcon from "@mui/icons-material/Event";
import BarChartIcon from "@mui/icons-material/BarChart";
import BusinessIcon from "@mui/icons-material/Business";
import CategoryIcon from "@mui/icons-material/Category";
import NotificationsIcon from "@mui/icons-material/Notifications";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { ToastContainer } from "react-toastify";
import { useSelector } from "react-redux";
import axios from "axios";

const socket = io(
  process.env.NODE_ENV === "production"
    ? "https://event-management-systems-gj91.onrender.com"
    : "http://localhost:5000",
  {
    transports: ["websocket", "polling"],
  }
);

const drawerWidth = 240;
const baseUrl =
  process.env.NODE_ENV === 'production'
    ? 'https://event-management-systems-gj91.onrender.com'
    : 'http://localhost:5000';


const menuItems = [
  { text: "Dashboard", icon: <DashboardIcon />, path: "/admin/dashboard" },
  { text: "Users", icon: <PeopleIcon />, path: "/admin/users" },
  { text: "Events", icon: <EventIcon />, path: "/admin/events" },
  { text: "Analytics", icon: <BarChartIcon />, path: "/admin/analytic" },
  { text: "Reports", icon: <BarChartIcon />, path: "/admin/report" },
  { text: "Categories", icon: <CategoryIcon />, path: "/admin/category" },
  { text: "Vendors", icon: <BusinessIcon />, path: "/admin/vendors" },
  { text: "Organizers", icon: <BusinessIcon />, path: "/admin/organizers" },
];

const AdminLayout = () => {
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifAnchor, setNotifAnchor] = useState(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (user && user._id) {
        try {
          const res = await axios.get(
            `${baseUrl}/api/notifications/admin/${user._id}`,
            { withCredentials: true }
          );
          setNotifications(res.data);
        } catch (error) {
          console.error("Error fetching notifications:", error);
        }
      }
    };

    fetchNotifications();

    socket.on("connect", () => {
      console.log("Connected to WebSocket:", socket.id);
      if (user && user._id) {
        socket.emit("join", user._id);
      }
    });

    socket.on("disconnect", () => {
      console.warn("Socket disconnected. Attempting to reconnect...");
      setTimeout(() => {
        socket.connect();
      }, 3000);
    });

    socket.on("event-approval-request", (data) => {
      setNotifications((prev) => {
        if (!prev.some((n) => n._id === data._id)) {
          return [...prev, data];
        }
        return prev;
      });
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("event-approval-request");
    };
  }, [user]);

  useEffect(() => {
    if (user && user._id) {
      socket.emit("join", user._id);
    }
  }, [user]);

  const handleNotificationClick = async (notif) => {
    if (notif.eventId) {
      navigate(`/admin/events/${notif.eventId}`);
      try {
        await axios.post(
          `${baseUrl}/api/notifications/admin/mark-read`,
          { notificationId: notif._id, adminId: user._id },
          { withCredentials: true }
        );
        setNotifications((prev) =>
          prev.map((n) => (n._id === notif._id ? { ...n, isRead: true } : n))
        );
      } catch (error) {
        console.error("Error marking notification as read:", error);
      }
    }
    handleNotifClose();
  };

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleNotifOpen = async (event) => setNotifAnchor(event.currentTarget);
  const handleNotifClose = () => setNotifAnchor(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <CssBaseline />

      {/* Sidebar Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
            bgcolor: "grey.200",
            color: "grey.100",
            boxShadow: 3,
            borderRight: "none",
          },
        }}
      >
        <Toolbar>
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              color: "black",
              textTransform: "uppercase",
              letterSpacing: 1,
            }}
          >
            Admin Panel
          </Typography>
        </Toolbar>
        <Divider sx={{ bgcolor: "grey.700", my: 1 }} />
        <List>
          {menuItems.map((item, index) => (
            <ListItem
              key={item.text}
              onClick={() => navigate(item.path)}
              sx={{
                cursor: "pointer",
                py: 1.5,
                borderRadius: 1,
                mx: 1,
                mb: 0.5,
                transition: "all 0.3s ease",
                "&:hover": {
                  bgcolor: "grey.300",
                  transform: "translateX(4px)",
                },
                "&:hover .MuiListItemIcon-root": {
                  color: "primary.main",
                },
                bgcolor:
                  window.location.pathname === item.path
                    ? "grey.300"
                    : "transparent",
              }}
            >
              <ListItemIcon sx={{ color: "black", minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography sx={{ fontWeight: "medium", color: "black" }}>
                    {item.text}
                  </Typography>
                }
              />
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: `calc(100% - ${drawerWidth}px)`,
          bgcolor: "grey.100",
          p: { xs: 2, md: 3 },
          minHeight: "100vh",
        }}
      >
        {/* Top Navbar */}
        <AppBar
          position="fixed"
          sx={{
            width: `calc(100% - ${drawerWidth}px)`,
            ml: `${drawerWidth}px`,
            bgcolor: "white",
            color: "text.primary",
            boxShadow: 2,
            borderBottom: "1px solid",
            borderColor: "grey.200",
          }}
        >
          <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography
              variant="h6"
              noWrap
              sx={{ fontWeight: "bold", color: "primary.main" }}
            >
              Admin Control Center
            </Typography>

            {/* Notifications and Profile */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <IconButton
                onClick={handleNotifOpen}
                sx={{
                  color: "grey.600",
                  "&:hover": { bgcolor: "grey.100" },
                }}
              >
                <Badge
                  badgeContent={notifications.filter((n) => !n.isRead).length}
                  color="error"
                >
                  <NotificationsIcon />
                </Badge>
              </IconButton>
              <Menu
                anchorEl={notifAnchor}
                open={Boolean(notifAnchor)}
                onClose={handleNotifClose}
                PaperProps={{
                  sx: {
                    maxWidth: 300,
                    borderRadius: 2,
                    boxShadow: 3,
                    mt: 1,
                  },
                }}
              >
                {notifications.length === 0 ? (
                  <MenuItem disabled sx={{ py: 2, color: "text.secondary" }}>
                    No new notifications
                  </MenuItem>
                ) : (
                  notifications.map((notif, index) => (
                    <MenuItem
                      key={index}
                      onClick={() => handleNotificationClick(notif)}
                      sx={{
                        py: 1.5,
                        bgcolor: notif.isRead ? "grey.50" : "white",
                        "&:hover": { bgcolor: "grey.100" },
                      }}
                    >
                      <Box>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: notif.isRead ? "normal" : "bold",
                            color: "text.primary",
                          }}
                        >
                          {notif.message}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ color: "text.secondary" }}
                        >
                          {new Date(notif.createdAt).toLocaleTimeString()}
                        </Typography>
                      </Box>
                    </MenuItem>
                  ))
                )}
              </Menu>

              <IconButton
                onClick={handleMenuOpen}
                sx={{
                  color: "grey.600",
                  "&:hover": { bgcolor: "grey.100" },
                }}
              >
                <Avatar
                  sx={{
                    width: 36,
                    height: 36,
                    bgcolor: "primary.main",
                    color: "white",
                  }}
                >
                  {user?.name?.charAt(0) || <AccountCircleIcon />}
                </Avatar>
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                PaperProps={{
                  sx: {
                    borderRadius: 2,
                    boxShadow: 3,
                    mt: 1,
                  },
                }}
              >
                <MenuItem
                  onClick={() => {
                    navigate("/admin/profile");
                    handleMenuClose();
                  }}
                  sx={{ py: 1.5 }}
                >
                  <AccountCircleIcon sx={{ mr: 1, color: "grey.600" }} />
                  Profile
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    handleLogout();
                    handleMenuClose();
                  }}
                  sx={{ py: 1.5 }}
                >
                  <LogoutIcon sx={{ mr: 1, color: "grey.600" }} />
                  Logout
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Toast Notification */}
        <ToastContainer position="top-center" autoClose={3000} />

        {/* Offset for Fixed Navbar */}
        <Toolbar />

        {/* Render the selected page */}
        <Fade in timeout={600}>
          <Box sx={{ maxWidth: 1400, mx: "auto" }}>
            <Outlet />
          </Box>
        </Fade>
      </Box>
    </Box>
  );
};

export default AdminLayout;
