import { createTheme } from '@mui/material/styles';

// "Clean & Bold" theme: a single confident accent, warm neutrals, generous
// whitespace, big rounded cards, and elevation used only on hover/interaction.
const theme = createTheme({
  palette: {
    primary: {
      main: '#0F9B8E', // teal
      light: '#4DBDB0',
      dark: '#0B6F65',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#FF6B4A', // coral, used sparingly for accents/highlights
      light: '#FF9478',
      dark: '#E14F30',
      contrastText: '#ffffff',
    },
    error: {
      main: '#E5484D',
      light: '#FF8086',
      dark: '#B8262B',
    },
    warning: {
      main: '#F2A93B',
      light: '#F7C978',
      dark: '#C9820F',
    },
    info: {
      main: '#5FA8D3',
      light: '#93C6E4',
      dark: '#3E80AA',
    },
    success: {
      main: '#6BA368',
      light: '#98C395',
      dark: '#4C7C49',
    },
    background: {
      default: '#FBF8F3', // warm cream
      paper: '#ffffff',
    },
    text: {
      primary: '#2A2622',
      secondary: '#6E655C',
    },
    divider: '#EDE7DD',
  },
  typography: {
    fontFamily: "'Plus Jakarta Sans', ui-sans-serif, system-ui, -apple-system, sans-serif",
    h1: { fontWeight: 800, letterSpacing: '-0.02em' },
    h2: { fontWeight: 800, letterSpacing: '-0.02em' },
    h3: { fontWeight: 800, letterSpacing: '-0.01em' },
    h4: { fontWeight: 800, letterSpacing: '-0.01em' },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 700 },
    button: {
      fontWeight: 700,
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#FBF8F3',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          borderRadius: 20,
          border: '1px solid #EDE7DD',
          boxShadow: '0 1px 2px rgba(40,30,10,0.04)',
        },
        elevation3: {
          boxShadow: '0 1px 2px rgba(40,30,10,0.05), 0 12px 32px rgba(40,30,10,0.08)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          border: '1px solid #EDE7DD',
          overflow: 'hidden',
          boxShadow: '0 1px 2px rgba(40,30,10,0.04)',
          transition: 'transform 0.18s ease, box-shadow 0.18s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 1px 2px rgba(40,30,10,0.05), 0 16px 32px rgba(40,30,10,0.10)',
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
          borderRadius: 14,
          textTransform: 'none',
          padding: '10px 20px',
          fontWeight: 700,
          boxShadow: 'none',
          transition: 'background-color 0.15s ease, border-color 0.15s ease, transform 0.1s ease',
          '&:hover': {
            boxShadow: 'none',
          },
          '&:active': {
            transform: 'translateY(1px)',
          },
        },
        containedPrimary: {
          '&:hover': {
            backgroundColor: '#0B6F65',
          },
        },
        containedSecondary: {
          '&:hover': {
            backgroundColor: '#E14F30',
          },
        },
        outlined: {
          borderWidth: 1.5,
          '&:hover': {
            borderWidth: 1.5,
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          fontWeight: 700,
          boxShadow: 'none',
        },
      },
    },
    MuiButtonGroup: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          borderRadius: 14,
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          paddingTop: 24,
          paddingBottom: 24,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#ffffff',
          color: '#2A2622',
          borderBottom: '1px solid #EDE7DD',
          boxShadow: 'none',
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        h4: {
          fontWeight: 800,
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundColor: '#ffffff',
        },
        notchedOutline: {
          borderColor: '#EDE7DD',
        },
      },
    },
  },
});

export default theme;
