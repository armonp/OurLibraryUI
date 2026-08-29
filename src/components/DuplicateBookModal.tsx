import React from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Box, Typography, Button, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Book } from "../types/Book";

interface DuplicateBookModalProps {
  open: boolean;
  onClose: () => void;
  existingBook: Book | null;
}

const DuplicateBookModal: React.FC<DuplicateBookModalProps> = ({
  open,
  onClose,
  existingBook,
}) => {
  const navigate = useNavigate();

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="duplicate-book-modal-title"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          p: 3,
          width: { xs: "92%", sm: 420 },
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography id="duplicate-book-modal-title" variant="h6">
            Already in Your Library
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>

        {existingBook && (
          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            {existingBook.coverURL && (
              <img
                src={existingBook.coverURL}
                alt={existingBook.title}
                style={{
                  width: 80,
                  height: 120,
                  objectFit: "cover",
                  borderRadius: 4,
                  flexShrink: 0,
                }}
              />
            )}
            <Box>
              <Typography variant="subtitle1">
                {existingBook.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {existingBook.author || "Unknown Author"}
              </Typography>
              {existingBook.status && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 0.5 }}
                >
                  Status: {existingBook.status}
                </Typography>
              )}
            </Box>
          </Box>
        )}

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          A book with this ISBN is already in your library, so it wasn't
          added again.
        </Typography>

        <Box sx={{ display: "flex", gap: 2 }}>
          {existingBook && (
            <Button
              variant="contained"
              fullWidth
              onClick={() => {
                onClose();
                navigate(`/bookshelf/${existingBook.id}`);
              }}
            >
              View Book
            </Button>
          )}
          <Button variant="outlined" fullWidth onClick={onClose}>
            OK
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default DuplicateBookModal;
