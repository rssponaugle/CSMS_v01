import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    body1: {
      fontWeight: 550,
    },
    h6: {
      fontWeight: 600,
      color: '#0066cc',
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#d3d3d3',
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          '&:hover': {
            transform: 'scale(1.25)',
            transition: 'transform 0.2s',
          },
        },
      },
    },
  },
  palette: {
    primary: {
      main: '#0066cc',
    },
    secondary: {
      main: '#666666',
    },
    background: {
      default: '#f5f5f5',
    },
  },
});
