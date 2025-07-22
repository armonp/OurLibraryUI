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
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

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
                  <Typography
                    variant="body1"
                    sx={{
                      py: 1,
                      px: 2,
                      mt: 2,
                      bgcolor: "background.paper",
                      borderLeft: "4px solid",
                      borderColor: "primary.main",
                    }}
                  >
                    <strong>Status:</strong> {book.status}
                  </Typography>
                )}
              </Box>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default BookDetail;
