import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "./theme";
import Navbar from "./components/Navbar";
import Bookshelf from "./components/Bookshelf";
import BookDetail from "./components/BookDetail";
import NewBookForm from "./components/NewBookForm";
import Wishlist from "./components/Wishlist";
import Home from "./components/Home";

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/bookshelf" element={<Bookshelf />} />
            <Route path="/bookshelf/:id" element={<BookDetail />} />
            <Route
              path="/new-book"
              element={
                <NewBookForm
                  onAddBook={(book) => console.log("New book added:", book)}
                />
              }
            />
            <Route path="/wishlist" element={<Wishlist books={[]} />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
};

export default App;
