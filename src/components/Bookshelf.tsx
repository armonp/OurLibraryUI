import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Container,
  Box,
  CircularProgress,
  Alert,
  Pagination,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  Button,
  type SelectChangeEvent,
} from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import AutoStoriesRoundedIcon from "@mui/icons-material/AutoStoriesRounded";
import ImageSearchRoundedIcon from "@mui/icons-material/ImageSearchRounded";

// Define the Book type to match backend data structure
interface Book {
  id: string;
  isbn: string;
  title: string;
  author?: string;
  coverURL?: string;
  status?: string;
  dateAdded?: string; // ISO string or undefined
}

const API_URL = "http://localhost:5089";

const COVER_COLORS = ["#0F9B8E", "#FF6B4A", "#F2C46D", "#7C9CE0", "#0B6F65", "#E4AF8E", "#A98FD2"];

const coverColorFor = (title: string) => {
  const hash = title.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return COVER_COLORS[hash % COVER_COLORS.length];
};

const SORT_OPTIONS = [
  { value: "date-added-desc", label: "Date Added (Newest First)" },
  { value: "date-added-asc", label: "Date Added (Oldest First)" },
  { value: "title-asc", label: "Title Ascending" },
  { value: "title-desc", label: "Title Descending" },
  { value: "author-asc", label: "Author Ascending" },
  { value: "author-desc", label: "Author Descending" },
];

const Bookshelf: React.FC = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("date-added-desc"); // Default to date added, newest first
  const [loadingCovers, setLoadingCovers] = useState<Record<string, boolean>>(
    {}
  );
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 12;

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
    if (sortOption === "date-added-desc") {
      // Newest first
      comparison =
        new Date(b.dateAdded || 0).getTime() -
        new Date(a.dateAdded || 0).getTime();
    } else if (sortOption === "date-added-asc") {
      // Oldest first
      comparison =
        new Date(a.dateAdded || 0).getTime() -
        new Date(b.dateAdded || 0).getTime();
    } else if (sortOption === "title-asc") {
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

  // Calculate pagination values
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);
  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);

  // Handle page change
  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setCurrentPage(value);
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const booksWithoutCovers = books.filter((book) => !book.coverURL && book.isbn);

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h2" gutterBottom>
          Bookshelf
        </Typography>
        <Typography sx={{ color: "text.secondary" }}>
          {books.length} book{books.length === 1 ? "" : "s"}, sorted by{" "}
          {SORT_OPTIONS.find((o) => o.value === sortOption)?.label.split(" (")[0].toLowerCase()}
        </Typography>
      </Box>

      <Box
        sx={{
          mb: 4,
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          flexWrap: "wrap",
        }}
      >
        <TextField
          placeholder="Search books..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          size="small"
          sx={{ flex: "1 1 260px", maxWidth: 420 }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRoundedIcon fontSize="small" sx={{ color: "text.secondary" }} />
                </InputAdornment>
              ),
            },
          }}
        />

        <Select
          value={sortOption}
          onChange={(e: SelectChangeEvent) => setSortOption(e.target.value)}
          size="small"
          sx={{ minWidth: 220 }}
        >
          {SORT_OPTIONS.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>

        <Button
          variant="outlined"
          startIcon={<ImageSearchRoundedIcon />}
          disabled={booksWithoutCovers.length === 0}
          onClick={() => {
            booksWithoutCovers.forEach((book) => fetchBookCover(book.id));
          }}
        >
          Find Missing Covers
        </Button>
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
        <>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "repeat(1, 1fr)",
                sm: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)",
                lg: "repeat(4, 1fr)",
              },
              gap: 3,
            }}
          >
            {currentBooks.map((book) => (
              <Card
                key={book.id}
                sx={{ cursor: "pointer" }}
                onClick={() => navigate(`/bookshelf/${book.id}`)}
              >
                {book.coverURL ? (
                  <CardMedia
                    component="img"
                    height="200"
                    image={book.coverURL}
                    alt={book.title}
                    sx={{ objectFit: "contain", bgcolor: "#FBF8F3" }}
                  />
                ) : (
                  <Box
                    sx={{
                      height: 200,
                      bgcolor: coverColorFor(book.title),
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <AutoStoriesRoundedIcon sx={{ color: "rgba(255,255,255,0.85)", fontSize: 40 }} />
                  </Box>
                )}
                <CardContent>
                  <Typography variant="h6" component="h3" sx={{ fontSize: 16 }} gutterBottom>
                    {book.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {book.author || "Unknown Author"}
                  </Typography>
                  {!book.coverURL && book.isbn && (
                    <Button
                      size="small"
                      variant="outlined"
                      sx={{ mt: 1.5 }}
                      disabled={loadingCovers[book.id]}
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent card click when button is clicked
                        fetchBookCover(book.id);
                      }}
                    >
                      {loadingCovers[book.id] ? "Finding..." : "Find Cover"}
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </Box>

          {/* Pagination */}
          {totalPages > 1 && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                size="large"
                shape="rounded"
                showFirstButton
                showLastButton
              />
            </Box>
          )}
        </>
      )}
    </Container>
  );
};

export default Bookshelf;
