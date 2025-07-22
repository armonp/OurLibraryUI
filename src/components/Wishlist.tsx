import React from "react";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Box,
} from "@mui/material";

interface Book {
  cover: string;
  title: string;
  author: string;
  isbn: string;
}

interface WishlistProps {
  books: Book[];
}

const Wishlist: React.FC<WishlistProps> = ({ books }) => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4, textAlign: "center" }}>
        <Typography variant="h4" component="h2" gutterBottom>
          Your Wishlist
        </Typography>

        {books.length === 0 ? (
          <Typography variant="body1">No books in your wishlist.</Typography>
        ) : (
          <Grid container spacing={3}>
            {books.map((book, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={index}>
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
                    alt={`${book.title} cover`}
                  />
                  <CardContent>
                    <Typography variant="h6" component="h3" gutterBottom>
                      {book.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Author: {book.author}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      ISBN: {book.isbn}
                    </Typography>
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

export default Wishlist;
