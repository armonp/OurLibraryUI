import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Box,
  CircularProgress,
  Alert,
  Button,
} from "@mui/material";

interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  coverURL?: string;
  status?: string;
}

const API_URL = "http://localhost:5089";

const Wishlist: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [updatingBook, setUpdatingBook] = useState<string | null>(null);

  const handleMoveToBookshelf = async (book: Book) => {
    try {
      setUpdatingBook(book.id);
      // Update the book's status to "Owned"
      const response = await fetch(`${API_URL}/v1/Books/${book.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...book,
          status: "Owned",
        }),
      });

      if (!response.ok) {
        throw new Error(
          `Failed to update book: ${response.status} ${response.statusText}`
        );
      }

      // Update the local state by removing the book from the wishlist
      setBooks(books.filter((b) => b.id !== book.id));
      setSuccessMessage(`"${book.title}" moved to your bookshelf!`);
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (err) {
      console.error("Error moving book to bookshelf:", err);
      setError(
        err instanceof Error ? err.message : "Failed to move book to bookshelf"
      );
    } finally {
      setUpdatingBook(null);
    }
  };

  useEffect(() => {
    const fetchWishlistBooks = async () => {
      try {
        setLoading(true);
        // Fetch all books and filter for those with status "Wanted"
        const response = await fetch(`${API_URL}/v1/Books`);

        if (!response.ok) {
          throw new Error(
            `Failed to fetch books: ${response.status} ${response.statusText}`
          );
        }

        const allBooks = await response.json();
        const wishlistBooks = allBooks.filter(
          (book: Book) => book.status === "Wanted"
        );

        setBooks(wishlistBooks);
        setError(null);
      } catch (err) {
        console.error("Error fetching wishlist books:", err);
        setError(
          err instanceof Error ? err.message : "Failed to fetch wishlist books"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchWishlistBooks();
  }, []);
  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4, textAlign: "center" }}>
        <Typography variant="h4" component="h2" gutterBottom>
          Your Wishlist
        </Typography>

        {successMessage && (
          <Alert
            severity="success"
            sx={{ mb: 3 }}
            onClose={() => setSuccessMessage(null)}
          >
            {successMessage}
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ my: 4 }}>
            {error}
          </Alert>
        ) : books.length === 0 ? (
          <Box sx={{ my: 4 }}>
            <Typography variant="body1" sx={{ mb: 2 }}>
              No books in your wishlist.
            </Typography>
            <Button variant="contained" color="primary" href="/new-book">
              Add Books to Your Wishlist
            </Button>
          </Box>
        ) : (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "1fr 1fr",
                md: "repeat(3, 1fr)",
                lg: "repeat(4, 1fr)",
              },
              gap: 3,
            }}
          >
            {books.map((book, index) => (
              <Box key={book.id || index}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    transition: "transform 0.2s",
                    "&:hover": {
                      transform: "scale(1.05)",
                    },
                  }}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={
                      book.coverURL ||
                      `https://via.placeholder.com/200x300?text=${encodeURIComponent(
                        book.title
                      )}`
                    }
                    alt={`${book.title} cover`}
                  />
                  <CardContent>
                    <Typography variant="h6" component="h3" gutterBottom>
                      {book.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Author: {book.author}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 2 }}
                    >
                      ISBN: {book.isbn}
                    </Typography>
                    <Button
                      variant="contained"
                      size="small"
                      color="primary"
                      fullWidth
                      onClick={() => handleMoveToBookshelf(book)}
                      disabled={updatingBook === book.id}
                    >
                      {updatingBook === book.id
                        ? "Moving..."
                        : "Add to Bookshelf"}
                    </Button>
                  </CardContent>
                </Card>
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default Wishlist;
