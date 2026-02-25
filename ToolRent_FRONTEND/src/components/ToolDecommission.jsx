import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toolService from "../services/tool.service";
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Paper, Button, TextField, Box, Typography, Backdrop, 
  CircularProgress, Snackbar, Alert, Dialog, DialogActions, 
  DialogContent, DialogContentText, DialogTitle, Tooltip 
} from "@mui/material";
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
    setLoadingMessage(`Dando de baja: ${selectedTool.name}...`);

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
      color: "white",
      "& fieldset": { borderColor: "rgba(0, 210, 255, 0.3)" },
      "&:hover fieldset": { borderColor: "#00d2ff" },
      "&.Mui-focused fieldset": { borderColor: "#00d2ff" },
    },
    "& .MuiInputLabel-root": { color: "#b392f0" },
    "& .MuiInputLabel-root.Mui-focused": { color: "#00d2ff" },
  };

  const tableHeaders = [
    { label: "ID", tooltip: "Identificador único de la herramienta en el sistema" },
    { label: "Nombre", tooltip: "Nombre descriptivo de la herramienta" },
    { label: "Categoría", tooltip: "Clasificación de la herramienta" },
    { label: "Estado", tooltip: "Disponibilidad actual en el inventario" },
    { label: "Acciones", tooltip: "Operaciones que puede realizar sobre este registro" }
  ];

  return (
    <Box sx={{ p: 3, bgcolor: '#100524', minHeight: '100vh' }}>
      
      <Backdrop sx={{ color: '#00d2ff', zIndex: (theme) => theme.zIndex.drawer + 2, backgroundColor: 'rgba(16, 5, 36, 0.9)', display: 'flex', flexDirection: 'column', gap: 2 }} open={loading}>
        <CircularProgress color="inherit" />
        <Typography variant="h6">{loadingMessage}</Typography>
      </Backdrop>

      <Box display="flex" alignItems="center" gap={1} mb={4}>
        <Typography variant="h4" sx={{ color: "#00d2ff", fontWeight: "bold", textShadow: "0 0 10px rgba(0, 210, 255, 0.3)" }}>
          Dar de baja herramientas
        </Typography>
        <PageHelp 
          title="Gestión de Bajas" 
          steps={[
            "Busque la herramienta que desea retirar utilizando el buscador.",
            "Haga clic en el botón rojo 'Dar de baja' en la fila correspondiente.",
            "Confirme la acción en la ventana emergente.",
            "Una vez dada de baja, la herramienta no podrá volver a ser prestada."
          ]} 
        />
      </Box>

      <Box sx={{ mb: 4, p: 2, bgcolor: '#1d0b3b', borderRadius: 2, border: '1px solid rgba(232, 28, 255, 0.2)' }}>
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
              <Tooltip title="Filtre dinámicamente las herramientas disponibles ingresando cualquier coincidencia" arrow placement="top">
                <HelpOutlineIcon sx={{ color: "#e81cff", fontSize: "1.2rem", cursor: "help", ml: 1 }} />
              </Tooltip>
            )
          }}
        />
      </Box>

      <TableContainer component={Paper} sx={{ bgcolor: '#1d0b3b', borderRadius: 2, border: "1px solid rgba(0, 210, 255, 0.3)", boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)" }}>
        <Table>
          <TableHead sx={{ backgroundColor: 'rgba(0, 210, 255, 0.1)' }}>
            <TableRow>
              {tableHeaders.map((header) => (
                <TableCell key={header.label} sx={{ color: '#00d2ff', fontWeight: 'bold', borderBottom: '2px solid #e81cff' }}>
                  <Tooltip title={header.tooltip} arrow placement="top">
                    <span style={{ cursor: 'help' }}>{header.label}</span>
                  </Tooltip>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTools.map((tool) => (
              <TableRow key={tool.id} sx={{ '&:hover': { backgroundColor: 'rgba(232, 28, 255, 0.05)' }, '& td': { color: '#f1f5f9', borderBottom: '1px solid rgba(255,255,255,0.05)' } }}>
                <TableCell>{tool.id}</TableCell>
                <TableCell>{tool.name}</TableCell>
                <TableCell>{tool.category}</TableCell>
                <TableCell sx={{ color: '#00ff88', fontWeight: 'bold' }}>{tool.status}</TableCell>
                <TableCell>
                  <Tooltip title="Retirar permanentemente esta herramienta del inventario activo" arrow placement="left">
                    <Button
                      variant="contained"
                      sx={{
                        backgroundColor: "rgba(255, 23, 68, 0.1)", border: "1px solid #ff1744", color: "#ff1744", fontWeight: "bold", textTransform: "none",
                        "&:hover": { backgroundColor: "#ff1744", color: "white", boxShadow: "0 0 15px #ff1744" }
                      }}
                      onClick={() => handleOpenConfirm(tool)}
                    >
                      Dar de baja
                    </Button>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
            {!loading && filteredTools.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ color: "#b392f0", py: 4 }}>
                  No se encontraron herramientas para dar de baja.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        PaperProps={{ sx: { bgcolor: "#1d0b3b", color: "white", border: "1px solid #ff1744", borderRadius: 2 } }}
      >
        <DialogTitle sx={{ color: "#ff1744", fontWeight: "bold" }}>¿Confirmar baja de herramienta?</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: "white" }}>
            Esta acción marcará la herramienta <strong>{selectedTool?.name}</strong> como fuera de servicio permanentemente. ¿Deseas continuar?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseConfirm} sx={{ color: "white" }}>Cancelar</Button>
          <Button 
            onClick={handleDecommission} 
            variant="contained" 
            sx={{ bgcolor: "#ff1744", color: "white", "&:hover": { bgcolor: "#b2102f" } }}
          >
            Dar de baja
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={() => setOpenSnackbar(false)} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
        <Alert variant="filled" severity="success" sx={{ bgcolor: "#00d2ff", color: "#100524", fontWeight: "bold" }}>{snackbarMsg}</Alert>
      </Snackbar>
    </Box>
  );
};

export default ToolDecommission;




