import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useKeycloak } from "@react-keycloak/web";
import loanService from "../services/loan.service";
import toolService from "../services/tool.service";
import userService from "../services/user.service";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Autocomplete from "@mui/material/Autocomplete";
import Typography from "@mui/material/Typography";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import SaveIcon from "@mui/icons-material/Save";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

const AddLoan = () => {
  const { keycloak } = useKeycloak();
  const navigate = useNavigate();

  const [tools, setTools] = useState([]);
  const [clients, setClients] = useState([]);
  const [selectedTool, setSelectedTool] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [scheduledReturnDate, setScheduledReturnDate] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false);
  
  const [openReceiptDialog, setOpenReceiptDialog] = useState(false);
  const [loanReceipt, setLoanReceipt] = useState(null);

  const clientRef = useRef(null);
  const startDateRef = useRef(null);
  const endDateRef = useRef(null);

  const now = new Date();
  const today = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
    .toISOString()
    .split("T")[0];

  const getMinReturnDate = () => {
    if (!startDate) return today;
    const date = new Date(startDate + "T12:00:00");
    date.setDate(date.getDate() + 1);
    return date.toISOString().split("T")[0];
  };

  useEffect(() => {
    setLoading(true);
    setLoadingMessage("Cargando catálogo y clientes...");
    Promise.all([
      toolService.getAvailable(),
      userService.getAllClients()
    ])
      .then(([toolsRes, usersRes]) => {
        setTools(toolsRes.data);
        setClients(usersRes.data.filter(u => u.status.toUpperCase() === "ACTIVO"));
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const uniqueTools = tools.reduce((acc, tool) => {
    if (!acc.find((t) => t.name === tool.name)) acc.push(tool);
    return acc;
  }, []);

  const saveLoan = (e) => {
    e.preventDefault();
    setLoading(true);
    setLoadingMessage("Procesando préstamo...");
    const rut = keycloak?.tokenParsed?.rut;

    const loanData = {
      tool: { id: selectedTool?.id },
      client: { id: selectedClient?.id },
      startDate,
      scheduledReturnDate,
      createdLoan: new Date().toISOString(),
      createdBy: { rut: rut },
    };

    loanService.createLoan(loanData, rut)
      .then((res) => {
        setLoanReceipt(res.data);
        setOpenReceiptDialog(true);
      })
      .catch((err) => {
        const msg = err.response?.data;
        setErrorMessage(typeof msg === 'string' ? msg : (msg?.message || "Error al procesar"));
        setOpenErrorSnackbar(true);
      })
      .finally(() => setLoading(false));
  };

  const handleCloseReceipt = () => {
    setOpenReceiptDialog(false);
    navigate("/");
  };

  const inputSx = {
    "& .MuiOutlinedInput-root": {
      color: "white",
      "& fieldset": { borderColor: "rgba(0, 210, 255, 0.3)" },
      "&:hover fieldset": { borderColor: "#00d2ff" },
      "&.Mui-focused fieldset": { borderColor: "#00d2ff" },
    },
    "& .MuiInputLabel-root": { color: "#b392f0" },
    "& .MuiInputLabel-root.Mui-focused": { color: "#00d2ff" },
    "& .MuiSvgIcon-root": { color: "#00d2ff" },
    "& input[type='date']::-webkit-calendar-picker-indicator": {
      position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer'
    }
  };

  const cyanButtonStyle = {
    mt: 2, 
    bgcolor: "rgba(0, 210, 255, 0.1)", 
    border: "1px solid #00d2ff", 
    color: "#00d2ff", 
    fontWeight: "bold", 
    py: 1.5, 
    textTransform: "none", 
    outline: "none",
    "&:hover": { bgcolor: "#00d2ff", color: "#100524", boxShadow: "0 0 20px rgba(0, 210, 255, 0.6)" },
    "&:focus": { outline: "none" },
    "&:focusVisible": { outline: "none" }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" sx={{ bgcolor: "#100524", p: 2 }}>
      <Backdrop sx={{ color: '#00d2ff', zIndex: 10, bgcolor: 'rgba(16, 5, 36, 0.8)', display: 'flex', flexDirection: 'column', gap: 2 }} open={loading}>
        <CircularProgress color="inherit" />
        <Typography variant="h6" sx={{ textShadow: "0 0 10px rgba(0, 210, 255, 0.5)" }}>{loadingMessage}</Typography>
      </Backdrop>

      <Box component="form" onSubmit={saveLoan} sx={{ display: "flex", flexDirection: "column", gap: 3, width: "100%", maxWidth: "450px", p: 4, borderRadius: 3, bgcolor: "#1d0b3b", border: "1px solid rgba(232, 28, 255, 0.4)", boxShadow: "0 8px 32px rgba(232, 28, 255, 0.2)" }}>
        <Typography variant="h5" align="center" sx={{ color: "#00d2ff", fontWeight: "bold" }}>Registrar Préstamo</Typography>

        <Autocomplete
          options={uniqueTools}
          getOptionLabel={(o) => o.name || ""}
          value={selectedTool}
          onChange={(e, v) => {
            setSelectedTool(v);
            if (v) setTimeout(() => clientRef.current?.focus(), 100);
          }}
          renderInput={(p) => <TextField {...p} label="Buscar Herramienta" required sx={inputSx} />}
          slotProps={{ paper: { sx: { bgcolor: "#1d0b3b", color: "white", border: "1px solid #00d2ff" } } }}
        />

        <Autocomplete
          options={clients}
          getOptionLabel={(o) => o.username || ""}
          value={selectedClient}
          onChange={(e, v) => {
            setSelectedClient(v);
            if (v) setTimeout(() => startDateRef.current?.showPicker(), 100);
          }}
          renderInput={(p) => <TextField {...p} label="Buscar Cliente" inputRef={clientRef} required sx={inputSx} />}
          slotProps={{ paper: { sx: { bgcolor: "#1d0b3b", color: "white", border: "1px solid #00d2ff" } } }}
        />

        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            fullWidth label="Fecha Inicio" type="date" inputRef={startDateRef}
            inputProps={{ min: today }} value={startDate}
            onChange={(e) => {
              setStartDate(e.target.value);
              if (scheduledReturnDate && scheduledReturnDate <= e.target.value) setScheduledReturnDate("");
              setTimeout(() => endDateRef.current?.showPicker(), 100);
            }}
            InputLabelProps={{ shrink: true }} required sx={inputSx}
            onClick={(e) => e.target.showPicker()}
          />
          <TextField
            fullWidth label="Fecha Devolución" type="date" inputRef={endDateRef}
            inputProps={{ min: getMinReturnDate() }} value={scheduledReturnDate}
            onChange={(e) => setScheduledReturnDate(e.target.value)}
            InputLabelProps={{ shrink: true }} required sx={inputSx}
            onClick={(e) => e.target.showPicker()}
          />
        </Box>

        <Button type="submit" variant="contained" sx={cyanButtonStyle} startIcon={<SaveIcon />}>
          Confirmar Préstamo
        </Button>
      </Box>

      {/* Dialog de boleta de Préstamo */}
      <Dialog 
        open={openReceiptDialog} 
        onClose={handleCloseReceipt}
        PaperProps={{ sx: { bgcolor: '#1d0b3b', border: '2px solid #00d2ff', color: 'white', p: 2 } }}
      >
        <DialogTitle sx={{ color: '#00d2ff', textAlign: 'center', fontWeight: 'bold' }}>Comprobante de Préstamo</DialogTitle>
        <DialogContent>
          {loanReceipt && (
            <Box sx={{ minWidth: "300px", '& p': { mb: 1, borderBottom: '1px solid rgba(255,255,255,0.1)', pb: 0.5 } }}>
              <p><strong>ID Préstamo:</strong> {loanReceipt.id}</p>
              <p><strong>Cliente:</strong> {loanReceipt.client?.username || selectedClient?.username}</p>
              <p><strong>Herramienta:</strong> {loanReceipt.tool?.name || selectedTool?.name}</p>
              <p><strong>Fecha Inicio:</strong> {loanReceipt.startDate}</p>
              <p><strong>Fecha Devolución:</strong> {loanReceipt.scheduledReturnDate}</p>
              <p><strong>Precio del préstamo:</strong> <span style={{ color: '#00d2ff' }}>${loanReceipt.loanPrice || '0'}</span></p>
              
              <Box display="flex" justifyContent="center" mt={3}>
                <Button variant="contained" sx={{ ...cyanButtonStyle, mt: 0 }} onClick={handleCloseReceipt}>
                  Aceptar y Volver al Inicio
                </Button>
              </Box>
            </Box>
          )}
        </DialogContent>
      </Dialog>

      <Snackbar open={openErrorSnackbar} autoHideDuration={5000} onClose={() => setOpenErrorSnackbar(false)} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
        <Alert severity="error" variant="filled" sx={{ bgcolor: "#f44336", color: "white", fontWeight: "bold" }}>{errorMessage}</Alert>
      </Snackbar>
    </Box>
  );
};

export default AddLoan;



