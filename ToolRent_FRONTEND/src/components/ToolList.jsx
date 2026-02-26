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
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Tooltip from "@mui/material/Tooltip";
import Chip from "@mui/material/Chip";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
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
    toolService.getAll()
      .then((res) => setTools(res.data))
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => { init(); }, []);

  const filteredTools = tools.filter((t) => {
    const term = searchTerm.toLowerCase();
    return (
      t.id.toString().includes(term) ||
      t.name.toLowerCase().includes(term) ||
      t.category.toLowerCase().includes(term)
    );
  });

  const getStatusStyles = (status) => {
    const s = status?.toUpperCase();
    if (s === 'EN_REPARACION' || s === 'PRESTADA') {
      return { bg: 'rgba(251, 191, 36, 0.1)', color: '#fbbf24', border: 'rgba(251, 191, 36, 0.2)' };
    } else if (s === 'DISPONIBLE') {
      return { bg: 'rgba(34, 197, 94, 0.1)', color: '#4ade80', border: 'rgba(34, 197, 94, 0.2)' };
    } else {
      return { bg: 'rgba(248, 113, 113, 0.1)', color: '#f87171', border: 'rgba(248, 113, 113, 0.2)' };
    }
  };

  const inputSx = {
    "& .MuiOutlinedInput-root": {
      color: "#e2e8f0",
      "& fieldset": { borderColor: "rgba(148, 163, 184, 0.12)" },
      "&:hover fieldset": { borderColor: "rgba(56, 189, 248, 0.4)" },
      "&.Mui-focused fieldset": { borderColor: "#38bdf8" },
    },
    "& .MuiInputLabel-root": { color: "#94a3b8" },
    "& .MuiInputLabel-root.Mui-focused": { color: "#38bdf8" },
  };

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
    { label: "ID", tooltip: "Identificador único de la herramienta en el sistema" },
    { label: "Nombre", tooltip: "Nombre y modelo de la herramienta" },
    { label: "Categoría", tooltip: "Tipo de trabajo para el que se utiliza" },
    { label: "Estado", tooltip: "Disponibilidad actual (ej. Disponible, Prestada)" },
    { label: "Acciones", tooltip: "Modificar detalles de la herramienta" }
  ];

  return (
    <Box sx={{ p: 3, bgcolor: '#0f172a', minHeight: '100vh' }}>
      <Backdrop sx={{ display: 'flex', flexDirection: 'column', color: '#38bdf8', zIndex: 1201, backgroundColor: 'rgba(15, 23, 42, 0.9)' }} open={loading}>
        <CircularProgress color="inherit" />
        <Typography variant="h6" sx={{ mt: 2, color: '#38bdf8' }}>Cargando inventario...</Typography>
      </Backdrop>

      <Box display="flex" alignItems="center" gap={1} mb={4}>
        <Typography variant="h4" sx={{ color: "#e2e8f0", fontWeight: 700 }}>
          Inventario de Herramientas
        </Typography>
        <PageHelp 
          title="Gestión de Inventario" 
          steps={[
            "Visualice las herramientas registradas.",
            "Use la búsqueda para filtrar por ID, nombre o categoría.",
            "Requiere permisos ADMIN para añadir o editar ítems."
          ]} 
        />
      </Box>

      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 4, 
        p: 3, 
        bgcolor: '#1e293b', 
        borderRadius: 2, 
        border: '1px solid rgba(148, 163, 184, 0.12)', 
        borderTop: "3px solid rgba(56, 189, 248, 0.4)",
        gap: 2 
      }}>
        <TextField
          label="Buscar herramienta..."
          variant="outlined"
          size="small"
          fullWidth
          sx={inputSx}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{ ...skyButtonStyle, minWidth: '130px' }}
          onClick={() => {
            if (!keycloak.authenticated || !keycloak.hasRealmRole("ADMIN")) {
              alert("Acceso denegado: Se requieren permisos de administrador.");
              return;
            }
            navigate("/tools/add");
          }}
        >
          Agregar
        </Button>
      </Box>

      <Box sx={{ display: 'flex', gap: 3, mb: 2, px: 1, flexWrap: 'wrap' }}>
        <Box display="flex" alignItems="center" gap={1}>
          <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#4ade80', boxShadow: '0 0 8px rgba(74, 222, 128, 0.4)' }} />
          <Typography variant="body2" sx={{ color: '#cbd5e1', fontWeight: 500 }}>Aumento en el stock</Typography>
        </Box>
        <Box display="flex" alignItems="center" gap={1}>
          <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#fbbf24', boxShadow: '0 0 8px rgba(251, 191, 36, 0.4)' }} />
          <Typography variant="body2" sx={{ color: '#cbd5e1', fontWeight: 500 }}>Baja momentánea de stock</Typography>
        </Box>
        <Box display="flex" alignItems="center" gap={1}>
          <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#f87171', boxShadow: '0 0 8px rgba(248, 113, 113, 0.4)' }} />
          <Typography variant="body2" sx={{ color: '#cbd5e1', fontWeight: 500 }}>Baja en el stock</Typography>
        </Box>
      </Box>

      <TableContainer 
        component={Paper} 
        sx={{ 
          bgcolor: '#1e293b', 
          borderRadius: 2, 
          border: "1px solid rgba(148, 163, 184, 0.1)",
          boxShadow: "0 4px 24px rgba(0, 0, 0, 0.35)"
        }}
      >
        <Table>
          <TableHead sx={{ backgroundColor: 'rgba(15, 23, 42, 0.8)' }}>
            <TableRow>
              {tableHeaders.map((h) => (
                <TableCell key={h.label} sx={{ color: '#7dd3fc', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em' }}>
                  <Tooltip title={h.tooltip} arrow placement="top">
                    <span style={{ cursor: 'help' }}>{h.label}</span>
                  </Tooltip>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTools.map((t) => {
              const styles = getStatusStyles(t.status);
              return (
                <TableRow 
                  key={t.id} 
                  sx={{ 
                    '&:hover': { backgroundColor: 'rgba(56, 189, 248, 0.04)' },
                    '& td': { color: '#cbd5e1', borderBottom: '1px solid rgba(148, 163, 184, 0.07)' } 
                  }}
                >
                  <TableCell>{t.id}</TableCell>
                  <TableCell sx={{ color: '#e2e8f0', fontWeight: 500 }}>{t.name}</TableCell>
                  <TableCell>{t.category}</TableCell>
                  <TableCell>
                    <Chip 
                      label={t.status} 
                      size="small"
                      sx={{ 
                        backgroundColor: styles.bg,
                        color: styles.color,
                        fontWeight: 600,
                        fontSize: '0.7rem',
                        border: `1px solid ${styles.border}`
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<EditIcon />}
                      sx={{
                        color: "#38bdf8",
                        borderColor: "rgba(56, 189, 248, 0.3)",
                        textTransform: "none",
                        "&:hover": {
                          borderColor: "#38bdf8",
                          bgcolor: "rgba(56, 189, 248, 0.08)"
                        }
                      }}
                      onClick={() => {
                        if (!keycloak.authenticated || !keycloak.hasRealmRole("ADMIN")) {
                          alert("Permisos insuficientes.");
                          return;
                        }
                        navigate(`/tools/edit/${t.id}`);
                      }}
                    >
                      Editar
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
            {!loading && filteredTools.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ color: "#64748b", py: 8 }}>
                  No se encontraron herramientas.
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

