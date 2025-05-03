import { useState } from "react";
import {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} from "../features/api/apiSlices";
import { Pencil, Trash2, Plus } from "lucide-react";
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
} from "@mui/material";

export default function CategoryManagement() {
  const { data: categories = [], isLoading, error } = useGetCategoriesQuery();
  const [createCategory] = useCreateCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  const [newCategory, setNewCategory] = useState({ name: "", description: "" });
  const [editingCategory, setEditingCategory] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const [openCreateModal, setOpenCreateModal] = useState(false);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newCategory.name.trim()) {
      setErrorMessage("Category name is required");
      return;
    }
    try {
      await createCategory(newCategory).unwrap();
      setNewCategory({ name: "", description: "" });
      setErrorMessage("");
      setOpenCreateModal(false);
    } catch (err) {
      setErrorMessage(err.data?.message || "Failed to create category");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingCategory.name.trim()) {
      setErrorMessage("Category name is required");
      return;
    }
    try {
      await updateCategory({
        id: editingCategory._id,
        ...editingCategory,
      }).unwrap();
      setEditingCategory(null);
      setErrorMessage("");
    } catch (err) {
      setErrorMessage(err.data?.message || "Failed to update category");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?"))
      return;
    try {
      await deleteCategory(id).unwrap();
      setErrorMessage("");
    } catch (err) {
      setErrorMessage(err.data?.message || "Failed to delete category");
    }
  };

  if (isLoading)
    return <Typography align="center">Loading categories...</Typography>;
  if (error)
    return (
      <Typography align="center" color="error">
        Error loading categories
      </Typography>
    );

  return (
    <Box maxWidth="800px" mx="auto" my={4}>
      <Typography variant="h4" gutterBottom>
        Manage Categories
      </Typography>

      {/* Add New Category Button */}
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Button
          variant="contained"
          startIcon={<Plus />}
          onClick={() => setOpenCreateModal(true)}
        >
          Add New Category
        </Button>
      </Box>

      {/* Modal for Add Category */}
      <Dialog
        open={openCreateModal}
        onClose={() => setOpenCreateModal(false)}
        fullWidth
      >
        <DialogTitle>Add New Category</DialogTitle>
        <DialogContent>
          {errorMessage && (
            <Typography color="error" mb={2}>
              {errorMessage}
            </Typography>
          )}
          <Stack spacing={2} mt={1}>
            <TextField
              label="Name"
              value={newCategory.name}
              onChange={(e) =>
                setNewCategory({ ...newCategory, name: e.target.value })
              }
              required
              fullWidth
            />
            <TextField
              label="Description"
              value={newCategory.description}
              onChange={(e) =>
                setNewCategory({ ...newCategory, description: e.target.value })
              }
              multiline
              rows={2}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreateModal(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreate}>
            Create
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Form */}
      {editingCategory && (
        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Edit Category
          </Typography>
          {errorMessage && (
            <Typography color="error" mb={2}>
              {errorMessage}
            </Typography>
          )}
          <form onSubmit={handleUpdate}>
            <Stack spacing={2}>
              <TextField
                label="Name"
                value={editingCategory.name}
                onChange={(e) =>
                  setEditingCategory({
                    ...editingCategory,
                    name: e.target.value,
                  })
                }
                required
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
                rows={2}
              />
              <Stack direction="row" spacing={2}>
                <Button variant="contained" color="success" type="submit">
                  Save Changes
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => setEditingCategory(null)}
                >
                  Cancel
                </Button>
              </Stack>
            </Stack>
          </form>
        </Paper>
      )}

      {/* Category List */}
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Existing Categories
        </Typography>
        {categories.length === 0 ? (
          <Typography>No categories found.</Typography>
        ) : (
          <Stack divider={<Divider />} spacing={2}>
            {categories.map((category) => (
              <Stack
                key={category._id}
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Box>
                  <Typography variant="subtitle1">{category.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {category.description || "No description"}
                  </Typography>
                </Box>
                <Box>
                  <IconButton
                    color="primary"
                    onClick={() => setEditingCategory(category)}
                  >
                    <Pencil size={20} />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(category._id)}
                  >
                    <Trash2 size={20} />
                  </IconButton>
                </Box>
              </Stack>
            ))}
          </Stack>
        )}
      </Paper>
    </Box>
  );
}
