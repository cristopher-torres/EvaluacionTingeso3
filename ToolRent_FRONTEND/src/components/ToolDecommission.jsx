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
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Tooltip from "@mui/material/Tooltip";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { useKeycloak } from "@react-keycloak/web";
import PageHelp from "../components/PageHelp";

const ToolDecommission = () => {
  const { keycloak } = useKeycloak();
  const navigate = useNavigate();
  const [tools, setTools] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");
  const [openConfirm, setOpenConfirm] = useState(false);
  const [selectedTool, setSelectedTool] = useState(null);
  const rut = keycloak?.tokenParsed?.rut;

  const init = () => {
    setLoading(true);
    setLoadingMessage("Obteniendo inventario...");
    toolService
      .getAll()
      .then((response) => setTools(response.data))
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    init();
  }, []);

  const handleOpenConfirm = (tool) => {
    setSelectedTool(tool);
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
    setSelectedTool(null);
  };

  const handleDecommission = () => {
    if (!selectedTool) return;
    handleCloseConfirm();
    setLoading(true);
    setLoadingMessage(`Procesando baja...`);
    const toolDetails = { ...selectedTool, status: "DADA_DE_BAJA" };
    toolService.update(toolDetails, rut)
      .then(() => {
        setSnackbarMsg("Herramienta dada de baja exitosamente ✅");
        setOpenSnackbar(true);
        init();
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  };

  const filteredTools = tools
    .filter((tool) => tool.status !== "DADA_DE_BAJA")
    .filter((tool) => {
      const term = searchTerm.toLowerCase();
      return (
        tool.id.toString().includes(term) ||
        tool.name.toLowerCase().includes(term) ||
        tool.category.toLowerCase().includes(term)
      );
    });

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

  const destructiveButtonStyle = {
    backgroundColor: "rgba(248, 113, 113, 0.05)",
    border: "1px solid rgba(248, 113, 113, 0.3)",
    color: "#f87171",
    fontWeight: 600,
    textTransform: "none",
    "&:hover": { 
      backgroundColor: "#f87171", 
      color: "#0f172a",
      boxShadow: "0 4px 12px rgba(248, 113, 113, 0.2)"
    }
  };

  const tableHeaders = [
    { label: "ID", tooltip: "Identificador único de la herramienta" },
    { label: "Nombre", tooltip: "Nombre descriptivo" },
    { label: "Categoría", tooltip: "Clasificación de la herramienta" },
    { label: "Estado", tooltip: "Disponibilidad actual" },
    { label: "Acciones", tooltip: "Operaciones disponibles" }
  ];

  return (
    <Box sx={{ p: 3, bgcolor: '#0f172a', minHeight: '100vh' }}>
      <Backdrop sx={{ color: '#38bdf8', zIndex: 1201, backgroundColor: 'rgba(15, 23, 42, 0.9)' }} open={loading}>
        <CircularProgress color="inherit" />
        <Typography variant="h6" sx={{ mt: 2, color: '#38bdf8' }}>{loadingMessage}</Typography>
      </Backdrop>

      <Box display="flex" alignItems="center" gap={1} mb={4}>
        <Typography variant="h4" sx={{ color: "#e2e8f0", fontWeight: 700 }}>
          Dar de baja herramientas
        </Typography>
        <PageHelp 
          title="Gestión de Bajas" 
          steps={[
            "Busque la herramienta utilizando el filtro superior.",
            "Utilice el botón 'Dar de baja' para iniciar el proceso de retiro.",
            "Esta acción es permanente y la herramienta no podrá volver a circular."
          ]} 
        />
      </Box>

      <Box sx={{ mb: 4, p: 3, bgcolor: '#1e293b', borderRadius: 2, border: '1px solid rgba(148, 163, 184, 0.12)', borderTop: "3px solid rgba(248, 113, 113, 0.4)" }}>
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
              <Tooltip title="Filtrado dinámico de inventario" arrow placement="top">
                <HelpOutlineIcon sx={{ color: "#94a3b8", fontSize: "1.1rem", cursor: "help" }} />
              </Tooltip>
            )
          }}
        />
      </Box>

      <TableContainer component={Paper} sx={{ bgcolor: '#1e293b', borderRadius: 2, border: "1px solid rgba(148, 163, 184, 0.1)", boxShadow: "0 4px 24px rgba(0, 0, 0, 0.35)" }}>
        <Table>
          <TableHead sx={{ backgroundColor: 'rgba(15, 23, 42, 0.8)' }}>
            <TableRow>
              {tableHeaders.map((header) => (
                <TableCell key={header.label} sx={{ color: '#7dd3fc', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em' }}>
                  <Tooltip title={header.tooltip} arrow placement="top">
                    <span style={{ cursor: 'help' }}>{header.label}</span>
                  </Tooltip>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTools.map((tool) => (
              <TableRow key={tool.id} sx={{ '&:hover': { backgroundColor: 'rgba(56, 189, 248, 0.04)' }, '& td': { color: '#cbd5e1', borderBottom: '1px solid rgba(148,163,184,0.07)' } }}>
                <TableCell>{tool.id}</TableCell>
                <TableCell sx={{ color: '#e2e8f0', fontWeight: 500 }}>{tool.name}</TableCell>
                <TableCell>{tool.category}</TableCell>
                <TableCell>
                  <Typography sx={{ color: '#4ade80', fontWeight: 600, fontSize: '0.85rem' }}>{tool.status}</Typography>
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    size="small"
                    sx={destructiveButtonStyle}
                    onClick={() => handleOpenConfirm(tool)}
                  >
                    Dar de baja
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {!loading && filteredTools.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ color: "#64748b", py: 8 }}>
                  No se encontraron herramientas disponibles para retirar.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        PaperProps={{ sx: { bgcolor: "#1e293b", border: "1px solid rgba(248, 113, 113, 0.3)", color: "#e2e8f0", borderRadius: 2 } }}
      >
        <DialogTitle sx={{ color: "#f87171", fontWeight: 700 }}>Confirmar Baja</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: "#cbd5e1" }}>
            ¿Está seguro que desea dar de baja la herramienta <strong>{selectedTool?.name}</strong>? Esta acción lo removerá permanentemente del flujo de préstamos.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleCloseConfirm} sx={{ color: "#94a3b8", textTransform: 'none' }}>Cancelar</Button>
          <Button 
            onClick={handleDecommission} 
            variant="contained" 
            sx={{ bgcolor: "#f87171", color: "#0f172a", fontWeight: 700, textTransform: 'none', "&:hover": { bgcolor: "#ef4444" } }}
          >
            Confirmar Retiro
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={() => setOpenSnackbar(false)} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
        <Alert variant="filled" severity="success" sx={{ bgcolor: "#0ea5e9", color: "#0f172a", fontWeight: 700 }}>{snackbarMsg}</Alert>
      </Snackbar>
    </Box>
  );
};

export default ToolDecommission;




