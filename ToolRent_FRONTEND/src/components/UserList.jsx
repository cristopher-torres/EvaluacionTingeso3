import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllClients } from "../services/user.service";
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Paper, Button, Box, Typography, Backdrop, CircularProgress, Tooltip, Chip 
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import PageHelp from "../components/PageHelp";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    getAllClients()
      .then((res) => setUsers(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const skyButtonStyle = {
    backgroundColor: "rgba(56, 189, 248, 0.07)",
    border: "1px solid rgba(56, 189, 248, 0.2)",
    color: "#7dd3fc",
    textTransform: "none",
    fontWeight: 600,
    "&:hover": { 
      backgroundColor: "rgba(56, 189, 248, 0.14)", 
      color: "#e2e8f0",
      border: "1px solid rgba(56, 189, 248, 0.4)"
    }
  };

  const tableHeaders = [
    { label: "ID", tooltip: "Identificador interno del usuario" },
    { label: "Rut", tooltip: "Documento de Identidad" },
    { label: "Username", tooltip: "Nombre de usuario en la plataforma" },
    { label: "Nombre", tooltip: "Nombres del usuario" },
    { label: "Apellido", tooltip: "Apellidos del usuario" },
    { label: "Email", tooltip: "Correo electrónico de contacto" },
    { label: "Teléfono", tooltip: "Teléfono móvil registrado" },
    { label: "Estado", tooltip: "Situación actual de la cuenta" },
    { label: "Acciones", tooltip: "Gestión de datos de usuario" }
  ];

  return (
    <Box sx={{ p: 3, bgcolor: '#0f172a', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      <Backdrop
        sx={{ color: '#38bdf8', zIndex: 1201, backgroundColor: 'rgba(15, 23, 42, 0.9)' }}
        open={loading}
      >
        <CircularProgress color="inherit" />
        <Typography variant="h6" sx={{ mt: 2, color: '#38bdf8' }}>Cargando directorio...</Typography>
      </Backdrop>

      <Box display="flex" alignItems="center" gap={1} mb={4}>
        <Typography variant="h4" sx={{ color: "#e2e8f0", fontWeight: 700 }}>
          Directorio de Usuarios
        </Typography>
        <PageHelp 
          title="Gestión de Clientes" 
          steps={[
            "Visualice la lista completa de clientes registrados.",
            "Verifique el estado de habilitación de cada cuenta.",
            "Utilice el botón de edición para actualizar información de contacto."
          ]} 
        />
      </Box>

      <TableContainer 
        component={Paper} 
        sx={{ 
          bgcolor: '#1e293b', 
          borderRadius: 2, 
          border: "1px solid rgba(148, 163, 184, 0.1)", 
          boxShadow: "0 4px 24px rgba(0, 0, 0, 0.35)",
          borderTop: "3px solid rgba(56, 189, 248, 0.4)"
        }}
      >
        <Table>
          <TableHead sx={{ backgroundColor: 'rgba(15, 23, 42, 0.8)' }}>
            <TableRow>
              {tableHeaders.map((h) => (
                <TableCell key={h.label} sx={{ color: '#7dd3fc', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em', borderBottom: '2px solid rgba(56, 189, 248, 0.2)' }}>
                  <Tooltip title={h.tooltip} arrow placement="top">
                    <span style={{ cursor: 'help' }}>{h.label}</span>
                  </Tooltip>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow 
                key={user.id} 
                sx={{ 
                  '&:hover': { backgroundColor: 'rgba(56, 189, 248, 0.04)' },
                  '& td': { color: '#cbd5e1', borderBottom: '1px solid rgba(148, 163, 184, 0.07)' } 
                }}
              >
                <TableCell>{user.id}</TableCell>
                <TableCell sx={{ color: '#e2e8f0', fontWeight: 500 }}>{user.rut}</TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.lastName}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.phoneNumber}</TableCell>
                <TableCell>
                  <Chip 
                    label={user.status} 
                    size="small"
                    sx={{ 
                      backgroundColor: user.status === 'ACTIVO' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(248, 113, 113, 0.1)',
                      color: user.status === 'ACTIVO' ? '#4ade80' : '#f87171',
                      fontWeight: 600,
                      fontSize: '0.7rem',
                      border: `1px solid ${user.status === 'ACTIVO' ? 'rgba(74, 222, 128, 0.2)' : 'rgba(248, 113, 113, 0.2)'}`
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<EditIcon />}
                    sx={skyButtonStyle}
                    onClick={() => navigate(`/users/edit/${user.id}`)}
                  >
                    Editar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {!loading && users.length === 0 && (
              <TableRow>
                <TableCell colSpan={9} align="center" sx={{ color: "#64748b", py: 8 }}>
                  No se han encontrado registros de usuarios.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default UserList;
