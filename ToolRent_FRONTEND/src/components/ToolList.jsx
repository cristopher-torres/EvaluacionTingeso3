import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toolService from "../services/tool.service";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Tooltip from "@mui/material/Tooltip";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { useKeycloak } from "@react-keycloak/web";

import PageHelp from "../components/PageHelp";

const ToolList = () => {
  const { keycloak } = useKeycloak();
  const navigate = useNavigate();
  const [tools, setTools] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  const init = () => {
    setLoading(true);
    toolService
      .getAll()
      .then((response) => {
        setTools(response.data);
      })
      .catch((error) => {
        console.log("Error al cargar herramientas.", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    init();
  }, []);

  const filteredTools = tools.filter((tool) => {
    const term = searchTerm.toLowerCase();
    return (
      tool.id.toString().includes(term) ||
      tool.name.toLowerCase().includes(term) ||
      tool.category.toLowerCase().includes(term)
    );
  });

  const inputSx = {
    "& .MuiOutlinedInput-root": {
      color: "white",
      "& fieldset": { borderColor: "rgba(0, 210, 255, 0.3)" },
      "&:hover fieldset": { borderColor: "#00d2ff" },
      "&.Mui-focused fieldset": { borderColor: "#00d2ff" },
    },
    "& .MuiInputLabel-root": { color: "#b392f0" },
    "& .MuiInputLabel-root.Mui-focused": { color: "#00d2ff" },
  };

  const cyanButtonStyle = {
    backgroundColor: "rgba(0, 210, 255, 0.1)",
    border: "1px solid rgba(0, 210, 255, 0.4)",
    color: "#00d2ff",
    textTransform: "none",
    fontWeight: "bold",
    mb: 2,
    "&:hover": { 
      backgroundColor: "#00d2ff", 
      color: "#100524",
      boxShadow: "0 0 15px rgba(0, 210, 255, 0.5)" 
    }
  };

  const tableHeaders = [
    { label: "ID", tooltip: "Identificador único de la herramienta" },
    { label: "Nombre", tooltip: "Nombre y modelo de la herramienta" },
    { label: "Categoría", tooltip: "Clasificación de uso" },
    { label: "Estado", tooltip: "Disponibilidad actual (DISPONIBLE, PRESTADA, EN_REPARACION, etc.)" },
    { label: "Acciones", tooltip: "Modificar los datos de la herramienta (Solo Administradores)" }
  ];

  return (
    <Box sx={{ p: 3, bgcolor: '#100524', minHeight: '100vh' }}>
      
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
        <Typography variant="h6" sx={{ color: "#00d2ff", textShadow: "0 0 10px rgba(0, 210, 255, 0.5)" }}>
          Cargando herramientas...
        </Typography>
      </Backdrop>

      <Box display="flex" alignItems="center" gap={1} mb={4}>
        <Typography variant="h4" sx={{ color: "#00d2ff", fontWeight: "bold", textShadow: "0 0 10px rgba(0, 210, 255, 0.3)" }}>
          Inventario de Herramientas
        </Typography>
        <PageHelp 
          title="Gestión de Inventario" 
          steps={[
            "Visualice todas las herramientas registradas en el sistema.",
            "Use la barra de búsqueda para encontrar herramientas rápidamente.",
            "Para modificar los detalles o tarifas de una herramienta, use el botón 'Editar'.",
            "Requiere permisos de administrador para agregar o editar.",
            "Si se edita algun precio de una herramienta, este cambio se aplicará automaticamente a todas las herramientas con el mismo nombre y categoría."
          ]} 
        />
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, gap: 2 }}>
        <TextField
          label="Buscar por ID, Nombre o Categoría"
          variant="outlined"
          size="small"
          fullWidth
          sx={inputSx}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            endAdornment: (
              <Tooltip title="Filtre los resultados en tiempo real mientras escribe" arrow placement="top">
                <HelpOutlineIcon sx={{ color: "#e81cff", fontSize: "1.2rem", cursor: "help", ml: 1 }} />
              </Tooltip>
            )
          }}
        />

        <Tooltip title="Registrar una nueva herramienta en el sistema (Solo Administradores)" arrow placement="left">
          <span>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              sx={cyanButtonStyle}
              onClick={() => {
                if (!keycloak.authenticated) {
                    alert("Debes iniciar sesión para agregar una herramienta.");
                    return;
                }
                if (!keycloak.hasRealmRole("ADMIN")) {
                    alert("No tienes permisos para agregar herramientas.");
                    return;
                }
                navigate("/tools/add");
              }}
            >
              Agregar herramienta
            </Button>
          </span>
        </Tooltip>
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
              {tableHeaders.map((header) => (
                <TableCell 
                  key={header.label} 
                  sx={{ 
                    color: '#00d2ff', 
                    fontWeight: 'bold', 
                    borderBottom: '2px solid #e81cff' 
                  }}
                >
                  <Tooltip title={header.tooltip} arrow placement="top">
                    <span style={{ cursor: 'help' }}>{header.label}</span>
                  </Tooltip>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTools.map((tool) => (
              <TableRow 
                key={tool.id} 
                sx={{ 
                  '&:hover': { backgroundColor: 'rgba(232, 28, 255, 0.05)' },
                  '& td': { color: '#f1f5f9', borderBottom: '1px solid rgba(255,255,255,0.05)' } 
                }}
              >
                <TableCell>{tool.id}</TableCell>
                <TableCell>{tool.name}</TableCell>
                <TableCell>{tool.category}</TableCell>
                <TableCell 
                  sx={{ 
                    color: tool.status === 'DISPONIBLE' ? '#00ff88' : '#e81cff',
                    fontWeight: 'bold' 
                  }}
                >
                  {tool.status}
                </TableCell>
                <TableCell>
                  <Tooltip title="Modificar los valores y estado de esta herramienta" arrow placement="left">
                    <Button
                      variant="outlined"
                      startIcon={<EditIcon />}
                      sx={{
                        color: "#00d2ff",
                        borderColor: "rgba(0, 210, 255, 0.5)",
                        textTransform: "none",
                        "&:hover": {
                          borderColor: "#00d2ff",
                          bgcolor: "rgba(0, 210, 255, 0.05)"
                        }
                      }}
                      onClick={() => {
                        if (!keycloak.authenticated) {
                          alert("Debes iniciar sesión para editar una herramienta.");
                          return;
                        }
                        if (!keycloak.hasRealmRole("ADMIN")) {
                          alert("No tienes permisos para editar esta herramienta.");
                          return;
                        }
                        navigate(`/tools/edit/${tool.id}`);
                      }}
                    >
                      Editar
                    </Button>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
            {!loading && filteredTools.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ color: "#b392f0", py: 4 }}>
                  No se encontraron herramientas que coincidan con la búsqueda.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ToolList;





