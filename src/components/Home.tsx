import React from "react";
import { Container, Typography, Box, Paper } from "@mui/material";

const Home: React.FC = () => {
  return (
    <Container
      maxWidth="md"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "calc(100vh - 64px)" /* AppBar height is 64px by default */,
        textAlign: "center",
        py: 4,
      }}
    >
      <Typography variant="h3" component="h1" gutterBottom>
        Welcome to our library!
      </Typography>
      <Paper
        elevation={3}
        sx={{
          width: 300,
          height: 300,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "grey.200",
          border: "2px dashed grey.400",
          borderRadius: 2,
          mt: 3,
        }}
      >
        <Typography variant="body2" color="text.secondary">
          Image Placeholder
        </Typography>
      </Paper>
    </Container>
  );
};

export default Home;
