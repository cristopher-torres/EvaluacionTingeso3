import { useKeycloak } from "@react-keycloak/web";
import { useState, useEffect } from "react";
import { Box, Typography, Container, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import toolService from "../services/tool.service";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { keycloak } = useKeycloak();
  const [toolsStock, setToolsStock] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    toolService.getStock()
      .then((response) => setToolsStock(response.data))
      .catch((error) => console.error("Error al cargar stock", error));
  }, []);

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column", bgcolor: 'background.default' }}>
      <Box sx={{ flexGrow: 1 }}>
        <Container maxWidth="lg" sx={{ mt: 8, mb: 8 }}>
          
          {/* Tarjeta Central */}
          <Box
            sx={{
              textAlign: "center",
              py: 6,
              // Degradado morado estilo "Synthwave" extraído de la imagen
              background: "linear-gradient(135deg, #2b0f54 0%, #100524 100%)",
              borderRadius: 4,
              mb: 6,
              boxShadow: "0 8px 32px rgba(232, 28, 255, 0.15)", // Sombra con un toque magenta
              border: "1px solid rgba(232, 28, 255, 0.3)" // Borde magenta sutil
            }}
          >
            <Typography variant="h3" sx={{ fontWeight: "bold", color: "#00d2ff", mb: 2 }}>
              ToolRent: Sistema de Gestión
            </Typography>
            <Typography variant="h6" sx={{ color: "#b392f0", mb: 4 }}>
              Herramientas de construcción y reparación.
            </Typography>

            <Button
              variant="contained"
              size="large"
              sx={{
                backgroundColor: "primary.main", // Cian
                fontSize: "1.1rem", 
                py: 1.5, 
                px: 4, 
                borderRadius: 3,
                color: "#100524", 
                fontWeight: "bold", // Texto oscuro sobre el botón cian brillante
                boxShadow: "0 4px 15px rgba(0, 210, 255, 0.4)",
                "&:hover": { backgroundColor: "primary.dark", color: "white" },
              }}
              onClick={() => keycloak.authenticated ? navigate("/prestamos") : keycloak.login()}
            >
              {keycloak.authenticated ? "Registrar Préstamos" : "Iniciar sesión"}
            </Button>
          </Box>

          {/* Tabla de Stock con colores Cyberpunk */}
          <TableContainer 
            component={Paper} 
            sx={{ 
              bgcolor: '#1d0b3b', // Fondo morado oscuro
              borderRadius: 2, 
              overflow: 'hidden', 
              border: "1px solid rgba(0, 210, 255, 0.3)", // Borde de la tabla en Cian
              boxShadow: "0 4px 20px rgba(0, 210, 255, 0.1)"
            }}
          >
            <Table>
              <TableHead sx={{ backgroundColor: 'rgba(0, 210, 255, 0.1)' }}> {/* Cabecera de tabla con fondo cian tenue */}
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', color: '#00d2ff' }}>Nombre</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: '#00d2ff' }}>Categoría</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: '#00d2ff' }}>Disponible</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: '#00d2ff' }}>Prestada</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: '#00d2ff' }}>En Reparación</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: '#00d2ff' }}>Dada de Baja</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {toolsStock.map((tool) => (
                  <TableRow 
                    key={tool.name} 
                    sx={{ 
                      '&:last-child td, &:last-child th': { border: 0 }, 
                      '&:hover': { backgroundColor: 'rgba(232, 28, 255, 0.1)' }, // Hover en Magenta tenue
                      // Color de las letras de las filas (blanco o lila claro)
                      '& td': { color: '#f1f5f9', borderBottom: '1px solid rgba(255,255,255,0.05)' } 
                    }}
                  >
                    <TableCell>{tool.name}</TableCell>
                    <TableCell>{tool.category}</TableCell>
                    <TableCell>{tool.disponible}</TableCell>
                    <TableCell>{tool.prestada}</TableCell>
                    <TableCell>{tool.enReparacion}</TableCell>
                    <TableCell>{tool.dadaDeBaja}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Container>
      </Box>

      {/* Footer minimalista en el morado más oscuro */}
      <Box sx={{ 
        borderTop: "1px solid rgba(232, 28, 255, 0.2)", // Borde superior magenta
        mt: 4, 
        pt: 3, 
        pb: 3, 
        textAlign: "center", 
        backgroundColor: "#100524", // Fondo morado muy oscuro
        color: "white" 
      }}>
        <Typography variant="h6" sx={{ mb: 1, fontWeight: "bold", color: "#e81cff" }}>
          ToolRent
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.6, color: "#b392f0" }}>
          © 2025 ToolRent. Todos los derechos reservados.
        </Typography>
      </Box>
    </Box>
  );
};

export default Home;
