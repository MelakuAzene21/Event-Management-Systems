import { useState, useMemo } from "react";
import {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} from "../features/api/apiSlices";
import { Pencil, Trash2, Plus, X } from "lucide-react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  IconButton,
  Stack,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  Fade,
  Zoom,
  Tooltip,
  TablePagination,
  InputAdornment,
  Alert,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

export default function CategoryManagement() {
  const { data: categories = [], isLoading, error } = useGetCategoriesQuery();
  const [createCategory] = useCreateCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  // State for form and modals
  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
    icon: null,
  });
  const [editingCategory, setEditingCategory] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(null); // Store category ID for deletion

  // State for search and pagination
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Filter categories based on search term
  const filteredCategories = useMemo(() => {
    const lowerSearch = searchTerm.toLowerCase();
    return categories.filter(
      (category) =>
        category.name.toLowerCase().includes(lowerSearch) ||
        (category.description &&
          category.description.toLowerCase().includes(lowerSearch))
    );
  }, [categories, searchTerm]);

  // Paginate filtered categories
  const paginatedCategories = useMemo(() => {
    const start = page * rowsPerPage;
    return filteredCategories.slice(start, start + rowsPerPage);
  }, [filteredCategories, page, rowsPerPage]);

  // Handlers
  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newCategory.name.trim()) {
      setErrorMessage("Category name is required");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("name", newCategory.name);
      formData.append("description", newCategory.description);
      if (newCategory.icon) {
        formData.append("avatar", newCategory.icon);
      }

      await createCategory(formData).unwrap();
      setNewCategory({ name: "", description: "", icon: null });
      setErrorMessage("");
      setOpenCreateModal(false);
    } catch (err) {
      setErrorMessage(err.data?.message || "Failed to create category");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      // Only append fields that have changed or are provided
      if (editingCategory.name) {
        formData.append("name", editingCategory.name);
      }
      if (editingCategory.description !== undefined) {
        formData.append("description", editingCategory.description);
      }
      if (editingCategory.icon instanceof File) {
        formData.append("avatar", editingCategory.icon);
      }

      await updateCategory({
        id: editingCategory._id,
        data: formData,
      }).unwrap();
      setEditingCategory(null);
      setErrorMessage("");
      setOpenEditModal(false);
    } catch (err) {
      setErrorMessage(err.data?.message || "Failed to update category");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteCategory(openDeleteModal).unwrap();
      setErrorMessage("");
      setOpenDeleteModal(null);
    } catch (err) {
      setErrorMessage(err.data?.message || "Failed to delete category");
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Icon preview URL for create modal
  const createIconPreview = newCategory.icon
    ? URL.createObjectURL(newCategory.icon)
    : null;

  // Icon preview URL for edit modal
  const editIconPreview =
    editingCategory?.icon instanceof File
      ? URL.createObjectURL(editingCategory.icon)
      : editingCategory?.icon?.url;

  // Clean up object URLs to prevent memory leaks
  const handleCloseCreateModal = () => {
    if (createIconPreview) URL.revokeObjectURL(createIconPreview);
    setOpenCreateModal(false);
    setNewCategory({ name: "", description: "", icon: null });
    setErrorMessage("");
  };

  const handleCloseEditModal = () => {
    if (editingCategory?.icon instanceof File) {
      URL.revokeObjectURL(editIconPreview);
    }
    setOpenEditModal(false);
    setEditingCategory(null);
    setErrorMessage("");
  };

  if (isLoading)
    return (
      <Typography align="center" variant="h6" sx={{ mt: 4 }}>
        Loading categories...
      </Typography>
    );
  if (error)
    return (
      <Alert severity="error" sx={{ maxWidth: "800px", mx: "auto", mt: 4 }}>
        Error loading categories
      </Alert>
    );

  return (
    <Box maxWidth="800px" mx="auto" my={4} sx={{ px: 2 }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{ fontWeight: "bold", color: "primary.main" }}
      >
        Manage Categories
      </Typography>

      {/* Search and Add New Category */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        mb={3}
        alignItems={{ xs: "stretch", sm: "center" }}
      >
        <TextField
          label="Search Categories"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(0);
          }}
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          variant="outlined"
          sx={{ maxWidth: { sm: "400px" } }}
        />
        <Button
          variant="contained"
          startIcon={<Plus />}
          onClick={() => setOpenCreateModal(true)}
          sx={{
            bgcolor: "primary.main",
            "&:hover": { bgcolor: "primary.dark" },
            px: 3,
            py: 1.5,
            borderRadius: 2,
          }}
        >
          Add New Category
        </Button>
      </Stack>

      {/* Create Modal */}
      <Dialog
        open={openCreateModal}
        onClose={handleCloseCreateModal}
        fullWidth
        maxWidth="sm"
        TransitionComponent={Fade}
        TransitionProps={{ timeout: 400 }}
      >
        <DialogTitle sx={{ bgcolor: "primary.main", color: "white" }}>
          Add New Category
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          {errorMessage && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {errorMessage}
            </Alert>
          )}
          <Stack spacing={3} mt={1}>
            <TextField
              label="Name"
              value={newCategory.name}
              onChange={(e) =>
                setNewCategory({ ...newCategory, name: e.target.value })
              }
              required
              fullWidth
              variant="outlined"
              autoFocus
            />
            <TextField
              label="Description"
              value={newCategory.description}
              onChange={(e) =>
                setNewCategory({ ...newCategory, description: e.target.value })
              }
              multiline
              rows={3}
              fullWidth
              variant="outlined"
            />
            <Stack direction="row" spacing={2} alignItems="center">
              {createIconPreview && (
                <Box position="relative">
                  <Avatar
                    src={createIconPreview}
                    alt="Icon preview"
                    sx={{ width: 56, height: 56, borderRadius: 1 }}
                  />
                  <IconButton
                    size="small"
                    onClick={() =>
                      setNewCategory({ ...newCategory, icon: null })
                    }
                    sx={{
                      position: "absolute",
                      top: -8,
                      right: -8,
                      bgcolor: "error.main",
                      color: "white",
                      "&:hover": { bgcolor: "error.dark" },
                    }}
                  >
                    <X size={16} />
                  </IconButton>
                </Box>
              )}
              <Button
                variant="outlined"
                component="label"
                sx={{
                  py: 1.5,
                  borderColor: "grey.400",
                  "&:hover": { borderColor: "primary.main" },
                }}
              >
                {createIconPreview ? "Change Icon" : "Upload Icon"}
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) =>
                    setNewCategory({ ...newCategory, icon: e.target.files[0] })
                  }
                />
              </Button>
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={handleCloseCreateModal}
            variant="outlined"
            sx={{ px: 3 }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            variant="contained"
            sx={{
              px: 3,
              bgcolor: "success.main",
              "&:hover": { bgcolor: "success.dark" },
            }}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Modal */}
      <Dialog
        open={openEditModal}
        onClose={handleCloseEditModal}
        fullWidth
        maxWidth="sm"
        TransitionComponent={Fade}
        TransitionProps={{ timeout: 400 }}
      >
        <DialogTitle sx={{ bgcolor: "primary.main", color: "white" }}>
          Edit Category
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          {errorMessage && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {errorMessage}
            </Alert>
          )}
          {editingCategory && (
            <Stack spacing={3} mt={1}>
              <TextField
                label="Name"
                value={editingCategory.name || ""}
                onChange={(e) =>
                  setEditingCategory({
                    ...editingCategory,
                    name: e.target.value,
                  })
                }
                fullWidth
                variant="outlined"
                autoFocus
              />
              <TextField
                label="Description"
                value={editingCategory.description || ""}
                onChange={(e) =>
                  setEditingCategory({
                    ...editingCategory,
                    description: e.target.value,
                  })
                }
                multiline
                rows={3}
                fullWidth
                variant="outlined"
              />
              <Stack direction="row" spacing={2} alignItems="center">
                {editIconPreview && (
                  <Box position="relative">
                    <Avatar
                      src={editIconPreview}
                      alt="Icon preview"
                      sx={{ width: 56, height: 56, borderRadius: 1 }}
                    />
                    <IconButton
                      size="small"
                      onClick={() =>
                        setEditingCategory({ ...editingCategory, icon: null })
                      }
                      sx={{
                        position: "absolute",
                        top: -8,
                        right: -8,
                        bgcolor: "error.main",
                        color: "white",
                        "&:hover": { bgcolor: "error.dark" },
                      }}
                    >
                      <X size={16} />
                    </IconButton>
                  </Box>
                )}
                <Button
                  variant="outlined"
                  component="label"
                  sx={{
                    py: 1.5,
                    borderColor: "grey.400",
                    "&:hover": { borderColor: "primary.main" },
                  }}
                >
                  {editIconPreview ? "Change Icon" : "Upload New Icon"}
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(e) =>
                      setEditingCategory({
                        ...editingCategory,
                        icon: e.target.files[0],
                      })
                    }
                  />
                </Button>
              </Stack>
            </Stack>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={handleCloseEditModal}
            variant="outlined"
            sx={{ px: 3 }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpdate}
            variant="contained"
            sx={{
              px: 3,
              bgcolor: "success.main",
              "&:hover": { bgcolor: "success.dark" },
            }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog
        open={!!openDeleteModal}
        onClose={() => setOpenDeleteModal(null)}
        TransitionComponent={Zoom}
        TransitionProps={{ timeout: 400 }}
      >
        <DialogTitle sx={{ bgcolor: "error.main", color: "white" }}>
          Confirm Deletion
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Typography>
            Are you sure you want to delete this category? This action cannot be
            undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={() => setOpenDeleteModal(null)}
            variant="outlined"
            sx={{ px: 3 }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            variant="contained"
            sx={{
              px: 3,
              bgcolor: "error.main",
              "&:hover": { bgcolor: "error.dark" },
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Category List */}
      <Paper
        elevation={3}
        sx={{
          p: 3,
          borderRadius: 2,
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        }}
      >
        <Typography variant="h6" gutterBottom sx={{ fontWeight: "medium" }}>
          Existing Categories ({filteredCategories.length})
        </Typography>
        {filteredCategories.length === 0 ? (
          <Typography color="text.secondary" sx={{ py: 2 }}>
            No categories found.
          </Typography>
        ) : (
          <>
            <Stack divider={<Divider />} spacing={2}>
              {paginatedCategories.map((category) => (
                <Stack
                  key={category._id}
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{
                    py: 1,
                    px: 2,
                    borderRadius: 1,
                    "&:hover": {
                      bgcolor: "grey.100",
                      transition: "background-color 0.3s",
                    },
                  }}
                >
                  <Box display="flex" alignItems="center" gap={2}>
                    {category.icon?.url ? (
                      <Avatar
                        src={category.icon.url}
                        alt={category.name}
                        sx={{ width: 40, height: 40, borderRadius: 1 }}
                      />
                    ) : (
                      <Avatar
                        sx={{
                          width: 40,
                          height: 40,
                          bgcolor: "primary.light",
                          color: "primary.contrastText",
                        }}
                      >
                        {category.name[0].toUpperCase()}
                      </Avatar>
                    )}
                    <Box>
                      <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: "medium" }}
                      >
                        {category.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {category.description || "No description"}
                      </Typography>
                    </Box>
                  </Box>
                  <Box>
                    <Tooltip title="Edit Category">
                      <IconButton
                        color="primary"
                        onClick={() => {
                          setEditingCategory(category);
                          setOpenEditModal(true);
                        }}
                        sx={{ "&:hover": { bgcolor: "primary.light" } }}
                      >
                        <Pencil size={20} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Category">
                      <IconButton
                        color="error"
                        onClick={() => setOpenDeleteModal(category._id)}
                        sx={{ "&:hover": { bgcolor: "error.light" } }}
                      >
                        <Trash2 size={20} />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Stack>
              ))}
            </Stack>
            <TablePagination
              component="div"
              count={filteredCategories.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 25]}
              sx={{ mt: 2 }}
            />
          </>
        )}
      </Paper>
    </Box>
  );
}
