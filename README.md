# React Library App

Welcome to the React Library App! This application allows users to manage a collection of books, including viewing a bookshelf, adding new books, and maintaining a wishlist of books not yet in the collection.

## Features

- **Bookshelf**: Displays all books in the collection with their cover images, titles, and authors. Now with pagination for easier browsing of large collections.
- **Book Search**: Search for books through the OpenLibrary API and view detailed information in a modal window.
- **Book Details**: View comprehensive book information including cover, description, genres, and publishers.
- **Edit Book Details**: Edit book information for books in your collection, including title, author, ISBN, description, and more.
- **Enter New Book**: A form to add new books to the collection by entering the title, author, and ISBN.
- **Wishlist**: Similar to the bookshelf, but displays books that are not currently in the collection.
- **Home Page**: A welcoming page with a title and a centered image.

## Project Structure

```
react-library-app
├── public
│   ├── index.html
│   └── favicon.ico
├── src
│   ├── components
│   │   ├── Navbar.tsx
│   │   ├── Bookshelf.tsx
│   │   ├── BookDetail.tsx
│   │   ├── NewBookForm.tsx
│   │   ├── Wishlist.tsx
│   │   └── Home.tsx
│   ├── styles
│   │   ├── App.css
│   │   ├── Navbar.css
│   │   ├── Bookshelf.css
│   │   ├── NewBookForm.css
│   │   └── Wishlist.css
│   ├── theme
│   │   ├── index.ts
│   │   └── theme.ts
│   ├── App.tsx
│   ├── index.tsx
│   └── data
│       └── books.json
├── package.json
├── tsconfig.json
├── README.md
└── .gitignore
```

## Getting Started

1. Clone the repository:

   ```
   git clone https://github.com/yourusername/react-library-app.git
   ```

2. Navigate to the project directory:

   ```
   cd react-library-app
   ```

3. Install the dependencies:

   ```
   npm install
   ```

4. Start the development server:

   ```
   npm start
   ```

5. Open your browser and go to `http://localhost:3000` to view the application.

6. Make sure the backend API is running at `http://localhost:5089` for full functionality.

## Integration with Backend API

This React app integrates with the OurLibraryApp backend API for the following features:

- Retrieving the book collection for the bookshelf view
- Searching for books through the Open Library integration
- Adding new books to the collection
- Maintaining the wishlist
- Fetching book cover images
- Viewing detailed book information

The API URL is configured in the component files and defaults to `http://localhost:5089`.

## UI Features

### Pagination

Both the bookshelf view and search results include pagination for better navigation of large collections.

### Modal Dialogs

Book details are displayed in a modal dialog, allowing users to:

- View comprehensive book information without losing their place in search results
- See cover images, descriptions, and metadata
- Add books to their collection or wishlist directly from the modal

### Responsive Design

The application is fully responsive, with optimized layouts for:

- Mobile devices
- Tablets
- Desktop computers

## Technologies Used

- React with TypeScript
- Material UI for component styling and layout
- React Router for navigation
- API integration with OpenLibrary and our backend API
- Pagination for large data sets
- Modal dialogs for detailed views

## Contributing

Feel free to submit issues or pull requests if you have suggestions or improvements for the project.

## License

This project is open-source and available under the MIT License.
