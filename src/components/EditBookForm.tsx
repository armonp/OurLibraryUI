import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Paper,
  Alert,
  Snackbar,
  Divider,
  InputAdornment,
  IconButton,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import AutorenewIcon from "@mui/icons-material/Autorenew";

// Define Book interface to match with backend
interface Book {
  id: string;
  ISBN: string;
  isbn?: string;
  title: string;
  author?: string;
  coverURL?: string;
  status?: string;
  publishedYear?: number;
  notes?: string;
  publishers?: string[];
  genres?: string[];
  subjects?: string[];
  edition?: string;
  description?: string;
  pageCount?: number;
  language?: string;
}

interface EditBookFormProps {
  book: Book;
  onSave: (updatedBook: Book) => Promise<void>;
  onCancel: () => void;
}

const API_URL = "http://localhost:5089";

const EditBookForm: React.FC<EditBookFormProps> = ({
  book,
  onSave,
  onCancel,
}) => {
  const [formData, setFormData] = useState<Book>({ ...book });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isbnToFetch, setIsbnToFetch] = useState<string>("");
  const [isFetching, setIsFetching] = useState(false);

  // Handle input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle number inputs
  const handleNumberChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value === "" ? undefined : Number(value),
    });
  };

  // Handle array inputs (comma-separated values)
  const handleArrayChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const arrayValues = value
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item !== "");
    setFormData({
      ...formData,
      [name]: arrayValues,
    });
  };

  // Handle fetching book details from ISBN
  const fetchBookDetailsByISBN = async () => {
    if (!isbnToFetch.trim()) {
      setError("Please enter an ISBN to search");
      return;
    }

    setIsFetching(true);
    setError(null);

    try {
      const response = await fetch(
        `${API_URL}/v1/OpenLibrary/books/${isbnToFetch}`
      );

      if (!response.ok) {
        throw new Error(
          `Failed to fetch book details: ${response.status} ${response.statusText}`
        );
      }

      const bookData = await response.json();

      // Update form data with fetched details while keeping the original ID
      setFormData({
        ...bookData,
        id: formData.id,
        status: formData.status, // Preserve the status
      });

      setSuccessMessage("Book details fetched successfully!");
    } catch (err) {
      console.error("Error fetching book details:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch book details"
      );
    } finally {
      setIsFetching(false);
    }
  };

  // Reset form data to the original book data
  const resetToOriginal = () => {
    setFormData({ ...book });
    setSuccessMessage("Form reset to original values");
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      // Call the API to update the book
      const response = await fetch(`${API_URL}/v1/Books/${book.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(
          `Failed to update book: ${response.status} ${response.statusText}`
        );
      }

      setSuccessMessage("Book details updated successfully!");

      // Call the parent's onSave callback
      await onSave(formData);

      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err) {
      console.error("Error updating book:", err);
      setError(err instanceof Error ? err.message : "Failed to update book");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: "10px" }}>
      <Typography variant="h5" gutterBottom>
        Edit Book Details
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* ISBN Search Section */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          Fetch book details by ISBN
        </Typography>

        <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
          <TextField
            fullWidth
            id="isbnSearch"
            label="ISBN"
            variant="outlined"
            size="small"
            value={isbnToFetch}
            onChange={(e) => setIsbnToFetch(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={fetchBookDetailsByISBN}
                    disabled={isFetching || !isbnToFetch.trim()}
                    edge="end"
                  >
                    {isFetching ? (
                      <CircularProgress size={20} />
                    ) : (
                      <SearchIcon />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            variant="outlined"
            color="secondary"
            onClick={resetToOriginal}
            startIcon={<AutorenewIcon />}
            disabled={isSaving || isFetching}
          >
            Reset
          </Button>
        </Box>

        <Divider sx={{ my: 2 }} />
      </Box>

      <Box component="form" onSubmit={handleSubmit} noValidate>
        <TextField
          margin="normal"
          required
          fullWidth
          id="title"
          label="Title"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          sx={{ mb: 2 }}
        />

        <TextField
          margin="normal"
          fullWidth
          id="author"
          label="Author"
          name="author"
          value={formData.author || ""}
          onChange={handleInputChange}
          sx={{ mb: 2 }}
        />

        <TextField
          margin="normal"
          fullWidth
          id="ISBN"
          label="ISBN"
          name="ISBN"
          value={formData.ISBN || ""}
          onChange={handleInputChange}
          sx={{ mb: 2 }}
        />

        <Box sx={{ display: "flex", gap: 2 }}>
          <TextField
            margin="normal"
            fullWidth
            id="publishedYear"
            label="Year Published"
            name="publishedYear"
            type="number"
            value={formData.publishedYear || ""}
            onChange={handleNumberChange}
            sx={{ mb: 2 }}
          />

          <TextField
            margin="normal"
            fullWidth
            id="pageCount"
            label="Page Count"
            name="pageCount"
            type="number"
            value={formData.pageCount || ""}
            onChange={handleNumberChange}
            sx={{ mb: 2 }}
          />
        </Box>

        <TextField
          margin="normal"
          fullWidth
          id="language"
          label="Language"
          name="language"
          value={formData.language || ""}
          onChange={handleInputChange}
          sx={{ mb: 2 }}
        />

        <TextField
          margin="normal"
          fullWidth
          id="publishers"
          label="Publishers (comma-separated)"
          name="publishers"
          value={formData.publishers?.join(", ") || ""}
          onChange={handleArrayChange}
          sx={{ mb: 2 }}
        />

        <TextField
          margin="normal"
          fullWidth
          id="genres"
          label="Genres (comma-separated)"
          name="genres"
          value={formData.genres?.join(", ") || ""}
          onChange={handleArrayChange}
          sx={{ mb: 2 }}
        />

        <TextField
          margin="normal"
          fullWidth
          multiline
          rows={4}
          id="description"
          label="Book Description"
          name="description"
          value={formData.description || ""}
          onChange={handleInputChange}
          sx={{ mb: 2 }}
        />

        <TextField
          margin="normal"
          fullWidth
          multiline
          rows={3}
          id="notes"
          label="Your Notes"
          name="notes"
          value={formData.notes || ""}
          onChange={handleInputChange}
          sx={{ mb: 3 }}
        />

        <Box
          sx={{ display: "flex", justifyContent: "flex-end", mt: 2, gap: 2 }}
        >
          <Button
            variant="outlined"
            onClick={onCancel}
            startIcon={<CloseIcon />}
            disabled={isSaving}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isSaving}
            startIcon={isSaving ? <CircularProgress size={20} /> : <SaveIcon />}
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </Box>
      </Box>

      <Snackbar
        open={!!successMessage}
        autoHideDuration={3000}
        onClose={() => setSuccessMessage(null)}
        message={successMessage}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      />
    </Paper>
  );
};

export default EditBookForm;
