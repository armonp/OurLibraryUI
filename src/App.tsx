import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "./theme";
import Navbar from "./components/Navbar";
import Bookshelf from "./components/Bookshelf";
import "./styles/global.css";
import BookDetail from "./components/BookDetail";
import NewBookForm from "./components/NewBookForm";
import Wishlist from "./components/Wishlist";
import Home from "./components/Home";
import PickMyShelf from "./components/PickMyShelf";
import Login from "./components/Login";
import { AuthProvider, getAuthHeaders } from "./auth/AuthContext";
import ProtectedRoute from "./auth/ProtectedRoute";
import { DuplicateBookError } from "./types/DuplicateBookError";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5089";

const App: React.FC = () => {
  // We don't need to maintain a separate wishlist state since we'll fetch from the API

  const handleAddBook = async (
    book: {
      title: string;
      author: string;
      isbn: string; // Keep as lowercase to match interface with NewBookForm
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
    destination: string = "bookshelf"
  ) => {
    try {
      // Set the appropriate status based on destination
      const status = destination === "wishlist" ? "Wanted" : "Owned";

      // Create request body with all fields
      const requestBody = {
        ISBN: book.isbn || "",
        title: book.title,
        author: book.author,
        coverURL: book.coverURL,
        status: status,
        publishedYear: book.publishedYear,
        publishers: book.publishers,
        genres: book.genres,
        subjects: book.subjects,
        edition: book.edition,
        description: book.description,
        pageCount: book.pageCount,
        language: book.language,
      };

      // Add to Cosmos DB via API with the appropriate status
      const response = await fetch(`${API_URL}/v1/Books`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        if (response.status === 409) {
          const errorBody = await response.json().catch(() => null);
          throw new DuplicateBookError(errorBody?.existingBook ?? null);
        }
        throw new Error(
          `Failed to add book: ${response.status} ${response.statusText}`
        );
      }

      const addedBook = await response.json();

      return addedBook;
    } catch (error) {
      if (error instanceof DuplicateBookError) {
        throw error;
      }
      console.error("Error adding book:", error);
      return null;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AuthProvider>
          <div className="App">
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/bookshelf" element={<Bookshelf />} />
              <Route path="/bookshelf/:id" element={<BookDetail />} />
              <Route path="/book-detail" element={<BookDetail />} />
              <Route
                path="/new-book"
                element={
                  <ProtectedRoute>
                    <NewBookForm onAddBook={handleAddBook} />
                  </ProtectedRoute>
                }
              />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/pick-my-shelf" element={<PickMyShelf />} />
              <Route path="/login" element={<Login />} />
            </Routes>
          </div>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
};

export default App;
