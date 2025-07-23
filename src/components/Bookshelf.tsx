import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Container,
  Box,
  CircularProgress,
  Alert,
} from "@mui/material";

// Define the Book type to match backend data structure
interface Book {
  id: string;
  isbn: string;
  title: string;
  author?: string;
  coverURL?: string;
  status?: string;
}

const API_URL = "http://localhost:5089";

const Bookshelf: React.FC = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("title-asc");
  const [loadingCovers, setLoadingCovers] = useState<Record<string, boolean>>(
    {}
  );

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/v1/Books`);

        if (!response.ok) {
          throw new Error(
            `Failed to fetch books: ${response.status} ${response.statusText}`
          );
        }

        const data = await response.json();
        // Filter to only show books with "Owned" status, excluding "Not In Collection"
        const ownedBooks = data.filter((book: Book) => book.status === "Owned");
        setBooks(ownedBooks);
        setError(null);
      } catch (err) {
        console.error("Error fetching books:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch books");
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []); // Empty dependency array means this effect runs once on component mount

  const fetchBookCover = async (id: string) => {
    try {
      setLoadingCovers((prev) => ({ ...prev, [id]: true }));
      const response = await fetch(`${API_URL}/v1/Books/${id}/cover`, {
        method: "PUT",
      });

      if (!response.ok) {
        throw new Error(
          `Failed to fetch cover: ${response.status} ${response.statusText}`
        );
      }

      const result = await response.json();

      // Update the book in our local state
      setBooks((prevBooks) =>
        prevBooks.map((book) =>
          book.id === id ? { ...book, coverURL: result.coverUrl } : book
        )
      );
    } catch (err) {
      console.error("Error fetching book cover:", err);
    } finally {
      setLoadingCovers((prev) => ({ ...prev, [id]: false }));
    }
  };

  const sortedBooks = [...books].sort((a, b) => {
    let comparison = 0;
    if (sortOption === "title-asc") {
      comparison = a.title.localeCompare(b.title);
    } else if (sortOption === "title-desc") {
      comparison = b.title.localeCompare(a.title);
    } else if (sortOption === "author-asc") {
      comparison = (a.author || "").localeCompare(b.author || "");
    } else if (sortOption === "author-desc") {
      comparison = (b.author || "").localeCompare(a.author || "");
    }
    return comparison;
  });

  const filteredBooks = sortedBooks.filter((book) =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4, textAlign: "center" }}>
        <Typography variant="h4" component="h2" gutterBottom>
          Bookshelf
        </Typography>
        <Box sx={{ mb: 4 }}>
          <input
            type="text"
            placeholder="Search books..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ padding: "8px", width: "100%", maxWidth: "400px" }}
          />
          <label htmlFor="sort-dropdown" style={{ marginLeft: "10px" }}>
            Sort by:
          </label>
          <select
            id="sort-dropdown"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            style={{ marginLeft: "10px", padding: "8px" }}
          >
            <option value="title-asc">Title Ascending</option>
            <option value="title-desc">Title Descending</option>
            <option value="author-asc">Author Ascending</option>
            <option value="author-desc">Author Descending</option>
          </select>

          <button
            onClick={() => {
              const booksWithoutCovers = books.filter(
                (book) => !book.coverURL && book.isbn
              );
              booksWithoutCovers.forEach((book) => fetchBookCover(book.id));
            }}
            style={{
              marginLeft: "10px",
              padding: "8px 16px",
              backgroundColor: "#1976d2",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Find All Missing Covers
          </button>
        </Box>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ my: 4 }}>
            {error}
          </Alert>
        ) : filteredBooks.length === 0 ? (
          <Alert severity="info" sx={{ my: 4 }}>
            No books found. Try a different search term.
          </Alert>
        ) : (
          <Grid container spacing={3}>
            {filteredBooks.map((book) => (
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={book.id}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    transition: "transform 0.2s",
                    cursor: "pointer",
                    "&:hover": {
                      transform: "scale(1.05)",
                    },
                  }}
                  onClick={() => navigate(`/bookshelf/${book.id}`)}
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
                    alt={book.title}
                    style={{ objectFit: "contain" }}
                  />
                  <CardContent>
                    <Typography variant="h6" component="h3" gutterBottom>
                      {book.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {book.author || "Unknown Author"}
                    </Typography>
                    {!book.coverURL && book.isbn && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent card click when button is clicked
                          fetchBookCover(book.id);
                        }}
                        disabled={loadingCovers[book.id]}
                        style={{
                          marginTop: "10px",
                          padding: "5px 10px",
                          backgroundColor: loadingCovers[book.id]
                            ? "#cccccc"
                            : "#1976d2",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          cursor: loadingCovers[book.id]
                            ? "default"
                            : "pointer",
                        }}
                      >
                        {loadingCovers[book.id] ? "Finding..." : "Find Cover"}
                      </button>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Container>
  );
};

export default Bookshelf;
