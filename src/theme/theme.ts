import { createTheme } from '@mui/material/styles';

// Create a theme instance with enhanced styling for a child's book collection
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
    error: {
      main: '#ff5252', // Brighter red that's more kid-friendly
      light: '#ff867f',
      dark: '#c50e29',
    },
    warning: {
      main: '#FFB100', // Bright orange for warnings
      light: '#FFD54F',
      dark: '#FF8F00',
    },
    info: {
      main: '#00BCD4', // Teal color for information
      light: '#80DEEA',
      dark: '#0097A7',
    },
    success: {
      main: '#66BB6A', // Slightly brighter green for success
      light: '#A5D6A7',
      dark: '#388E3C',
    },
    background: {
      default: '#f9f7f2', // Soft cream background like a book page
      paper: '#ffffff',
    },
    text: {
      primary: '#333333',
      secondary: '#555555',
    },
  },
  typography: {
    fontFamily: "'Nunito', 'Arial', 'Helvetica', sans-serif",
    h1: {
      fontWeight: 700,
      letterSpacing: '-0.5px',
    },
    h2: {
      fontWeight: 700,
      letterSpacing: '-0.5px',
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
      letterSpacing: '0.25px',
    },
    h6: {
      fontWeight: 600,
    },
    button: {
      fontWeight: 600,
      letterSpacing: '0.5px',
    },
  },
  shape: {
    borderRadius: 12, // Rounded corners for a playful look
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'linear-gradient(to bottom right, rgba(255,255,255,0.7), rgba(255,255,255,0.3))',
          borderRadius: 16,
          border: '1px solid rgba(255,255,255,0.18)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        },
        elevation3: {
          boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
          border: '1px solid rgba(0, 0, 0, 0.05)',
          overflow: 'hidden',
          boxShadow: '0 6px 16px rgba(0, 0, 0, 0.1)',
          '&:hover': {
            transform: 'translateY(-8px) scale(1.02)',
            boxShadow: '0 12px 28px rgba(0, 0, 0, 0.15)',
          },
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          '&:last-child': {
            paddingBottom: 16,
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          textTransform: 'none',
          padding: '8px 16px',
          fontWeight: 600,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 6px 10px rgba(0, 0, 0, 0.15)',
          },
          '&:active': {
            transform: 'translateY(1px)',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          },
        },
        containedPrimary: {
          background: 'linear-gradient(45deg, #56ab2f 0%, #45a247 100%)',
        },
        containedSecondary: {
          background: 'linear-gradient(45deg, #2196f3 0%, #0d8aee 100%)',
        },
        outlined: {
          borderWidth: 2,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.06)',
        },
        colorSuccess: {
          background: 'linear-gradient(45deg, #56ab2f 0%, #45a247 100%)',
        },
        colorPrimary: {
          background: 'linear-gradient(45deg, #2196f3 0%, #0d8aee 100%)',
        },
      },
    },
    MuiButtonGroup: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          borderRadius: 10,
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          paddingTop: 16,
          paddingBottom: 16,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: 'linear-gradient(to right, #56ab2f, #45a247)',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        h4: {
          fontWeight: 'bold',
          textShadow: '0px 1px 1px rgba(0,0,0,0.1)',
        },
      },
    },
  },
});

export default theme;