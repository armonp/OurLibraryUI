import { Book } from "./Book";

// Thrown by the add-book API call when the backend responds 409 Conflict
// because a book with the same ISBN is already in the library.
export class DuplicateBookError extends Error {
  existingBook: Book | null;

  constructor(existingBook: Book | null) {
    super("This book already exists in your library.");
    this.name = "DuplicateBookError";
    this.existingBook = existingBook;
  }
}
