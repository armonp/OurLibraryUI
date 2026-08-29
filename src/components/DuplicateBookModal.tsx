import React from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Paper, Box, Typography, Button, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import LibraryAddCheckRoundedIcon from "@mui/icons-material/LibraryAddCheckRounded";
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
      <Paper
        elevation={3}
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          p: 3,
          width: { xs: "92%", sm: 420 },
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                bgcolor: "#E3F5F2",
                color: "primary.dark",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <LibraryAddCheckRoundedIcon fontSize="small" />
            </Box>
            <Typography
              id="duplicate-book-modal-title"
              variant="h6"
              sx={{ lineHeight: 1.2 }}
            >
              Already in Your Library
            </Typography>
          </Box>
          <IconButton onClick={onClose} size="small" sx={{ mt: -0.5, mr: -0.5 }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        {existingBook && (
          <Box
            sx={{
              display: "flex",
              gap: 2,
              mb: 2,
              p: 1.5,
              borderRadius: "16px",
              bgcolor: "#FBF8F3",
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            {existingBook.coverURL && (
              <Box
                component="img"
                src={existingBook.coverURL}
                alt={existingBook.title}
                sx={{
                  width: 64,
                  height: 96,
                  objectFit: "cover",
                  borderRadius: "8px",
                  border: "1px solid",
                  borderColor: "divider",
                  flexShrink: 0,
                }}
              />
            )}
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }} noWrap>
                {existingBook.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" noWrap>
                {existingBook.author || "Unknown Author"}
              </Typography>
              {existingBook.status && (
                <Box className="book-info-tag" sx={{ mt: 1 }}>
                  {existingBook.status}
                </Box>
              )}
            </Box>
          </Box>
        )}

        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          A book with this ISBN is already in your library, so it wasn't
          added again.
        </Typography>

        <Box sx={{ display: "flex", gap: 1.5 }}>
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
      </Paper>
    </Modal>
  );
};

export default DuplicateBookModal;
