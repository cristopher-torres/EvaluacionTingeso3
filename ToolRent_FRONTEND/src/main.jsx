import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ReactKeycloakProvider } from "@react-keycloak/web";
import keycloak from "./services/keycloak";

import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#38bdf8',       // sky-400: celeste suave
      dark: '#0284c7',       // sky-600: hover de botones
      light: '#7dd3fc',      // sky-300: texto de enlaces y etiquetas
    },
    secondary: {
      main: '#818cf8',       // indigo-400:
      dark: '#6366f1',
    },
    background: {
      default: '#0f172a',    // slate-900: azul marino profundo
      paper: '#1e293b',      // slate-800: superficies elevadas (tablas, tarjetas, menú)
    },
    text: {
      primary: '#e2e8f0',    // slate-200: blanco 
      secondary: '#94a3b8',  // slate-400: texto de apoyo y subtítulos
      disabled: '#475569',   // slate-600
    },
    divider: 'rgba(148, 163, 184, 0.12)', // slate con baja opacidad
    action: {
      hover: 'rgba(56, 189, 248, 0.06)',
      selected: 'rgba(56, 189, 248, 0.10)',
    },
  },
  typography: {
    fontFamily: '"IBM Plex Sans", "Segoe UI", sans-serif',
    h3: {
      fontWeight: 700,
      letterSpacing: '-0.02em',
      lineHeight: 1.2,
    },
    h6: {
      fontWeight: 500,
      lineHeight: 1.5,
    },
    body1: {
      lineHeight: 1.75,
    },
    body2: {
      lineHeight: 1.65,
    },
    button: {
      fontWeight: 600,
      letterSpacing: '0.02em',
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid rgba(148, 163, 184, 0.08)',
          padding: '14px 16px',
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          transition: 'background-color 0.15s ease',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          transition: 'all 0.2s ease',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none', 
        },
      },
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <ReactKeycloakProvider authClient={keycloak}>
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </ReactKeycloakProvider>
)