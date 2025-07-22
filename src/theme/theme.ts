import { createTheme } from '@mui/material/styles';

// Create a theme instance
const theme = createTheme({
  palette: {
    primary: {
      main: '#4CAF50', // Green from original navbar
      light: '#81c784',
      dark: '#388e3c',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#007bff', // Blue from original buttons
      light: '#4dabf5',
      dark: '#0069c0',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f4f4f4',
      paper: '#ffffff',
    },
    text: {
      primary: '#333333',
      secondary: '#555555',
    },
  },
  typography: {
    fontFamily: "'Arial', 'Helvetica', sans-serif",
    h1: {
      fontWeight: 500,
    },
    h2: {
      fontWeight: 500,
    },
    h3: {
      fontWeight: 500,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          transition: 'transform 0.2s',
          '&:hover': {
            transform: 'scale(1.05)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 5,
          textTransform: 'none',
        },
      },
    },
  },
});

export default theme;