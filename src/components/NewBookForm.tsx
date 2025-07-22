import React, { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Paper,
} from "@mui/material";

interface NewBookFormProps {
  onAddBook: (book: { title: string; author: string; isbn: string }) => void;
}

const NewBookForm: React.FC<NewBookFormProps> = ({ onAddBook }) => {
  const [title, setTitle] = useState<string>("");
  const [author, setAuthor] = useState<string>("");
  const [isbn, setIsbn] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title && author && isbn) {
      onAddBook({ title, author, isbn });
      setTitle("");
      setAuthor("");
      setIsbn("");
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" component="h2" gutterBottom align="center">
          Add a New Book
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="title"
            label="Title"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
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
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Add Book
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default NewBookForm;
