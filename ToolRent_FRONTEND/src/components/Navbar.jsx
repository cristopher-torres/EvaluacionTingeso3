import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { useKeycloak } from "@react-keycloak/web";
import { useNavigate } from 'react-router-dom';
import logo from "../assets/ToolRent_Logo.webp";
import Sidemenu from "./Sidemenu";
import { useState } from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Avatar from '@mui/material/Avatar';

function DesktopAppBar() {
  const { keycloak } = useKeycloak();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const toggleDrawer = (newOpen) => (event) => {
    setOpen(newOpen);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    keycloak.logout();
    setAnchorEl(null);
  };

  const username = keycloak.tokenParsed?.preferred_username;

  return (
    <>
      <AppBar
        position="static"
        elevation={0}
        sx={{
          // slate-900
          backgroundColor: '#1e293b',  // slate-800 
          width: "100%",
          // Borde inferior sutil: gris azulado con baja opacidad 
          borderBottom: '1px solid rgba(56, 189, 248, 0.25)',  // acento celeste sutil
          // Sombra neutra hacia abajo, sin color
          boxShadow: '0 4px 24px rgba(0, 0, 0, 0.6)',  // sombra más pronunciada
        }}
      >
        <Container maxWidth={false} disableGutters sx={{ px: 0 }}>
          <Toolbar disableGutters sx={{ px: 0, pl: 2, pr: 2 }}>

            {/* Botón hamburguesa */}
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{
                mr: 2,
                color: '#94a3b8', 
                '&:hover': {
                  color: '#38bdf8',                        
                  backgroundColor: 'rgba(56,189,248,0.07)',
                }
              }}
              onClick={toggleDrawer(true)}
            >
              <MenuIcon />
            </IconButton>

            {/* Logo + nombre */}
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="/"
              sx={{
                mr: 4,
                display: 'flex',
                alignItems: 'center',
                color: '#e2e8f0',  
                textDecoration: 'none',
                fontWeight: 700,
                letterSpacing: '-0.01em',
              }}
            >
              <img
                src={logo}
                alt="ToolRent Logo"
                width="60"      
                height="60"     
                style={{ height: 60, marginRight: 5 }}
              />
              {/* "Tool" en celeste suave */}
              <span style={{ color: '#38bdf8' }}>Tool</span>Rent
            </Typography>

            {/* Acciones a la derecha */}
            <div style={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end', marginRight: '60px', alignItems: 'center', gap: '8px' }}>

              {/* Botón Inventario */}
              <Button
                onClick={() => {
                  if (!keycloak.authenticated) {
                    alert("Debes iniciar sesión para acceder al inventario.");
                    return;
                  }
                  const hasRole = keycloak.hasRealmRole("ADMIN") || keycloak.hasRealmRole("EMPLOYEE");
                  if (!hasRole) {
                    alert("No tienes permisos para acceder al inventario.");
                    return;
                  }
                  navigate("/inventario");
                }}
                sx={{
                  my: 2,
                  borderRadius: 1.5,
                  textTransform: 'none',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  // Fondo muy sutil, borde discreto
                  backgroundColor: 'rgba(56, 189, 248, 0.07)',
                  border: '1px solid rgba(56, 189, 248, 0.2)',
                  color: '#7dd3fc',  
                  '&:hover': {
                    backgroundColor: 'rgba(56, 189, 248, 0.14)',
                    border: '1px solid rgba(56, 189, 248, 0.4)',
                    color: '#e2e8f0',  
                  }
                }}
              >
                Inventario
              </Button>

              {/* Avatar / Login */}
              {keycloak.authenticated ? (
                <IconButton
                  onClick={handleMenuOpen}
                  sx={{
                    my: 2,
                    borderRadius: '50%',
                    width: 38,
                    height: 38,
                    backgroundColor: 'rgba(56, 189, 248, 0.08)',
                    border: '1px solid rgba(56, 189, 248, 0.2)',
                    '&:hover': {
                      backgroundColor: 'rgba(56, 189, 248, 0.15)',
                      border: '1px solid rgba(56, 189, 248, 0.4)',
                    },
                  }}
                >
                  <Avatar
                    alt={username}
                    src="https://www.example.com/profile.jpg"
                    sx={{ width: 30, height: 30, fontSize: '0.85rem' }}
                  />
                </IconButton>
              ) : (
                <Button
                  onClick={() => keycloak.login()}
                  sx={{
                    my: 2,
                    borderRadius: 1.5,
                    textTransform: 'none',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    backgroundColor: 'rgba(56, 189, 248, 0.07)',
                    border: '1px solid rgba(56, 189, 248, 0.2)',
                    color: '#7dd3fc',
                    '&:hover': {
                      backgroundColor: 'rgba(56, 189, 248, 0.14)',
                      border: '1px solid rgba(56, 189, 248, 0.4)',
                      color: '#e2e8f0',
                    }
                  }}
                >
                  Iniciar sesión
                </Button>
              )}
            </div>
          </Toolbar>
        </Container>
      </AppBar>

      <Sidemenu open={open} toggleDrawer={toggleDrawer} />

      {/* Dropdown del usuario */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        sx={{
          '& .MuiMenu-paper': {
            backgroundColor: '#1e293b',
            color: '#e2e8f0',
            border: '1px solid rgba(148, 163, 184, 0.15)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
            minWidth: 160,
          },
        }}
      >
        <MenuItem
          disabled
          sx={{
            color: '#94a3b8',  
            opacity: '1 !important',
            fontSize: '0.8rem',
            fontWeight: 600,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            borderBottom: '1px solid rgba(148,163,184,0.1)',
            pb: 1,
          }}
        >
          {username}
        </MenuItem>
        <MenuItem
          onClick={handleLogout}
          sx={{
            fontSize: '0.875rem',
            color: '#e2e8f0',
            mt: 0.5,
            '&:hover': {
              color: '#38bdf8',
              backgroundColor: 'rgba(56, 189, 248, 0.07)',
            }
          }}
        >
          Cerrar sesión
        </MenuItem>
      </Menu>
    </>
  );
}

export default DesktopAppBar;