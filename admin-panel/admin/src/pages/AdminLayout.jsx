// import React from "react";
// import { Outlet, useNavigate } from "react-router-dom";
// import {
//   Drawer,
//   List,
//   ListItem,
//   ListItemIcon,
//   ListItemText,
//   Toolbar,
//   Box,
//   CssBaseline,
//   AppBar,
//   Typography,
//   IconButton,
//   Menu,
//   MenuItem,
//   Avatar,
//   Badge,
//   Divider,
// } from "@mui/material";
// import DashboardIcon from "@mui/icons-material/Dashboard";
// import PeopleIcon from "@mui/icons-material/People";
// import EventIcon from "@mui/icons-material/Event";
// import BarChartIcon from "@mui/icons-material/BarChart";
// import ChatIcon from "@mui/icons-material/Chat";
// import BusinessIcon from "@mui/icons-material/Business";
// import SettingsIcon from "@mui/icons-material/Settings";
// import NotificationsIcon from "@mui/icons-material/Notifications";
// import LogoutIcon from "@mui/icons-material/Logout";
// import AccountCircleIcon from "@mui/icons-material/AccountCircle";
// import { ToastContainer } from "react-toastify";

// const drawerWidth = 220;

// const menuItems = [
//   { text: "Dashboard", icon: <DashboardIcon />, path: "/admin/dashboard" },
//   { text: "Users", icon: <PeopleIcon />, path: "/admin/users" },
//   { text: "Events", icon: <EventIcon />, path: "/admin/events" },
//   { text: "Reports", icon: <BarChartIcon />, path: "/admin/report" },
//   { text: "Chats", icon: <ChatIcon />, path: "/admin/chats", badge: 5 }, // Example badge count
//   { text: "Vendors", icon: <BusinessIcon />, path: "/admin/vendors" },
//   { text: "Settings", icon: <SettingsIcon />, path: "/admin/settings" },
// ];

// const AdminLayout = () => {
//   const navigate = useNavigate();
//   const [anchorEl, setAnchorEl] = React.useState(null);

//   // Handle Profile Menu (Click Avatar)
//   const handleMenuOpen = (event) => {
//     setAnchorEl(event.currentTarget);
//   };
//   const handleMenuClose = () => {
//     setAnchorEl(null);
//   };

//   // Handle Logout
//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     navigate("/");
//   };

//   return (
//     <Box sx={{ display: "flex", height: "100vh" }}>
//       <CssBaseline />

//       {/* Sidebar Drawer */}
//       <Drawer
//         variant="permanent"
//         sx={{
//           width: drawerWidth,
//           flexShrink: 0,
//           [`& .MuiDrawer-paper`]: {
//             width: drawerWidth,
//             boxSizing: "border-box",
//             backgroundColor: "#0d47a1",
//             color: "white",
//           },
//         }}
//       >
//         <Toolbar />
//         <List>
//           {menuItems.map((item) => (
//             <ListItem
//               button
//               key={item.text}
//               onClick={() => navigate(item.path)}
//               sx={{ color: "white" }}
//             >
//               <ListItemIcon sx={{ color: "white" }}>
//                 {item.badge ? (
//                   <Badge badgeContent={item.badge} color="error">
//                     {item.icon}
//                   </Badge>
//                 ) : (
//                   item.icon
//                 )}
//               </ListItemIcon>
//               <ListItemText primary={item.text} />
//             </ListItem>
//           ))}
//         </List>
//         <Divider sx={{ backgroundColor: "rgba(255,255,255,0.2)", my: 2 }} />
//       </Drawer>

//       {/* Main Content */}
//       <Box
//         component="main"
//         sx={{
//           flexGrow: 1,
//           width: `calc(100% - ${drawerWidth}px)`,
//           overflow: "auto",
//           minHeight: "100vh",
//           backgroundColor: "#f5f5f5",
//         }}
//       >
//         {/* Top Navbar */}
//         <AppBar
//           position="fixed"
//           sx={{
//             width: `calc(100% - ${drawerWidth}px)`,
//             ml: `${drawerWidth}px`,
//             backgroundColor: "#0d47a1",
//           }}
//         >
//           <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
//             <Typography variant="h6" noWrap>
//               Admin Panel
//             </Typography>

//             {/* Notifications and Profile */}
//             <Box sx={{ display: "flex", alignItems: "center" }}>
//               {/* Notifications */}
//               <IconButton color="inherit">
//                 <Badge badgeContent={3} color="error">
//                   <NotificationsIcon />
//                 </Badge>
//               </IconButton>

//               {/* Profile */}
//               <IconButton onClick={handleMenuOpen} color="inherit">
//                 <Avatar sx={{ width: 30, height: 30, bgcolor: "white" }}>
//                   <AccountCircleIcon color="primary" />
//                 </Avatar>
//               </IconButton>

//               {/* Profile Menu */}
//               <Menu
//                 anchorEl={anchorEl}
//                 open={Boolean(anchorEl)}
//                 onClose={handleMenuClose}
//               >
//                 <MenuItem onClick={() => navigate("/admin/profile")}>
//                   Profile
//                 </MenuItem>
//                 <MenuItem onClick={handleLogout}>
//                   <LogoutIcon sx={{ mr: 1 }} /> Logout
//                 </MenuItem>
//               </Menu>
//             </Box>
//           </Toolbar>
//         </AppBar>

//         {/* Toast Notification */}
//         <ToastContainer position="top-center" />

//         {/* Offset for Fixed Navbar */}
//         <Toolbar />

//         {/* Render the selected page */}
//         <Outlet />
//       </Box>
//     </Box>
//   );
// };

// export default AdminLayout;

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

const socket = io("http://localhost:5000", {
  transports: ["websocket", "polling"],
});
const drawerWidth = 220;

const menuItems = [
  { text: "Dashboard", icon: <DashboardIcon />, path: "/admin/dashboard" },
  { text: "Users", icon: <PeopleIcon />, path: "/admin/users" },
  { text: "Events", icon: <EventIcon />, path: "/admin/events" },
  { text: "Reports", icon: <BarChartIcon />, path: "/admin/report" },
  { text: "Chats", icon: <ChatIcon />, path: "/admin/chats" },
  { text: "Vendors", icon: <BusinessIcon />, path: "/admin/vendors" },
  { text: "Settings", icon: <SettingsIcon />, path: "/admin/settings" },
];

const AdminLayout = () => {

  const handleNotificationClick = (notif) => {
    if (notif.eventId) {
      navigate(`/admin/events/${notif.eventId}`);
    }
    handleNotifClose();
  };
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifAnchor, setNotifAnchor] = useState(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to WebSocket:", socket.id);
    });

    socket.on("event-approval-request", (data) => {
      console.log("Received event approval request:", data); // ✅ Add this

      setNotifications((prev) => [...prev, data]);
    });

    return () => {
      socket.off("event-approval-request");
    };
  }, []);

  useEffect(() => {
    const userId = user._id; // Replace with actual admin ID from Redux/Auth state
    if (userId) {
      socket.emit("join", userId);
    }
  }, []);

  // Handle Profile Menu
  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  // Handle Notification Menu
  const handleNotifOpen = (event) => setNotifAnchor(event.currentTarget);
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
              button
              key={item.text}
              onClick={() => navigate(item.path)}
              sx={{ color: "white" }}
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
                <Badge badgeContent={notifications.length} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>

              {/* Notification Menu
              <Menu
                anchorEl={notifAnchor}
                open={Boolean(notifAnchor)}
                onClose={handleNotifClose}
              >
                {notifications.length === 0 ? (
                  <MenuItem disabled>No new notifications</MenuItem>
                ) : (
                  notifications.map((notif, index) => (
                    <MenuItem key={index}>{notif.message}</MenuItem>
                  ))
                )}
              </Menu> */}

              {/* // Modify the Notification Menu */}
<Menu anchorEl={notifAnchor} open={Boolean(notifAnchor)} onClose={handleNotifClose}>
  {notifications.length === 0 ? (
    <MenuItem disabled>No new notifications</MenuItem>
  ) : (
    notifications.map((notif, index) => (
      <MenuItem key={index} onClick={() => handleNotificationClick(notif)}>
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
