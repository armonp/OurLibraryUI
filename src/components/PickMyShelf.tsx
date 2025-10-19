import React, { useState } from "react";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
  Paper,
} from "@mui/material";
import { Book } from "../types/Book";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5089";

const bookCounts = [5, 10, 15, 20];

const PickMyShelf: React.FC = () => {
  const [prompt, setPrompt] = useState("");
  const [count, setCount] = useState(5);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFetch = async () => {
    setLoading(true);
    setError(null);
    setBooks([]);
    try {
      const response = await fetch(
        `${API_URL}/v1/Books/PickMyShelf?prompt=${encodeURIComponent(
          prompt
        )}&count=${count}`
      );
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      setBooks(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch books");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" gutterBottom>
          Pick My Shelf
        </Typography>
        <Paper sx={{ p: 3, mb: 3 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="Prompt (theme, mood, etc.)"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value.slice(0, 256))}
              fullWidth
              variant="outlined"
              inputProps={{ maxLength: 256 }}
            />
            <FormControl fullWidth>
              <InputLabel id="book-count-label">Number of Books</InputLabel>
              <Select
                labelId="book-count-label"
                value={count}
                label="Number of Books"
                onChange={(e) => setCount(Number(e.target.value))}
              >
                {bookCounts.map((n) => (
                  <MenuItem key={n} value={n}>
                    {n}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              variant="contained"
              color="primary"
              onClick={handleFetch}
              disabled={loading || !prompt}
            >
              {loading ? <CircularProgress size={24} /> : "Pick My Shelf"}
            </Button>
            {error && (
              <Typography color="error" variant="body2">
                {error}
              </Typography>
            )}
          </Box>
        </Paper>
        <Box>
          {books.length > 0 && (
            <Box mt={4}>
              <Typography variant="h6" gutterBottom>
                Your Picked Shelf
              </Typography>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "1fr 1fr",
                    md: "1fr 1fr 1fr",
                  },
                  gap: 3,
                }}
              >
                {books.map((book) => (
                  <Paper
                    key={book.id}
                    sx={{ p: 2, borderRadius: 2, boxShadow: 2 }}
                  >
                    <Typography variant="h6">{book.title}</Typography>
                    <Typography variant="subtitle2" color="text.secondary">
                      {book.author}
                    </Typography>
                    {book.coverURL && (
                      <img
                        src={book.coverURL}
                        alt={book.title}
                        style={{
                          width: "100%",
                          maxHeight: 180,
                          objectFit: "contain",
                          marginTop: 8,
                          borderRadius: 4,
                        }}
                      />
                    )}
                    {book.description && (
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        {book.description}
                      </Typography>
                    )}
                  </Paper>
                ))}
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default PickMyShelf;
