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
  ButtonGroup,
  Chip,
  Snackbar,
  TextField,
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
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import EventIcon from "@mui/icons-material/Event";
import LanguageIcon from "@mui/icons-material/Language";
import EditIcon from "@mui/icons-material/Edit";
import EditNoteIcon from "@mui/icons-material/EditNote";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
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

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5089";

const COVER_COLORS = ["#0F9B8E", "#FF6B4A", "#F2C46D", "#7C9CE0", "#0B6F65", "#E4AF8E", "#A98FD2"];

const coverColorFor = (title: string) => {
  const hash = title.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return COVER_COLORS[hash % COVER_COLORS.length];
};

const STATUS_INFO: Record<
  string,
  { label: string; color: "primary" | "secondary"; icon: typeof CheckIcon }
> = {
  Owned: { label: "On the Shelf", color: "primary", icon: CheckIcon },
  Wanted: { label: "On the Wishlist", color: "secondary", icon: BookmarkIcon },
};
const NOT_IN_COLLECTION_INFO = {
  label: "Not in Your Collection",
  color: "default" as const,
  icon: MenuBookIcon,
};

const InfoPill: React.FC<{ icon: React.ReactNode; children: React.ReactNode }> = ({
  icon,
  children,
}) => (
  <Box
    component="span"
    className="book-info-tag"
    sx={{ display: "inline-flex", alignItems: "center", gap: 0.5 }}
  >
    {icon}
    {children}
  </Box>
);

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

  const addToCollection = async (destination: "bookshelf" | "wishlist") => {
    if (!book) return;

    try {
      setAddingToCollection(true);
      setAddError(null);

      // Prepare the book data with appropriate status
      const bookToAdd = {
        ...book,
        status: destination === "wishlist" ? "Wanted" : "Owned",
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

  const cancelEditNotes = () => {
    setNotes(book?.notes || "");
    setIsEditingNotes(false);
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
      <Container maxWidth="md" sx={{ py: 5 }}>
        <Box sx={{ display: "flex", justifyContent: "center", my: 8 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error || !book) {
    return (
      <Container maxWidth="md" sx={{ py: 5 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={handleBack} variant="outlined">
          Back to Bookshelf
        </Button>
        <Alert severity="error" sx={{ mt: 3 }}>
          {error || "Book not found"}
        </Alert>
      </Container>
    );
  }

  const isInCollection = !!book.status && book.status !== "Not In Collection";
  const statusInfo = book.status && STATUS_INFO[book.status]
    ? STATUS_INFO[book.status]
    : NOT_IN_COLLECTION_INFO;
  const StatusIcon = statusInfo.icon;
  const isbn = book.ISBN || book.isbn;

  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Snackbar
        open={!!statusMessage}
        autoHideDuration={5000}
        onClose={() => setStatusMessage(null)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={() => setStatusMessage(null)} severity="success" sx={{ width: "100%" }}>
          {statusMessage}
        </Alert>
      </Snackbar>

      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2, mb: 3 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={handleBack} variant="outlined">
          Back to Bookshelf
        </Button>

        {book.id && isInCollection && !isEditMode && (
          <Button
            onClick={handleEnterEditMode}
            variant="outlined"
            color="secondary"
            startIcon={<EditIcon />}
          >
            Edit Details
          </Button>
        )}
      </Box>

      {isEditMode ? (
        <EditBookForm book={book} onSave={handleSaveEdit} onCancel={handleCancelEdit} />
      ) : (
        <Paper elevation={0} sx={{ p: { xs: 3, md: 4 } }}>
          <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 4 }}>
            {/* Cover column */}
            <Box sx={{ flex: { xs: "1", md: "0 0 220px" }, display: "flex", flexDirection: "column", alignItems: "center", gap: 1.5 }}>
              <Box
                sx={{
                  width: "100%",
                  maxWidth: 220,
                  aspectRatio: "2 / 3",
                  borderRadius: "16px",
                  overflow: "hidden",
                  border: "1px solid",
                  borderColor: "divider",
                  bgcolor: book.coverURL ? "#fff" : coverColorFor(book.title),
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {book.coverURL ? (
                  <img
                    src={book.coverURL}
                    alt={book.title}
                    style={{ width: "100%", height: "100%", objectFit: "contain" }}
                  />
                ) : (
                  <MenuBookIcon sx={{ fontSize: 56, color: "rgba(255,255,255,0.85)" }} />
                )}
              </Box>
              {!book.coverURL && isbn && (
                <Button
                  variant="outlined"
                  size="small"
                  onClick={fetchBookCover}
                  disabled={loadingCover}
                  startIcon={loadingCover ? <CircularProgress size={16} /> : undefined}
                >
                  {loadingCover ? "Finding Cover..." : "Find Cover Image"}
                </Button>
              )}
            </Box>

            {/* Details column */}
            <Box sx={{ flex: "1", minWidth: 0 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 1.5 }}>
                <Typography variant="h4" component="h1">
                  {book.title}
                </Typography>
                <Chip
                  icon={<StatusIcon fontSize="small" />}
                  label={statusInfo.label}
                  color={statusInfo.color}
                  sx={{ flexShrink: 0 }}
                />
              </Box>
              <Typography variant="subtitle1" sx={{ color: "text.secondary", mb: 2 }}>
                {book.author || "Unknown Author"}
              </Typography>

              {addSuccess && (
                <Alert severity="success" sx={{ mb: 2 }}>
                  {addSuccess}
                </Alert>
              )}
              {addError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {addError}
                </Alert>
              )}

              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {isbn && <span className="isbn-tag">ISBN {isbn}</span>}
                {book.publishedYear && (
                  <InfoPill icon={<EventIcon sx={{ fontSize: 15 }} />}>{book.publishedYear}</InfoPill>
                )}
                {!!book.pageCount && (
                  <InfoPill icon={<MenuBookIcon sx={{ fontSize: 15 }} />}>{book.pageCount} pages</InfoPill>
                )}
                {book.language && (
                  <InfoPill icon={<LanguageIcon sx={{ fontSize: 15 }} />}>{book.language}</InfoPill>
                )}
                {book.edition && (
                  <InfoPill icon={<LocalOfferIcon sx={{ fontSize: 15 }} />}>{book.edition}</InfoPill>
                )}
                {!!book.publishers?.length && (
                  <InfoPill icon={<BusinessIcon sx={{ fontSize: 15 }} />}>
                    {book.publishers.join(", ")}
                  </InfoPill>
                )}
              </Box>

              {!!(book.genres?.length || book.subjects?.length) && (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 2 }}>
                  {[...(book.genres || []), ...(book.subjects || [])].map((tag) => (
                    <Chip key={tag} size="small" icon={<CategoryIcon />} label={tag} variant="outlined" />
                  ))}
                </Box>
              )}

              {book.description && (
                <Box className="book-detail-section">
                  <Typography component="h4">
                    <DescriptionIcon fontSize="small" /> Description
                  </Typography>
                  <Box className="book-description">{book.description}</Box>
                </Box>
              )}

              {!isInCollection ? (
                <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap", mt: 3 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => addToCollection("bookshelf")}
                    disabled={addingToCollection}
                    startIcon={<MenuBookIcon />}
                  >
                    Add to Bookshelf
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => addToCollection("wishlist")}
                    disabled={addingToCollection}
                    startIcon={<BookmarkIcon />}
                  >
                    Add to Wishlist
                  </Button>
                </Box>
              ) : (
                <Box sx={{ mt: 3 }}>
                  <Button
                    variant="text"
                    size="small"
                    onClick={() => setShowStatusControls((v) => !v)}
                  >
                    {showStatusControls ? "Hide status options" : "Change status"}
                  </Button>
                  {showStatusControls && (
                    <ButtonGroup sx={{ mt: 1, display: "flex", flexWrap: "wrap" }} disabled={updatingStatus}>
                      <Button
                        variant={book.status === "Owned" ? "contained" : "outlined"}
                        onClick={() => updateStatus("Owned")}
                        startIcon={<CheckIcon />}
                      >
                        Owned
                      </Button>
                      <Button
                        variant={book.status === "Wanted" ? "contained" : "outlined"}
                        onClick={() => updateStatus("Wanted")}
                        startIcon={<BookmarkIcon />}
                      >
                        Wishlist
                      </Button>
                      <Button
                        color="error"
                        variant="outlined"
                        onClick={() => updateStatus("Not In Collection")}
                        startIcon={<RemoveCircleIcon />}
                      >
                        Remove
                      </Button>
                    </ButtonGroup>
                  )}
                </Box>
              )}

              <Box className="notes-container" sx={{ mt: 3 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                  <Typography
                    variant="subtitle2"
                    sx={{ display: "flex", alignItems: "center", gap: 0.75, fontWeight: 700, color: "primary.dark" }}
                  >
                    <EditNoteIcon fontSize="small" /> Your Notes
                  </Typography>
                  {!isEditingNotes && book.id && (
                    <IconButton size="small" onClick={() => setIsEditingNotes(true)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                  )}
                </Box>

                {isEditingNotes ? (
                  <>
                    <TextField
                      fullWidth
                      multiline
                      minRows={3}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Jot down anything you want to remember about this book..."
                    />
                    <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 1.5 }}>
                      <Button size="small" variant="outlined" onClick={cancelEditNotes} startIcon={<CloseIcon />} disabled={savingNotes}>
                        Cancel
                      </Button>
                      <Button
                        size="small"
                        variant="contained"
                        onClick={saveNotes}
                        disabled={savingNotes}
                        startIcon={savingNotes ? <CircularProgress size={16} /> : <SaveIcon />}
                      >
                        {savingNotes ? "Saving..." : "Save"}
                      </Button>
                    </Box>
                  </>
                ) : (
                  <Typography variant="body2" sx={{ color: book.notes ? "text.primary" : "text.secondary" }}>
                    {book.notes || "No notes yet."}
                  </Typography>
                )}
              </Box>
            </Box>
          </Box>
        </Paper>
      )}
    </Container>
  );
};

export default BookDetail;
