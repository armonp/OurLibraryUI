import React, { useState } from "react";
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Container,
  Box,
} from "@mui/material";
import booksData from "../data/books.json";

const Bookshelf: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("title-asc");

  const sortedBooks = booksData.sort((a, b) => {
    let comparison = 0;
    if (sortOption === "title-asc") {
      comparison = a.title.localeCompare(b.title);
    } else if (sortOption === "title-desc") {
      comparison = b.title.localeCompare(a.title);
    } else if (sortOption === "author-asc") {
      comparison = a.author.localeCompare(b.author);
    } else if (sortOption === "author-desc") {
      comparison = b.author.localeCompare(a.author);
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
        </Box>
        <Grid container spacing={3}>
          {filteredBooks.map((book) => (
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={book.isbn}>
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
                  image={book.cover}
                  alt={book.title}
                />
                <CardContent>
                  <Typography variant="h6" component="h3" gutterBottom>
                    {book.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {book.author}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default Bookshelf;
