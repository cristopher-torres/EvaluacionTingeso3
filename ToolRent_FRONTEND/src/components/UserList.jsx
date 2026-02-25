import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllClients } from "../services/user.service";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import EditIcon from "@mui/icons-material/Edit";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Tooltip from "@mui/material/Tooltip";

import PageHelp from "../components/PageHelp";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    getAllClients()
      .then((res) => {
        setUsers(res.data);
      })
      .catch((err) => {
        console.error("Error al cargar usuarios:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const actionButtonStyle = {
    backgroundColor: "rgba(0, 210, 255, 0.1)",
    border: "1px solid rgba(0, 210, 255, 0.5)",
    color: "#00d2ff",
    textTransform: "none",
    fontWeight: "bold",
    "&:hover": {
      backgroundColor: "#00d2ff",
      color: "#100524",
      boxShadow: "0 0 10px #00d2ff",
    }
  };

  const tableHeaders = [
    { label: "ID", tooltip: "Identificador interno del usuario" },
    { label: "Rut", tooltip: "Documento de Identidad" },
    { label: "Username", tooltip: "Nombre de usuario en la pagina" },
    { label: "Nombre", tooltip: "Nombre del usuario real" },
    { label: "Apellido", tooltip: "Apellidos del usuario" },
    { label: "Email", tooltip: "Correo electrónico de contacto" },
    { label: "Número de teléfono", tooltip: "Teléfono móvil registrado" },
    { label: "Estado", tooltip: "Indica si el usuario está ACTIVO o RESTRINGIDO (ej. por multas)" },
    { label: "Acciones", tooltip: "Opciones disponibles para gestionar el usuario" }
  ];

  return (
    <Box sx={{ 
      p: 3, 
      bgcolor: '#100524', 
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column'
    }}>
      
      <Backdrop
        sx={{ 
          color: '#00d2ff', 
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: 'rgba(16, 5, 36, 0.9)',
          display: 'flex',
          flexDirection: 'column',
          gap: 2
        }}
        open={loading}
      >
        <CircularProgress color="inherit" />
        <Typography variant="h6" sx={{ textShadow: "0 0 10px rgba(0, 210, 255, 0.5)" }}>
          Cargando usuarios...
        </Typography>
      </Backdrop>

      <Box display="flex" alignItems="center" gap={1} mb={3}>
        <Typography variant="h4" sx={{ color: "#00d2ff", fontWeight: "bold", textShadow: "0 0 10px rgba(0, 210, 255, 0.3)" }}>
          Listado de Usuarios
        </Typography>
        <PageHelp 
          title="Directorio de Clientes" 
          steps={[
            "Visualice la lista completa de todos los clientes registrados.",
            "Compruebe rápidamente el estado (ACTIVO/RESTRINGIDO) de cada cuenta.",
            "Use el botón 'Editar' para actualizar la información de contacto o corregir datos de un usuario específico."
          ]} 
        />
      </Box>

      <TableContainer 
        component={Paper} 
        sx={{ 
          bgcolor: '#1d0b3b', 
          borderRadius: 2, 
          border: "1px solid rgba(0, 210, 255, 0.3)",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)"
        }}
      >
        <Table>
          <TableHead sx={{ backgroundColor: 'rgba(0, 210, 255, 0.1)' }}>
            <TableRow>
              {tableHeaders.map((head) => (
                <TableCell key={head.label} sx={{ color: '#00d2ff', fontWeight: 'bold', borderBottom: "2px solid #e81cff" }}>
                  <Tooltip title={head.tooltip} arrow placement="top">
                    <span style={{ cursor: 'help' }}>{head.label}</span>
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
                  '&:hover': { backgroundColor: 'rgba(232, 28, 255, 0.05)' },
                  '& td': { color: '#f1f5f9', borderBottom: '1px solid rgba(255,255,255,0.05)' } 
                }}
              >
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.rut}</TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.lastName}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.phoneNumber}</TableCell>
                <TableCell sx={{ 
                  color: user.status === 'ACTIVO' ? '#00ff88' : '#e81cff', 
                  fontWeight: 'bold' 
                }}>
                  <Tooltip title={user.status === 'ACTIVO' ? 'Usuario habilitado para realizar préstamos' : 'Usuario bloqueado temporalmente (posiblemente por multas impagas)'} arrow placement="left">
                    <span>{user.status}</span>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <Tooltip title="Modificar los datos personales de este usuario" arrow placement="left">
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<EditIcon />}
                      sx={actionButtonStyle}
                      onClick={() => navigate(`/users/edit/${user.id}`)}
                    >
                      Editar
                    </Button>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
            {!loading && users.length === 0 && (
              <TableRow>
                <TableCell colSpan={9} align="center" sx={{ color: "#b392f0", py: 4 }}>
                  No hay usuarios registrados actualmente.
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

