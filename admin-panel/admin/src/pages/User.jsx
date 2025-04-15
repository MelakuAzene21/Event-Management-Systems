// import React, { useState } from "react";
// import {
//   useGetUsersQuery,
//   useDeleteUserMutation,
//   useUpdateUserMutation,
// } from "../features/api/apiSlices";
// import { toast } from "react-toastify";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Avatar,
//   Button,
//   CircularProgress,
//   Alert,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogContentText,
//   DialogTitle,
//   Select,
//   MenuItem,
// } from "@mui/material";
// import DeleteIcon from "@mui/icons-material/Delete";

// const Users = () => {
//   const { data, error, isLoading } = useGetUsersQuery();
//   const [deleteUser] = useDeleteUserMutation();
//   const [updateUser] = useUpdateUserMutation();
//   const users = Array.isArray(data) ? data : data?.users || [];

//   const [open, setOpen] = useState(false);
//   const [selectedUser, setSelectedUser] = useState(null);

//   const handleOpenDialog = (user) => {
//     setSelectedUser(user);
//     setOpen(true);
//   };

//   const handleCloseDialog = () => {
//     setOpen(false);
//     setSelectedUser(null);
//   };

//   const handleDelete = async () => {
//     if (selectedUser) {
//         await deleteUser(selectedUser._id);
//         toast.success("user Deleted successuflly")
//     }
//     handleCloseDialog();
//   };

//   const handleUpdateRole = async (userId, newRole) => {
//       await updateUser({ userId, role: newRole });
//               toast.success("user Role Updated successuflly");

//   };

//   const handleToggleStatus = async (userId, currentStatus) => {
//     const newStatus = currentStatus === "active" ? "blocked" : "active";
//       await updateUser({ userId, status: newStatus });
//               toast.success("user Status Updated successuflly");

//   };

//   if (isLoading) {
//     return <CircularProgress />;
//   }

//   if (error) {
//     return (
//       <Alert severity="error">
//         Failed to load users. Please try again later.
//       </Alert>
//     );
//   }

//   return (
//     <Paper elevation={3} sx={{ padding: 3, borderRadius: 3 }}>
//       <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
//         User Management
//       </h2>
//       <TableContainer component={Paper}>
//         <Table>
//           <TableHead sx={{ backgroundColor: "#f4f4f4" }}>
//             <TableRow>
//               <TableCell>
//                 <strong>ID</strong>
//               </TableCell>
//               <TableCell>
//                 <strong>Avatar</strong>
//               </TableCell>
//               <TableCell>
//                 <strong>Name</strong>
//               </TableCell>
//               <TableCell>
//                 <strong>Email</strong>
//               </TableCell>
//               <TableCell>
//                 <strong>Joined At</strong>
//               </TableCell>
//               <TableCell>
//                 <strong>Role</strong>
//               </TableCell>
//               <TableCell>
//                 <strong>Status</strong>
//               </TableCell>
//               <TableCell>
//                 <strong>Action</strong>
//               </TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {users.map((user) => (
//               <TableRow key={user._id}>
//                 <TableCell>{user._id}</TableCell>
//                 <TableCell>
//                   <Avatar alt={user.name} src={user.avatar} />
//                 </TableCell>
//                 <TableCell>{user.name}</TableCell>
//                 <TableCell>{user.email}</TableCell>

//                 <TableCell>
//                   {new Date(user.createdAt).toLocaleDateString("en-US", {
//                     year: "numeric",
//                     month: "short",
//                     day: "numeric",
//                   })}
//                 </TableCell>

//                 <TableCell>
//                   <Select
//                     value={user.role}
//                     onChange={(e) => handleUpdateRole(user._id, e.target.value)}
//                   >
//                     <MenuItem value="admin">Admin</MenuItem>
//                     <MenuItem value="organizer">Organizer</MenuItem>
//                     <MenuItem value="user">User</MenuItem>
//                   </Select>
//                 </TableCell>
//                 <TableCell>
//                   <Button
//                     variant="contained"
//                     onClick={() => handleToggleStatus(user._id, user.status)}
//                     sx={{
//                       backgroundColor:
//                         user.status === "active" ? "green" : "red",
//                       color: "white",
//                     }}
//                   >
//                     {user.status}
//                   </Button>
//                 </TableCell>
//                 <TableCell>
//                   <Button
//                     variant="contained"
//                     color="error"
//                     startIcon={<DeleteIcon />}
//                     onClick={() => handleOpenDialog(user)}
//                   >
//                     Delete
//                   </Button>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>

//       {/* Delete Confirmation Dialog */}
//       <Dialog open={open} onClose={handleCloseDialog}>
//         <DialogTitle>Confirm Delete</DialogTitle>
//         <DialogContent>
//           <DialogContentText>
//             Are you sure you want to delete{" "}
//             <strong>{selectedUser?.name}</strong>?
//           </DialogContentText>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleCloseDialog} color="primary">
//             Cancel
//           </Button>
//           <Button onClick={handleDelete} color="error" variant="contained">
//             Delete
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Paper>
//   );
// };

// export default Users;
  


import React, { useState, useEffect } from "react";
import {
  useGetUsersQuery,
  useDeleteUserMutation,
  useUpdateUserMutation,
} from "../features/api/apiSlices";
import { toast } from "react-toastify";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Button,
  CircularProgress,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Select,
  MenuItem,
  Tabs,
  Tab,
  TextField,
  Box,
  Pagination,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";

const Users = () => {
  const { data, error, isLoading } = useGetUsersQuery();
  const [deleteUser] = useDeleteUserMutation();
  const [updateUser] = useUpdateUserMutation();
  const users = Array.isArray(data) ? data : data?.users || [];

  // State for tabs, search, pagination, and dialog
  const [tabValue, setTabValue] = useState("all"); // Tabs: all, attendee, organizer, vendor
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [page, setPage] = useState(1);
  const usersPerPage = 10;
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Filter and search logic
  useEffect(() => {
    let result = [...users];

    // Filter by role (tab)
    if (tabValue !== "all") {
      result = result.filter((user) => user.role === tabValue);
    }

    // Filter by search term
    if (searchTerm) {
      result = result.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredUsers(result);
    setPage(1); // Reset to first page on filter/search change
  }, [tabValue, searchTerm, users]);

  // Pagination logic
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const paginatedUsers = filteredUsers.slice(
    (page - 1) * usersPerPage,
    page * usersPerPage
  );

  // Handlers
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleOpenDialog = (user) => {
    setSelectedUser(user);
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setSelectedUser(null);
  };

  const handleDelete = async () => {
    if (selectedUser) {
      await deleteUser(selectedUser._id);
      toast.success("User deleted successfully");
    }
    handleCloseDialog();
  };

  const handleUpdateRole = async (userId, newRole) => {
    await updateUser({ userId, role: newRole });
    toast.success("User role updated successfully");
  };

  const handleToggleStatus = async (userId, currentStatus) => {
    const newStatus = currentStatus === "active" ? "blocked" : "active";
    await updateUser({ userId, status: newStatus });
    toast.success("User status updated successfully");
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" py={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        Failed to load users. Please try again later.
      </Alert>
    );
  }

  return (
    <Paper
      elevation={3}
      sx={{
        p: 4,
        borderRadius: 3,
        maxWidth: "1200px",
        mx: "auto",
        mt: 4,
      }}
    >
      <Typography
        variant="h5"
        sx={{ textAlign: "center", mb: 4, fontWeight: "bold" }}
      >
        User Management
      </Typography>

      {/* Search and Tabs */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "stretch", md: "center" },
          mb: 4,
          gap: 2,
        }}
      >
        {/* Search Bar */}
        <TextField
          variant="outlined"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <SearchIcon sx={{ mr: 1, color: "text.secondary" }} />
            ),
          }}
          sx={{ width: { xs: "100%", md: "300px" } }}
        />

        {/* Tabs */}
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: "divider" }}
        >
          <Tab label="All" value="all" />
          <Tab label="Attendee" value="user" />
          <Tab label="Organizer" value="organizer" />
          <Tab label="Vendor" value="vendor" />
        </Tabs>
      </Box>

      {/* Table */}
      <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 1 }}>
        <Table>
          <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>ID</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Avatar</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Joined At</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Role</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedUsers.map((user) => (
              <TableRow
                key={user._id}
                sx={{ "&:hover": { backgroundColor: "#f9f9f9" } }}
              >
                <TableCell>{user._id.slice(0, 8)}...</TableCell>
                <TableCell>
                  <Avatar alt={user.name} src={user.avatar} />
                </TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  {new Date(user.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </TableCell>
                <TableCell>
                  <Select
                    value={user.role}
                    onChange={(e) => handleUpdateRole(user._id, e.target.value)}
                    size="small"
                    sx={{ minWidth: 120 }}
                  >
                    <MenuItem value="admin">Admin</MenuItem>
                    <MenuItem value="organizer">Organizer</MenuItem>
                    <MenuItem value="user">Attendee</MenuItem>
                    <MenuItem value="vendor">Vendor</MenuItem>
                  </Select>
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    onClick={() => handleToggleStatus(user._id, user.status)}
                    size="small"
                    sx={{
                      backgroundColor:
                        user.status === "active"
                          ? "success.main"
                          : "error.main",
                      color: "white",
                      textTransform: "capitalize",
                      "&:hover": {
                        backgroundColor:
                          user.status === "active"
                            ? "success.dark"
                            : "error.dark",
                      },
                    }}
                  >
                    {user.status}
                  </Button>
                </TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => handleOpenDialog(user)}
                    size="small"
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Empty State */}
      {filteredUsers.length === 0 && (
        <Typography
          sx={{ textAlign: "center", py: 4, color: "text.secondary" }}
        >
          No users found. Try adjusting your search or tab selection.
        </Typography>
      )}

      {/* Pagination */}
      {filteredUsers.length > usersPerPage && (
        <Box display="flex" justifyContent="center" mt={4}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            showFirstButton
            showLastButton
            size="medium"
          />
        </Box>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={open} onClose={handleCloseDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete{" "}
            <strong>{selectedUser?.name}</strong>?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default Users;