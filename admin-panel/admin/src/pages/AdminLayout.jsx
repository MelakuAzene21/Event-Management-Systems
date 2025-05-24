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
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import EventIcon from "@mui/icons-material/Event";
import BarChartIcon from "@mui/icons-material/BarChart";
import ChatIcon from "@mui/icons-material/Chat";
import BusinessIcon from "@mui/icons-material/Business";
import SettingsIcon from "@mui/icons-material/Settings";
import NotificationsIcon from "@mui/icons-material/Notifications";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { ToastContainer } from "react-toastify";
import { useSelector } from "react-redux";
import axios from "axios";
import { Settings2Icon } from "lucide-react";

const socket = io("http://localhost:5000", {
  transports: ["websocket", "polling"],
});
const drawerWidth = 200;

const menuItems = [
  { text: "Dashboard", icon: <DashboardIcon />, path: "/admin/dashboard" },
  { text: "Users", icon: <PeopleIcon />, path: "/admin/users" },
  { text: "Events", icon: <EventIcon />, path: "/admin/events" },
  { text: "Analytic", icon: <BarChartIcon />, path: "/admin/analytic" },
  { text: "Reports", icon: <BarChartIcon />, path: "/admin/report" },
  // { text: "Chats", icon: <ChatIcon />, path: "/admin/chats" },
  // { text: "Vendors", icon: <BusinessIcon />, path: "/admin/vendors" },
  // { text: "Settings", icon: <SettingsIcon />, path: "/admin/settings" },
  { text: "Category", icon: <Settings2Icon />, path: "/admin/category" },
  { text: "Vendors", icon: <BusinessIcon />, path: "/admin/vendors" },
  { text: "Organizers", icon: <BusinessIcon />, path: "/admin/organizers" },
];

const AdminLayout = () => {

  const handleNotificationClick = async(notif) => {
    if (notif.eventId) {
      navigate(`/admin/events/${notif.eventId}`);
      // Mark the notification as read
  try {
    await axios.post(
      "http://localhost:5000/api/notifications/admin/mark-read", // Adjust endpoint
      { notificationId: notif._id ,adminId: user._id},
      { withCredentials: true }
    );

    // Update the state to mark the notification as read locally
    setNotifications((prev) =>
      prev.map((n) => (n._id === notif._id ? { ...n, isRead: true } : n))
    );
  } catch (error) {
    console.error("Error marking notification as read:", error);
  }

    }
    handleNotifClose();
  };
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
            `http://localhost:5000/api/notifications/admin/${user._id}`,
            { withCredentials: true }
          );

          setNotifications(res.data); // Set only unread notifications
          console.log("Notifications from database:", res.data);
        } catch (error) {
          console.error("Error fetching notifications:", error);
        }
      }
    };

    fetchNotifications(); // Fetch notifications on mount

    socket.on("connect", () => {
      console.log("Connected to WebSocket:", socket.id);
      if (user && user._id) {
        socket.emit("join", user._id); // Rejoin on reconnect
      }
    });

    socket.on("disconnect", () => {
      console.warn("Socket disconnected. Attempting to reconnect...");
      setTimeout(() => {
        socket.connect();
      }, 3000); // Retry in 3 seconds
    });

    socket.on("event-approval-request", (data) => {
      console.log("Received event approval request:", data); // ✅ Add this

      setNotifications((prev) => {
        if (!prev.some((n) => n._id === data._id)) {
          // Avoid duplicate notifications
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
      console.log(`Joining socket room for admin: ${user._id}`);
      socket.emit("join", user._id);
    }
  }, [user]);



  // Handle Profile Menu
  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  // Handle Notification Menu
  // const handleNotifOpen = (event) => setNotifAnchor(event.currentTarget);

  const handleNotifOpen = async (event) => {
    setNotifAnchor(event.currentTarget);

//     // Send a request to mark all unread notifications as read
//     if (notifications.length > 0) {
//       try {
//         await axios.post(
//           "http://localhost:5000/api/notifications/admin/mark-read",
//           { adminId: user._id },
//           {
//             withCredentials: true,
//           }
//         );
// console.log("Notifications marked as read.");
//         // Update local state to mark all notifications as read
//         setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
//       } catch (error) {
//         console.error("Error marking notifications as read:", error);
//       }
//     }
  };


  const handleNotifClose = () => setNotifAnchor(null);

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
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
            backgroundColor: "#0d47a1",
            color: "white",
          },
        }}
      >
        <Toolbar />
        <List>
          {menuItems.map((item) => (
            <ListItem
              key={item.text}
              onClick={() => navigate(item.path)}
              sx={{
                cursor: "pointer",
                transition: "background-color 0.3s ease",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.2)", // Adjust color as needed
                },
              }}
            >
              <ListItemIcon sx={{ color: "white" }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
        <Divider sx={{ backgroundColor: "rgba(255,255,255,0.2)", my: 2 }} />
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: `calc(100% - ${drawerWidth}px)`,
          overflow: "auto",
          minHeight: "100vh",
          backgroundColor: "#f5f5f5",
        }}
      >
        {/* Top Navbar */}
        <AppBar
          position="fixed"
          sx={{
            width: `calc(100% - ${drawerWidth}px)`,
            ml: `${drawerWidth}px`,
            backgroundColor: "#0d47a1",
          }}
        >
          <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="h6" noWrap>
              Admin Panel
            </Typography>

            {/* Notifications and Profile */}
            <Box sx={{ display: "flex", alignItems: "center" }}>
              {/* Notifications */}
              <IconButton color="inherit" onClick={handleNotifOpen}>
                <Badge
                  badgeContent={notifications.filter((n) => !n.read).length}
                  color="error"
                >
                  <NotificationsIcon />
                </Badge>
              </IconButton>

              
              {/* // Modify the Notification Menu */}
              <Menu
                anchorEl={notifAnchor}
                open={Boolean(notifAnchor)}
                onClose={handleNotifClose}
              >
                {notifications.length === 0 ? (
                  <MenuItem disabled>No new notifications</MenuItem>
                ) : (
                  notifications.map((notif, index) => (
                    <MenuItem
                      key={index}
                      onClick={() => handleNotificationClick(notif)}
                    >
                      {notif.message}
                    </MenuItem>
                  ))
                )}
              </Menu>

              {/* Profile */}
              <IconButton onClick={handleMenuOpen} color="inherit">
                <Avatar sx={{ width: 30, height: 30, bgcolor: "white" }}>
                  <AccountCircleIcon color="primary" />
                </Avatar>
              </IconButton>

              {/* Profile Menu */}
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem onClick={() => navigate("/admin/profile")}>
                  Profile
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <LogoutIcon sx={{ mr: 1 }} /> Logout
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Toast Notification */}
        <ToastContainer position="top-center" />

        {/* Offset for Fixed Navbar */}
        <Toolbar />

        {/* Render the selected page */}
        <Outlet />
      </Box>
    </Box>
  );
};

export default AdminLayout;
