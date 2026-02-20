import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ReactKeycloakProvider } from "@react-keycloak/web";
import keycloak from "./services/keycloak";

// 1. IMPORTANTE: Agrega estas importaciones de Material UI
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00b4d8', // Celeste brillante para botones e íconos
      dark: '#0284c7', // Azul más fuerte para el "hover" de los botones
    },
    background: {
      default: '#0b1120', // Azul marino muy oscuro (casi negro) para el fondo general
      paper: '#1e293b',   // Azul grisáceo oscuro para las tablas, tarjetas y menú
    },
    text: {
      primary: '#f1f5f9', // Blanco roto para que no canse la vista
      secondary: '#94a3b8', // Gris azulado para textos secundarios
    }
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
