import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  Paper,
  Button,
  CircularProgress,
  Alert,
  Grid,
  ButtonGroup,
  Chip,
  Snackbar,
  TextField,
  Divider,
  IconButton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckIcon from "@mui/icons-material/Check";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import CategoryIcon from "@mui/icons-material/Category";
import DescriptionIcon from "@mui/icons-material/Description";
import BusinessIcon from "@mui/icons-material/Business";
import LocalLibraryIcon from "@mui/icons-material/LocalLibrary";
import EditIcon from "@mui/icons-material/Edit";
import EditBookForm from "./EditBookForm";

// Define the Book interface to match with backend
interface Book {
  id: string;
  ISBN: string; // Changed from lowercase isbn to uppercase ISBN to match backend model
  isbn?: string; // Keep lowercase for backward compatibility
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

const API_URL = "http://localhost:5089";

const BookDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [book, setBook] = useState<Book | null>(location.state?.book || null);
  const [loading, setLoading] = useState(!location.state?.book);
  const [error, setError] = useState<string | null>(null);
  const [loadingCover, setLoadingCover] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [showStatusControls, setShowStatusControls] = useState(false);
  const [notes, setNotes] = useState<string>("");
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [savingNotes, setSavingNotes] = useState(false);
  const [addingToCollection, setAddingToCollection] = useState(false);
  const [addSuccess, setAddSuccess] = useState<string | null>(null);
  const [addError, setAddError] = useState<string | null>(null);

  // Edit mode state
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    // If book is already set from location state, use that
    if (location.state?.book) {
      setBook(location.state.book);
      setNotes(location.state.book.notes || "");
      return;
    }

    // Otherwise, fetch the book data from API
    const fetchBook = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/v1/Books/${id}`);

        if (!response.ok) {
          throw new Error(
            `Failed to fetch book: ${response.status} ${response.statusText}`
          );
        }

        const data = await response.json();
        setBook(data);
        setNotes(data.notes || "");
        setError(null);
      } catch (err) {
        console.error("Error fetching book:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch book");
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if we have an id and no book from location state
    if (id && !location.state?.book) {
      fetchBook();
    } else if (!id && !location.state?.book) {
      // No id and no book from state - show error
      setError("No book information available");
      setLoading(false);
    }
  }, [id, location.state]);

  const fetchBookCover = async () => {
    if (!book || !(book.ISBN || book.isbn)) {
      return;
    }

    try {
      setLoadingCover(true);
      const response = await fetch(`${API_URL}/v1/Books/${book.id}/cover`, {
        method: "PUT",
      });

      if (!response.ok) {
        throw new Error(
          `Failed to fetch cover: ${response.status} ${response.statusText}`
        );
      }

      const result = await response.json();
      setBook((prevBook) => {
        if (prevBook) {
          return { ...prevBook, coverURL: result.coverUrl };
        }
        return prevBook;
      });
    } catch (err) {
      console.error("Error fetching book cover:", err);
    } finally {
      setLoadingCover(false);
    }
  };

  const handleBack = () => {
    navigate("/bookshelf");
  };

  const addToCollection = async (destination: string) => {
    if (!book) return;

    try {
      setAddingToCollection(true);
      setAddError(null);

      // Prepare the book data with appropriate status
      const bookToAdd = {
        ...book,
        status: destination === "wishlist" ? "Wishlist" : "In Collection",
      };

      // If the book has an ID already, update it, otherwise create new
      const method = book.id ? "PUT" : "POST";
      const endpoint = book.id
        ? `${API_URL}/v1/Books/${book.id}`
        : `${API_URL}/v1/Books`;

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookToAdd),
      });

      if (!response.ok) {
        throw new Error(
          `Failed to add book: ${response.status} ${response.statusText}`
        );
      }

      const addedBook = await response.json();

      // Update the book state with the saved book data
      setBook(addedBook);
      setAddSuccess(
        `Added to ${
          destination === "wishlist" ? "Wishlist" : "Bookshelf"
        } successfully!`
      );

      // Clear success message after 3 seconds
      setTimeout(() => {
        setAddSuccess(null);
      }, 3000);
    } catch (err) {
      console.error("Error adding book:", err);
      setAddError(
        err instanceof Error ? err.message : "Failed to add book to collection"
      );

      // Clear error message after 3 seconds
      setTimeout(() => {
        setAddError(null);
      }, 3000);
    } finally {
      setAddingToCollection(false);
    }
  };

  const updateStatus = async (newStatus: string) => {
    if (!book) return;

    try {
      setUpdatingStatus(true);

      const updatedBook = { ...book, status: newStatus };

      const response = await fetch(`${API_URL}/v1/Books/${book.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedBook),
      });

      if (!response.ok) {
        throw new Error(
          `Failed to update status: ${response.status} ${response.statusText}`
        );
      }

      setBook(updatedBook);
      setStatusMessage(`Book status updated to ${newStatus}`);

      // Hide the status controls after successful update
      setShowStatusControls(false);

      // If removing from collection, navigate back to bookshelf after a delay
      if (newStatus === "Not In Collection") {
        setTimeout(() => {
          navigate("/bookshelf");
        }, 2000);
      }
    } catch (err) {
      console.error("Error updating book status:", err);
      setError(err instanceof Error ? err.message : "Failed to update status");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const saveNotes = async () => {
    if (!book) return;

    try {
      setSavingNotes(true);
      const updatedBook = { ...book, notes };

      const response = await fetch(`${API_URL}/v1/Books/${book.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedBook),
      });

      if (!response.ok) {
        throw new Error(
          `Failed to save notes: ${response.status} ${response.statusText}`
        );
      }

      setBook(updatedBook);
      setIsEditingNotes(false);
      setStatusMessage("Notes saved successfully!");
    } catch (err) {
      console.error("Error saving notes:", err);
      setError(err instanceof Error ? err.message : "Failed to save notes");
    } finally {
      setSavingNotes(false);
    }
  };

  // Toggle edit mode
  const handleEnterEditMode = () => {
    if (!book) return;
    setIsEditMode(true);
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setIsEditMode(false);
  };

  // Handle save from EditBookForm
  const handleSaveEdit = async (updatedBook: Book) => {
    if (!book) return;

    try {
      // The EditBookForm already saves the data to the API
      // Just update the local state and exit edit mode
      setBook(updatedBook);
      setIsEditMode(false);
      setStatusMessage("Book details updated successfully!");
    } catch (err) {
      console.error("Error updating book:", err);
      setError(err instanceof Error ? err.message : "Failed to update book");
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md">
        <Box sx={{ display: "flex", justifyContent: "center", my: 8 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error || !book) {
    return (
      <Container maxWidth="md">
        <Box sx={{ my: 4 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={handleBack}
            variant="outlined"
            sx={{ mb: 2 }}
          >
            Back to Bookshelf
          </Button>
          <Alert severity="error" sx={{ mt: 2 }}>
            {error || "Book not found"}
          </Alert>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      {/* Success/Error messages */}
      <Snackbar
        open={!!statusMessage}
        autoHideDuration={6000}
        onClose={() => setStatusMessage(null)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setStatusMessage(null)}
          severity="success"
          sx={{ width: "100%", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
        >
          {statusMessage}
        </Alert>
      </Snackbar>

      <Box sx={{ my: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Button
            startIcon={<span style={{ fontSize: "1.2rem" }}>🏠</span>}
            onClick={handleBack}
            variant="contained"
            color="secondary"
            sx={{
              borderRadius: "20px",
              boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
              transition: "all 0.3s ease",
              fontWeight: "bold",
              px: 3,
              py: 1,
              "&:hover": {
                transform: "translateY(-3px) scale(1.02)",
                boxShadow: "0 6px 12px rgba(0,0,0,0.2)",
              },
            }}
          >
            Back to Magic Bookshelf
          </Button>

          {/* Edit Button - Only show if book is in collection and not in edit mode */}
          {book.id && book.status !== "Not In Collection" && !isEditMode && (
            <Button
              onClick={handleEnterEditMode}
              variant="outlined"
              color="secondary"
              startIcon={<EditIcon />}
              sx={{
                borderRadius: "20px",
                fontWeight: "bold",
                transition: "all 0.3s",
                boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                px: 3,
                py: 1,
                "&:hover": {
                  transform: "scale(1.02)",
                  boxShadow: "0 3px 8px rgba(0,0,0,0.15)",
                },
              }}
            >
              Edit Book Details
            </Button>
          )}
        </Box>
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: "16px",
            background: "linear-gradient(145deg, #ffffff, #f9f7f2)",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.15)",
            border: "1px solid rgba(0, 0, 0, 0.05)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: 4,
            }}
          >
            {/* Left column - Book cover */}
            <Box
              sx={{
                flex: { xs: "1", md: "0 0 30%" },
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <img
                src={
                  book.coverURL ||
                  `https://via.placeholder.com/300x450?text=${encodeURIComponent(
                    book.title
                  )}`
                }
                alt={book.title}
                className="float-animation"
                style={{
                  maxWidth: "100%",
                  height: "auto",
                  maxHeight: "400px",
                  objectFit: "contain",
                  boxShadow: "0 15px 35px rgba(0,0,0,0.2)",
                  borderRadius: "8px",
                  transition: "all 0.3s ease",
                }}
              />
              {!book.coverURL && (book.ISBN || book.isbn) && (
                <Button
                  variant="outlined"
                  size="small"
                  onClick={fetchBookCover}
                  disabled={loadingCover}
                  startIcon={
                    loadingCover ? <CircularProgress size={16} /> : undefined
                  }
                >
                  {loadingCover ? "Finding Cover..." : "Find Cover Image"}
                </Button>
              )}
            </Box>

            {/* Right column - Book details */}
            <Box sx={{ flex: "1" }}>
              <Box sx={{ position: "relative" }}>
                {isEditMode ? (
                  <EditBookForm
                    book={book}
                    onSave={handleSaveEdit}
                    onCancel={handleCancelEdit}
                  />
                ) : (
                  <Typography
                    variant="h4"
                    component="h1"
                    gutterBottom
                    sx={{
                      fontWeight: 700,
                      background:
                        "linear-gradient(45deg, #ff9b54, #ff7754, #e65c9c, #8d67af)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      textShadow: "0 2px 4px rgba(0,0,0,0.1)",
                      letterSpacing: "-0.5px",
                      display: "inline-block",
                      position: "relative",
                      "&::after": {
                        content: '""',
                        position: "absolute",
                        bottom: "0px",
                        left: 0,
                        width: "100%",
                        height: "4px",
                        background:
                          "linear-gradient(90deg, #FF9AA2, #FFB7B2, #FFDAC1, #E2F0CB, #B5EAD7)",
                        borderRadius: "2px",
                      },
                    }}
                  >
                    {book.title}{" "}
                    <span
                      className="wiggle"
                      style={{ fontSize: "1rem", display: "inline-block" }}
                    >
                      📖
                    </span>
                  </Typography>
                )}

                {addSuccess && (
                  <Alert
                    severity="success"
                    sx={{
                      mb: 2,
                      borderRadius: "12px",
                      animation: "fadeIn 0.5s",
                    }}
                  >
                    {addSuccess}
                  </Alert>
                )}
                {addError && (
                  <Alert
                    severity="error"
                    sx={{
                      mb: 2,
                      borderRadius: "12px",
                      animation: "fadeIn 0.5s",
                    }}
                  >
                    {addError}
                  </Alert>
                )}

                {(!book.id ||
                  !book.status ||
                  book.status === "Not In Collection") && (
                  <Box sx={{ display: "flex", gap: 2, mb: 3, mt: 1 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => addToCollection("bookshelf")}
                      disabled={addingToCollection}
                      startIcon={<MenuBookIcon />}
                      sx={{
                        borderRadius: "20px",
                        boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
                        transition: "all 0.3s ease",
                        fontWeight: "bold",
                        "&:hover": {
                          transform: "translateY(-3px)",
                          boxShadow: "0 6px 12px rgba(0,0,0,0.2)",
                        },
                      }}
                    >
                      Add to Bookshelf
                    </Button>
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() => addToCollection("wishlist")}
                      disabled={addingToCollection}
                      startIcon={<BookmarkIcon />}
                      sx={{
                        borderRadius: "20px",
                        transition: "all 0.3s ease",
                        fontWeight: "bold",
                        "&:hover": {
                          transform: "translateY(-3px)",
                        },
                      }}
                    >
                      Add to Wishlist
                    </Button>
                  </Box>
                )}

                <Box
                  sx={{
                    position: "absolute",
                    top: "-12px",
                    right: "-8px",
                    transform: "rotate(15deg)",
                    animation: "grow 3s infinite ease-in-out",
                    display: { xs: "none", sm: "block" },
                  }}
                >
                  <span style={{ fontSize: "1.8rem" }}>✨</span>
                </Box>
              </Box>

              {/* Show book details only when not in edit mode */}
              {!isEditMode && (
                <Box>
                  <Typography
                    variant="h6"
                    color="text.secondary"
                    gutterBottom
                    sx={{
                      fontWeight: 600,
                      color: "#007bff",
                      textShadow: "0 1px 1px rgba(0,0,0,0.05)",
                    }}
                  >
                    {book.author || "Unknown Author"}
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        </Paper>
      </Box>

      <Snackbar
        open={statusMessage !== null}
        autoHideDuration={5000}
        onClose={() => setStatusMessage(null)}
        message={statusMessage}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </Container>
  );
};

export default BookDetail;
