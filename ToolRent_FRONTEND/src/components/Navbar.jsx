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
import logo from "../assets/ToolRent_Logo.png";
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
          backgroundColor: '#1d0b3b', // Morado oscuro de la ventana de código
          width: "100%",
          borderBottom: '2px solid #e81cff', // Borde inferior Magenta neón
          boxShadow: '0 4px 20px rgba(232, 28, 255, 0.15)' // Resplandor magenta
        }}
      >
        <Container maxWidth={false} disableGutters sx={{ px: 0 }}>
          <Toolbar disableGutters sx={{ px: 0, pl: 2, pr: 2 }}>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ 
                mr: 2,
                '&:hover': { color: '#00d2ff' } // Hover en Cian
              }}
              onClick={toggleDrawer(true)} 
            >
              <MenuIcon />
            </IconButton>

            <Typography
              variant="h6"
              noWrap
              component="a"
              href="/"
              sx={{
                mr: 4,
                display: 'flex',
                alignItems: 'center',
                color: '#ffffff',
                textDecoration: 'none',
                fontWeight: 'bold'
              }}
            >
              <img
                src={logo}
                alt="ToolRent Logo"
                style={{ height: 60, marginRight: 5 }}
              />
              <span style={{ color: '#00d2ff' }}>Tool</span>Rent {/* "Tool" en Cian */}
            </Typography>

            <div style={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end', marginRight: '60px' }}>
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
                  marginLeft: 2,
                  borderRadius: 1,
                  textTransform: 'none',
                  backgroundColor: 'rgba(0, 210, 255, 0.1)', // Fondo cian semitransparente
                  border: '1px solid rgba(0, 210, 255, 0.3)', // Borde cian
                  color: '#00d2ff', // Letra cian
                  '&:hover': {
                    backgroundColor: '#00d2ff', 
                    color: '#100524', // Letra oscura al pasar el mouse
                    fontWeight: 'bold',
                    border: '1px solid #00d2ff'
                  }
                }}
              >
                Inventario
              </Button>

              {keycloak.authenticated ? (
                <IconButton
                  onClick={handleMenuOpen}
                  sx={{
                    my: 2, 
                    marginLeft: 2,
                    borderRadius: '50%',
                    width: 40,
                    height: 40,
                    backgroundColor: 'rgba(0, 210, 255, 0.1)', 
                    border: '1px solid rgba(0, 210, 255, 0.3)',
                    display: 'flex', 
                    alignItems: 'center',
                    justifyContent: 'center',
                    '&:hover': {
                      backgroundColor: '#00d2ff',
                      color: '#100524',
                    },
                  }}
                >
                  <Avatar alt={username} src="https://www.example.com/profile.jpg" />
                </IconButton>
              ) : (
                <Button
                  onClick={() => keycloak.login()}
                  sx={{
                    my: 2,
                    marginLeft: 2,
                    borderRadius: 1,
                    textTransform: 'none',
                    backgroundColor: 'rgba(0, 210, 255, 0.1)',
                    border: '1px solid rgba(0, 210, 255, 0.3)',
                    color: '#00d2ff',
                    '&:hover': {
                      backgroundColor: '#00d2ff',
                      color: '#100524',
                      fontWeight: 'bold',
                      border: '1px solid #00d2ff'
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

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        sx={{
          '& .MuiMenu-paper': {
            backgroundColor: '#1d0b3b', // Morado oscuro
            color: 'white',
            border: '1px solid #e81cff' // Borde magenta en el menú desplegable
          },
        }}
      >
        <MenuItem disabled sx={{ color: '#b392f0', opacity: 1 }}>{username}</MenuItem>
        <MenuItem onClick={handleLogout} sx={{ '&:hover': { color: '#00d2ff', backgroundColor: 'rgba(0,210,255,0.1)' } }}>Cerrar sesión</MenuItem>
      </Menu>
    </>
  );
}

export default DesktopAppBar;

