import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Tabs,
  Tab,
  Modal,
  Chip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import CloseIcon from "@mui/icons-material/Close";
import CategoryIcon from "@mui/icons-material/Category";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import BusinessIcon from "@mui/icons-material/Business";
import LanguageIcon from "@mui/icons-material/Language";
import LocalLibraryIcon from "@mui/icons-material/LocalLibrary";

interface NewBookFormProps {
  onAddBook: (
    book: {
      title: string;
      author: string;
      isbn: string;
      coverURL?: string;
      publishedYear?: number;
      publishers?: string[];
      genres?: string[];
      subjects?: string[];
      edition?: string;
      description?: string;
      pageCount?: number;
      language?: string;
    },
    destination?: string
  ) => Promise<any>;
}

// Define the Book type to match backend data structure
interface Book {
  id: string;
  ISBN: string; // Changed from lowercase isbn to uppercase ISBN to match backend model
  isbn?: string; // Keep lowercase for backward compatibility
  title: string;
  author?: string;
  coverURL?: string;
  status?: string;
  publishedYear?: number;
  publishers?: string[];
  genres?: string[];
  subjects?: string[];
  edition?: string;
  description?: string;
  pageCount?: number;
  language?: string;
}

const API_URL = "http://localhost:5089";

const NewBookForm: React.FC<NewBookFormProps> = ({ onAddBook }) => {
  const navigate = useNavigate();
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState<boolean>(false);

  // Tab state
  const [currentTab, setCurrentTab] = useState<number>(0);

  // Manual entry form state
  const [title, setTitle] = useState<string>("");
  const [author, setAuthor] = useState<string>("");
  const [isbn, setIsbn] = useState<string>("");

  // Search state
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<Book[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  // Success notification
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Handle tab change
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
    // Reset states when switching tabs
    setSearchResults([]);
    setSearchError(null);
  };

  // Handle manual form submit
  const handleManualSubmit = async (
    e: React.FormEvent,
    destination: string = "bookshelf"
  ) => {
    e.preventDefault();
    if (title && author && isbn) {
      try {
        const result = await onAddBook(
          {
            title,
            author,
            isbn,
            // We don't have these fields in the manual form, but sending empty values
            // to maintain consistency with the API expectations
            publishedYear: undefined,
            publishers: [],
            genres: [],
            subjects: [],
            edition: undefined,
            description: undefined,
            pageCount: undefined,
            language: undefined,
          },
          destination
        );
        if (result) {
          const locationName =
            destination === "wishlist" ? "wishlist" : "collection";
          setSuccessMessage(
            `"${title}" has been added to your ${locationName}!`
          );
          setTimeout(() => setSuccessMessage(null), 5000); // Clear message after 5 seconds
          setTitle("");
          setAuthor("");
          setIsbn("");
        }
      } catch (error) {
        console.error("Error adding book manually:", error);
      }
    }
  };

  // Show book details in modal
  const handleViewDetails = (book: Book) => {
    setSelectedBook(book);
    setDetailModalOpen(true);
  };

  // Close the book detail modal
  const handleCloseModal = () => {
    setDetailModalOpen(false);
  };

  // Handle search form submission
  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    setSearchError(null);

    try {
      const response = await fetch(
        `${API_URL}/v1/search/${encodeURIComponent(searchQuery)}`
      );

      if (!response.ok) {
        throw new Error(
          `Search failed: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();

      // Process search results

      setSearchResults(data);

      if (data.length === 0) {
        setSearchError("No books found matching your search.");
      }
    } catch (err) {
      console.error("Error searching books:", err);
      setSearchError(
        err instanceof Error ? err.message : "Failed to search for books"
      );
    } finally {
      setIsSearching(false);
    }
  };

  // Handle selecting a book from search results
  const handleSelectBook = async (
    book: Book,
    destination: string = "bookshelf"
  ) => {
    const isbn = book.ISBN || book.isbn || "";

    const result = await onAddBook(
      {
        title: book.title,
        author: book.author || "Unknown",
        isbn: isbn, // Use uppercase ISBN with fallback to lowercase
        coverURL: book.coverURL,
        publishedYear: book.publishedYear,
        publishers: book.publishers,
        genres: book.genres,
        subjects: book.subjects,
        edition: book.edition,
        description: book.description,
        pageCount: book.pageCount,
        language: book.language,
      },
      destination
    );

    if (result) {
      const locationName =
        destination === "wishlist" ? "wishlist" : "collection";
      setSuccessMessage(
        `"${book.title}" has been added to your ${locationName}!`
      );
      setTimeout(() => setSuccessMessage(null), 5000); // Clear message after 5 seconds

      // Reset search after adding
      setSearchQuery("");
      setSearchResults([]);
    }
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" component="h2" gutterBottom align="center">
          Add a New Book
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

        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
          <Tabs
            value={currentTab}
            onChange={handleTabChange}
            centered
            aria-label="book addition methods"
          >
            <Tab label="Search for Books" />
            <Tab label="Manual Entry" />
          </Tabs>
        </Box>

        {/* Search Tab */}
        {currentTab === 0 && (
          <Box>
            <Box sx={{ display: "flex", mb: 2 }}>
              <TextField
                margin="normal"
                fullWidth
                id="search"
                label="Search for a book by title"
                name="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{ mr: 1, flex: 1 }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleSearch();
                  }
                }}
                autoFocus
              />
              <Button
                variant="contained"
                onClick={handleSearch}
                disabled={isSearching || !searchQuery.trim()}
                sx={{ mt: 2, height: 56 }}
                startIcon={<SearchIcon />}
              >
                Search
              </Button>
            </Box>

            {isSearching && (
              <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
                <CircularProgress />
              </Box>
            )}

            {searchError && (
              <Alert severity="info" sx={{ mt: 2, mb: 2 }}>
                {searchError}
              </Alert>
            )}

            {searchResults.length > 0 && (
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "minmax(0, 1fr)",
                    sm: "repeat(2, minmax(0, 1fr))",
                    md: "repeat(3, minmax(0, 1fr))",
                  },
                  gap: 2,
                  width: "100%",
                  overflow: "hidden",
                }}
              >
                {searchResults.map((book) => (
                  <Box key={book.id} sx={{ width: "100%", overflow: "hidden" }}>
                    <Card
                      className="search-result-card"
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        height: "100%",
                        position: "relative",
                        pb: 3 /* Increased padding bottom */,
                        maxWidth: "100%",
                        overflow: "hidden",
                        cursor: "pointer",
                        transition:
                          "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
                        "&:hover": {
                          transform: "translateY(-4px)",
                          boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
                        },
                      }}
                      onClick={(e) => {
                        // Prevent click event when buttons are clicked
                        if ((e.target as HTMLElement).closest("button")) return;
                        handleViewDetails(book);
                      }}
                    >
                      <Box
                        sx={{
                          position: "absolute",
                          left: 8,
                          top: 8,
                          display: "flex",
                          flexDirection: "column",
                          gap: 1,
                          zIndex: 1,
                          maxWidth: "calc(50% - 16px)",
                        }}
                      >
                        <Button
                          variant="contained"
                          size="small"
                          color="primary"
                          onClick={() => handleSelectBook(book, "bookshelf")}
                          sx={{
                            backgroundColor: "rgba(25, 118, 210, 0.9)",
                            color: "white",
                            "&:hover": {
                              backgroundColor: "rgba(25, 118, 210, 1)",
                              transform: "scale(1.05)",
                            },
                            whiteSpace: "nowrap",
                            fontSize: "0.75rem",
                            py: 0.5,
                            px: 1,
                            borderRadius: "12px",
                            boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                          }}
                          startIcon={<AddCircleIcon />}
                        >
                          Add to Shelf
                        </Button>
                      </Box>

                      <Box
                        sx={{
                          position: "absolute",
                          top: 8, // Changed from bottom to top
                          right: 8, // Aligned to right instead of center
                          display: "flex",
                          justifyContent: "flex-end",
                          zIndex: 1,
                        }}
                      >
                        <Button
                          variant="outlined"
                          size="small"
                          color="secondary"
                          onClick={() => handleSelectBook(book, "wishlist")}
                          sx={{
                            backgroundColor: "rgba(255, 255, 255, 0.9)",
                            "&:hover": {
                              backgroundColor: "rgba(255, 255, 255, 1)",
                              transform: "scale(1.05)",
                            },
                            whiteSpace: "nowrap",
                            fontSize: "0.75rem",
                            py: 0.5,
                            px: 1,
                            minWidth: "auto",
                            borderRadius: "12px",
                          }}
                        >
                          Add to Wishlist
                        </Button>
                      </Box>
                      <CardMedia
                        component="img"
                        sx={{
                          height: 200,
                          objectFit: "contain",
                          backgroundColor: "#f5f5f5",
                        }}
                        image={
                          book.coverURL ||
                          `https://via.placeholder.com/200x300?text=${encodeURIComponent(
                            book.title
                          )}`
                        }
                        alt={book.title}
                      />
                      <CardContent sx={{ overflow: "hidden" }}>
                        <Typography
                          gutterBottom
                          variant="h6"
                          component="div"
                          noWrap
                          sx={{ textOverflow: "ellipsis" }}
                        >
                          {book.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          noWrap
                          sx={{ textOverflow: "ellipsis" }}
                        >
                          {book.author || "Unknown Author"}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        )}

        {/* Manual Entry Tab */}
        {currentTab === 1 && (
          <Box
            component="form"
            onSubmit={(e) => e.preventDefault()}
            noValidate
            sx={{ mt: 2 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="title"
              label="Title"
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="author"
              label="Author"
              name="author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="isbn"
              label="ISBN"
              name="isbn"
              value={isbn}
              onChange={(e) => setIsbn(e.target.value)}
            />
            <Box sx={{ display: "flex", gap: 2, mt: 3, mb: 2 }}>
              <Button
                type="button"
                variant="contained"
                fullWidth
                onClick={(e) => {
                  e.preventDefault();
                  if (title && author && isbn) {
                    handleManualSubmit(e, "bookshelf");
                  }
                }}
              >
                Add to Bookshelf
              </Button>
              <Button
                type="button"
                variant="outlined"
                color="secondary"
                fullWidth
                onClick={(e) => {
                  e.preventDefault();
                  if (title && author && isbn) {
                    handleManualSubmit(e, "wishlist");
                  }
                }}
              >
                Add to Wishlist
              </Button>
            </Box>
          </Box>
        )}
      </Paper>

      {/* Book Detail Modal */}
      <Modal
        open={detailModalOpen}
        onClose={handleCloseModal}
        aria-labelledby="book-detail-modal"
        aria-describedby="book-detail-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "90%", sm: "80%", md: "70%" },
            maxWidth: "900px",
            maxHeight: "90vh",
            overflow: "auto",
            overflowY: "scroll",
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
          }}
        >
          {selectedBook && (
            <>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  mb: 3,
                }}
              >
                <Typography
                  variant="h4"
                  component="h2"
                  sx={{ fontWeight: "bold", mb: 1 }}
                >
                  {selectedBook.title}
                </Typography>
                <IconButton onClick={handleCloseModal} sx={{ p: 1 }}>
                  <CloseIcon />
                </IconButton>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  gap: 4,
                }}
              >
                {/* Book Cover */}
                <Box sx={{ width: { xs: "100%", sm: "30%", md: "25%" } }}>
                  <Box
                    sx={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "center",
                      mb: { xs: 2, sm: 0 },
                    }}
                  >
                    <img
                      src={
                        selectedBook.coverURL ||
                        `https://via.placeholder.com/200x300?text=${encodeURIComponent(
                          selectedBook.title
                        )}`
                      }
                      alt={selectedBook.title}
                      style={{
                        maxWidth: "100%",
                        maxHeight: "300px",
                        objectFit: "contain",
                        boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                        borderRadius: "4px",
                      }}
                    />
                  </Box>

                  {/* Action Buttons */}
                  <Box
                    sx={{
                      mt: 3,
                      display: "flex",
                      flexDirection: "column",
                      gap: 2,
                    }}
                  >
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      startIcon={<AddCircleIcon />}
                      onClick={() => {
                        handleSelectBook(selectedBook, "bookshelf");
                        handleCloseModal();
                      }}
                    >
                      Add to Bookshelf
                    </Button>
                    <Button
                      variant="outlined"
                      color="secondary"
                      fullWidth
                      onClick={() => {
                        handleSelectBook(selectedBook, "wishlist");
                        handleCloseModal();
                      }}
                    >
                      Add to Wishlist
                    </Button>
                  </Box>
                </Box>

                {/* Book Details */}
                <Box sx={{ width: { xs: "100%", sm: "70%", md: "75%" } }}>
                  {/* Author */}
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    {selectedBook.author || "Unknown Author"}
                  </Typography>

                  {/* Publication Info */}
                  <Box sx={{ mb: 3 }}>
                    {selectedBook.publishedYear && (
                      <Typography variant="body1" color="text.secondary">
                        Published: {selectedBook.publishedYear}
                        {selectedBook.publishers &&
                          selectedBook.publishers.length > 0 && (
                            <> by {selectedBook.publishers.join(", ")}</>
                          )}
                      </Typography>
                    )}

                    {selectedBook.language && (
                      <Box
                        sx={{ display: "flex", alignItems: "center", mt: 1 }}
                      >
                        <LanguageIcon
                          fontSize="small"
                          sx={{ mr: 1, color: "text.secondary" }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          Language: {selectedBook.language}
                        </Typography>
                      </Box>
                    )}

                    {selectedBook.pageCount && (
                      <Box
                        sx={{ display: "flex", alignItems: "center", mt: 1 }}
                      >
                        <MenuBookIcon
                          fontSize="small"
                          sx={{ mr: 1, color: "text.secondary" }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          Pages: {selectedBook.pageCount}
                        </Typography>
                      </Box>
                    )}
                  </Box>

                  {/* Description */}
                  {selectedBook.description && (
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="h6" gutterBottom>
                        Description
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{ whiteSpace: "pre-wrap" }}
                      >
                        {selectedBook.description}
                      </Typography>
                    </Box>
                  )}

                  {/* Genres/Subjects */}
                  {(selectedBook.genres || selectedBook.subjects) && (
                    <Box sx={{ mb: 3 }}>
                      <Typography
                        variant="h6"
                        gutterBottom
                        sx={{ display: "flex", alignItems: "center" }}
                      >
                        <CategoryIcon sx={{ mr: 1 }} /> Categories
                      </Typography>
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                        {selectedBook.genres &&
                          selectedBook.genres.map((genre, index) => (
                            <Chip
                              key={`genre-${index}`}
                              label={genre}
                              size="small"
                              color="primary"
                              variant="outlined"
                            />
                          ))}
                        {selectedBook.subjects &&
                          selectedBook.subjects
                            .slice(0, 10)
                            .map((subject, index) => (
                              <Chip
                                key={`subject-${index}`}
                                label={subject}
                                size="small"
                              />
                            ))}
                      </Box>
                    </Box>
                  )}

                  {/* Publishers */}
                  {selectedBook.publishers &&
                    selectedBook.publishers.length > 0 && (
                      <Box sx={{ mb: 3 }}>
                        <Typography
                          variant="h6"
                          gutterBottom
                          sx={{ display: "flex", alignItems: "center" }}
                        >
                          <BusinessIcon sx={{ mr: 1 }} /> Publishers
                        </Typography>
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                          {selectedBook.publishers.map((publisher, index) => (
                            <Chip
                              key={`publisher-${index}`}
                              label={publisher}
                              size="small"
                              variant="outlined"
                            />
                          ))}
                        </Box>
                      </Box>
                    )}

                  {/* Edition Information */}
                  {selectedBook.edition && (
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="body2" color="text.secondary">
                        <LocalLibraryIcon
                          fontSize="small"
                          sx={{ mr: 1, verticalAlign: "middle" }}
                        />
                        Edition: {selectedBook.edition}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Box>
            </>
          )}
        </Box>
      </Modal>
    </Container>
  );
};

export default NewBookForm;
