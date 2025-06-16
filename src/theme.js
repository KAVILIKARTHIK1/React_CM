import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1A73E8',
    },
    secondary: {
      main: '#E91E63',
    },
    background: {
      default: '#f4f6f8',
    },
  },
  typography: {
    fontFamily: 'Poppins, sans-serif',
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
      marginBottom: '1rem',
    },
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          backgroundColor: '#fff',
          borderRadius: 8,
        },
      },
    },
    MuiTable: {
      styleOverrides: {
        root: {
          backgroundColor: '#fff',
          borderRadius: 10,
          boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          backgroundColor: '#1A73E8',
          color: '#fff',
          fontWeight: 600,
          fontSize: '0.95rem',
        },
        body: {
          fontSize: '0.9rem',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
        },
      },
    },
  },
});

export default theme;
