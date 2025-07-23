import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckIcon from "@mui/icons-material/Check";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";

// Define the Book interface to match with backend
interface Book {
  id: string;
  isbn: string;
  title: string;
  author?: string;
  coverURL?: string;
  status?: string;
}

const API_URL = "http://localhost:5089";

const BookDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingCover, setLoadingCover] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [showStatusControls, setShowStatusControls] = useState(false);

  useEffect(() => {
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
        setError(null);
      } catch (err) {
        console.error("Error fetching book:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch book");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBook();
    }
  }, [id]);

  const fetchBookCover = async () => {
    if (!book || !book.isbn) {
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
      <Box sx={{ my: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          variant="outlined"
          sx={{ mb: 2 }}
        >
          Back to Bookshelf
        </Button>
        <Paper elevation={3} sx={{ p: 4 }}>
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
                style={{
                  maxWidth: "100%",
                  height: "auto",
                  maxHeight: "400px",
                  objectFit: "contain",
                }}
              />
              {!book.coverURL && book.isbn && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={fetchBookCover}
                  disabled={loadingCover}
                  sx={{ mt: 2 }}
                >
                  {loadingCover ? "Finding Cover..." : "Find Cover Image"}
                </Button>
              )}
            </Box>

            {/* Right column - Book details */}
            <Box sx={{ flex: "1" }}>
              <Typography variant="h4" component="h1" gutterBottom>
                {book.title}
              </Typography>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                {book.author || "Unknown Author"}
              </Typography>
              <Box sx={{ mt: 3 }}>
                <Typography variant="body1" gutterBottom>
                  <strong>ISBN:</strong> {book.isbn}
                </Typography>
                {book.status && (
                  <Box sx={{ mt: 2 }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Typography variant="body1" fontWeight="medium">
                          <strong>Status:</strong>
                        </Typography>
                        <Chip
                          label={book.status}
                          color={
                            book.status === "Owned"
                              ? "success"
                              : book.status === "Wanted"
                              ? "primary"
                              : "default"
                          }
                          sx={{ ml: 1 }}
                        />
                      </Box>
                      <Button
                        size="small"
                        onClick={() =>
                          setShowStatusControls(!showStatusControls)
                        }
                        variant="outlined"
                      >
                        {showStatusControls ? "Hide Options" : "Change Status"}
                      </Button>
                    </Box>

                    {showStatusControls && (
                      <Box
                        sx={{
                          mt: 3,
                          p: 2,
                          bgcolor: "rgba(0,0,0,0.03)",
                          borderRadius: 1,
                        }}
                      >
                        <ButtonGroup
                          variant="outlined"
                          disabled={updatingStatus}
                          fullWidth
                        >
                          <Button
                            color="success"
                            startIcon={<CheckIcon />}
                            onClick={() => updateStatus("Owned")}
                            variant={
                              book.status === "Owned" ? "contained" : "outlined"
                            }
                          >
                            Owned
                          </Button>
                          <Button
                            color="primary"
                            startIcon={<BookmarkIcon />}
                            onClick={() => updateStatus("Wanted")}
                            variant={
                              book.status === "Wanted"
                                ? "contained"
                                : "outlined"
                            }
                          >
                            Wanted
                          </Button>
                          <Button
                            color="error"
                            startIcon={<RemoveCircleIcon />}
                            onClick={() => updateStatus("Not In Collection")}
                            variant={
                              book.status === "Not In Collection"
                                ? "contained"
                                : "outlined"
                            }
                          >
                            Remove
                          </Button>
                        </ButtonGroup>
                        {updatingStatus && (
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              mt: 2,
                            }}
                          >
                            <CircularProgress size={20} />
                          </Box>
                        )}
                      </Box>
                    )}
                  </Box>
                )}
              </Box>
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
