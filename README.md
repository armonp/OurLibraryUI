# React Library App

Welcome to the React Library App! This application allows users to manage a collection of books, including viewing a bookshelf, adding new books, and maintaining a wishlist of books not yet in the collection.

## Features

- **Bookshelf**: Displays all books in the collection with their cover images, titles, and authors.
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
│   │   ├── Navbar.jsx
│   │   ├── Bookshelf.jsx
│   │   ├── NewBookForm.jsx
│   │   ├── Wishlist.jsx
│   │   └── Home.jsx
│   ├── styles
│   │   ├── App.css
│   │   ├── Navbar.css
│   │   ├── Bookshelf.css
│   │   ├── NewBookForm.css
│   │   └── Wishlist.css
│   ├── App.jsx
│   ├── index.js
│   └── data
│       └── books.json
├── package.json
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

## Technologies Used

- React
- CSS for styling
- JSON for book data

## Contributing

Feel free to submit issues or pull requests if you have suggestions or improvements for the project.

## License

This project is open-source and available under the MIT License.