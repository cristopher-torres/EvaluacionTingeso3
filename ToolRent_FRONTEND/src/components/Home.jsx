import { useKeycloak } from "@react-keycloak/web";
import { useState, useEffect } from "react";
import {
  Box, Typography, Container, Button,
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Chip
} from "@mui/material";
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
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        // Fondo base: slate-900, más cálido y profundo que negro puro
        bgcolor: '#0f172a',
      }}
    >
      <Box sx={{ flexGrow: 1 }}>
        <Container maxWidth="lg" sx={{ mt: 8, mb: 8 }}>

          {/* ── Tarjeta Central ── */}
          <Box
            sx={{
              textAlign: "center",
              py: 7,
              px: 4,
              // Degradado oscuro slate puro
              background: "linear-gradient(160deg, #1e293b 0%, #0f172a 100%)",
              borderRadius: 3,
              mb: 5,
              // Sombra hacia abajo con azul muy oscuro
              boxShadow: "0 8px 40px rgba(0, 0, 0, 0.5)",
              // Borde celeste muy sutil, casi imperceptible
              border: "1px solid rgba(56, 189, 248, 0.15)",
              // Línea de acento en la parte superior (como un "header" de tarjeta)
              borderTop: "3px solid rgba(56, 189, 248, 0.4)",
            }}
          >
            {/* Etiqueta pequeña sobre el título */}
            <Typography
              variant="overline"
              sx={{
                color: '#38bdf8',
                letterSpacing: '0.12em',
                fontSize: '0.7rem',
                fontWeight: 600,
                mb: 1.5,
                display: 'block',
                opacity: 0.8,
              }}
            >
              Sistema de Gestión
            </Typography>

            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                // Gradiente de texto en celeste 
                background: 'linear-gradient(90deg, #7dd3fc 0%, #38bdf8 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 1.5,
              }}
            >
              ToolRent
            </Typography>

            <Typography
              variant="h6"
              sx={{
                // Gris azulado
                color: "#94a3b8",
                mb: 4,
                fontWeight: 400,
                maxWidth: 420,
                mx: 'auto',
                lineHeight: 1.6,
              }}
            >
              Herramientas de construcción y reparación.
            </Typography>

            <Button
              variant="contained"
              size="large"
              sx={{
                // Sky-500 como fondo 
                backgroundColor: "#0ea5e9",
                fontSize: "0.95rem",
                py: 1.5,
                px: 5,
                borderRadius: 2,
                color: "#0f172a",   // texto oscuro sobre fondo claro
                fontWeight: 700,
                letterSpacing: '0.03em',
                // Sombra del botón
                boxShadow: "0 4px 16px rgba(14, 165, 233, 0.25)",
                textTransform: 'none',
                "&:hover": {
                  backgroundColor: "#38bdf8",
                  boxShadow: "0 4px 20px rgba(56, 189, 248, 0.35)",
                  color: "#0f172a",
                },
              }}
              onClick={() =>
                keycloak.authenticated
                  ? navigate("/prestamos")
                  : keycloak.login()
              }
            >
              {keycloak.authenticated ? "Registrar Préstamos" : "Iniciar sesión"}
            </Button>
          </Box>

          {/* ── Encabezado de la tabla ── */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1.5 }}>
            <Typography
              variant="h6"
              sx={{
                color: '#e2e8f0',
                fontWeight: 600,
                fontSize: '1rem',
              }}
            >
              Stock de herramientas
            </Typography>
            <Chip
              label={`${toolsStock.length} ítems`}
              size="small"
              sx={{
                backgroundColor: 'rgba(56,189,248,0.1)',
                color: '#7dd3fc',
                border: '1px solid rgba(56,189,248,0.2)',
                fontSize: '0.7rem',
                height: 22,
              }}
            />
          </Box>

          {/* ── Tabla ── */}
          <TableContainer
            component={Paper}
            sx={{
              // slate-800 
              bgcolor: '#1e293b',
              borderRadius: 2,
              overflow: 'hidden',
              // Borde gris azulado 
              border: "1px solid rgba(148, 163, 184, 0.1)",
              boxShadow: "0 4px 24px rgba(0, 0, 0, 0.35)",
            }}
          >
            <Table>
              <TableHead sx={{ backgroundColor: 'rgba(15, 23, 42, 0.8)' }}>
                <TableRow>
                  {['Nombre', 'Categoría', 'Disponible', 'Prestada', 'En Reparación', 'Dada de Baja'].map((col) => (
                    <TableCell
                      key={col}
                      sx={{
                        fontWeight: 600,
                        // sky-300
                        color: '#7dd3fc',
                        fontSize: '0.8rem',
                        letterSpacing: '0.04em',
                        textTransform: 'uppercase',
                        py: 1.5,
                        borderBottom: '1px solid rgba(148, 163, 184, 0.12)',
                      }}
                    >
                      {col}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {toolsStock.map((tool, index) => (
                  <TableRow
                    key={tool.name}
                    sx={{
                      backgroundColor: index % 2 === 0
                        ? 'transparent'
                        : 'rgba(255, 255, 255, 0.02)',
                      '&:last-child td, &:last-child th': { border: 0 },
                      // Hover en azul muy tenue 
                      '&:hover': {
                        backgroundColor: 'rgba(56, 189, 248, 0.06)',
                      },
                      '& td': {
                        // slate-200
                        color: '#cbd5e1',
                        fontSize: '0.875rem',
                        borderBottom: '1px solid rgba(148, 163, 184, 0.07)',
                      },
                      transition: 'background-color 0.15s ease',
                    }}
                  >
                    <TableCell sx={{ color: '#e2e8f0 !important', fontWeight: 500 }}>
                      {tool.name}
                    </TableCell>
                    <TableCell>{tool.category}</TableCell>
                    <TableCell>
                      <Chip
                        label={tool.disponible}
                        size="small"
                        sx={{
                          backgroundColor: tool.disponible > 0
                            ? 'rgba(34, 197, 94, 0.12)'
                            : 'rgba(148, 163, 184, 0.08)',
                          color: tool.disponible > 0 ? '#4ade80' : '#64748b',
                          border: `1px solid ${tool.disponible > 0 ? 'rgba(74,222,128,0.25)' : 'rgba(148,163,184,0.15)'}`,
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          height: 22,
                          minWidth: 32,
                        }}
                      />
                    </TableCell>
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

      {/* ── Footer ── */}
      <Box
        sx={{
          borderTop: "1px solid rgba(148, 163, 184, 0.1)",  // gris suave
          mt: 4,
          pt: 3,
          pb: 3,
          textAlign: "center",
          backgroundColor: "#0b1120",  // ligeramente más oscuro que el fondo
          color: "white"
        }}
      >
        <Typography
          variant="subtitle2"
          sx={{
            mb: 0.5,
            fontWeight: 700,
            // Celeste suave
            color: "#38bdf8",
            letterSpacing: '0.05em',
          }}
        >
          ToolRent
        </Typography>
        <Typography
          variant="body2"
          sx={{ opacity: 0.4, color: "#94a3b8", fontSize: '0.75rem' }}
        >
          © 2025 ToolRent. Todos los derechos reservados.
        </Typography>
      </Box>
    </Box>
  );
};

export default Home;
