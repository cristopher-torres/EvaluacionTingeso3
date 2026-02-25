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
import Tooltip from "@mui/material/Tooltip";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline"; 
import { Link } from "react-router-dom";

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import 'dayjs/locale/es';

import PageHelp from "../components/PageHelp"; 

const AddLoan = () => {
  const { keycloak } = useKeycloak();
  const navigate = useNavigate();

  const [tools, setTools] = useState([]);
  const [clients, setClients] = useState([]);
  const [selectedTool, setSelectedTool] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [scheduledReturnDate, setScheduledReturnDate] = useState(null);

  const [startDateOpen, setStartDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false);
  
  const [openReceiptDialog, setOpenReceiptDialog] = useState(false);
  const [loanReceipt, setLoanReceipt] = useState(null);

  const clientRef = useRef(null);
  const submitBtnRef = useRef(null);

  const today = dayjs();

  const getMinReturnDate = () => {
    if (!startDate) return today;
    return startDate.add(1, 'day');
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
    if (!startDate || !scheduledReturnDate) {
        setErrorMessage("Debe seleccionar las fechas del préstamo");
        setOpenErrorSnackbar(true);
        return;
    }

    setLoading(true);
    setLoadingMessage("Procesando préstamo...");
    const rut = keycloak?.tokenParsed?.rut;

    const loanData = {
      tool: { id: selectedTool?.id },
      client: { id: selectedClient?.id },
      startDate: startDate.format('YYYY-MM-DD'),
      scheduledReturnDate: scheduledReturnDate.format('YYYY-MM-DD'),
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
      fontSize: "1rem", 
      "& fieldset": { borderColor: "rgba(0, 210, 255, 0.3)" },
      "&:hover fieldset": { borderColor: "#00d2ff" },
      "&.Mui-focused fieldset": { borderColor: "#00d2ff" },
    },
    "& .MuiInputLabel-root": { color: "#b392f0", fontSize: "1rem" },
    "& .MuiInputLabel-root.Mui-focused": { color: "#00d2ff" },
    "& .MuiSvgIcon-root": { color: "#00d2ff" }
  };

  const dateInputSx = {
    "& .MuiOutlinedInput-root": {
      color: "white",
      fontSize: "1rem", 
      "& fieldset": { borderColor: "rgba(0, 210, 255, 0.3)" },
      "&:hover fieldset": { borderColor: "#00d2ff" },
      "&.Mui-focused fieldset": { borderColor: "#00d2ff" },
      cursor: "pointer",
      paddingRight: "12px", 
    },
    "& .MuiInputBase-input": {
      cursor: "pointer",
      fontSize: "1rem", 
      caretColor: "transparent",
      userSelect: "none",
      pointerEvents: "none", 
      paddingRight: "0px",
      "&::selection": { backgroundColor: "transparent" },
    },
    "& .MuiInputLabel-root": { 
      color: "#b392f0", 
      pointerEvents: "none",
      fontSize: "1rem", 
      maxWidth: "calc(100% - 50px)", 
    },
    "& .MuiInputLabel-root.Mui-focused": { color: "#00d2ff" },
    "& .MuiIconButton-root": { 
      color: "#00d2ff", 
      pointerEvents: "none",
      padding: "8px", 
      marginRight: "10px", 
    }
  };

  const popperSx = {
    '& .MuiPaper-root': {
      backgroundColor: '#1d0b3b',
      border: '1px solid #00d2ff',
      color: 'white',
      boxShadow: '0 4px 20px rgba(0, 210, 255, 0.3)',
    },
    '& .MuiPickersCalendarHeader-root': { color: '#00d2ff' },
    '& .MuiIconButton-root': { color: '#00d2ff' },
    '& .MuiPickersDay-root': {
      color: 'white',
      '&:hover': { backgroundColor: 'rgba(0, 210, 255, 0.2)' },
      '&.Mui-selected': {
        backgroundColor: '#00d2ff',
        color: '#100524',
        '&:hover': { backgroundColor: '#00a8cc' },
      },
      '&.MuiPickersDay-today': { border: '1px solid #e81cff' }
    },
    '& .MuiDayCalendar-weekDayLabel': { color: '#b392f0' },
    '& .MuiPickersYear-yearButton': {
       color: 'white',
       '&.Mui-selected': { backgroundColor: '#00d2ff', color: '#100524' }
    },
    '& .MuiPickersMonth-monthButton': {
       color: 'white',
       '&.Mui-selected': { backgroundColor: '#00d2ff', color: '#100524' },
       textTransform: 'capitalize'
    }
  };

  const cyanButtonStyle = {
    mt: 2, 
    bgcolor: "rgba(0, 210, 255, 0.1)", 
    border: "1px solid #00d2ff", 
    color: "#00d2ff", 
    fontWeight: "bold", 
    fontSize: "1rem", 
    py: 1.5, 
    textTransform: "none", 
    outline: "none",
    "&:hover": { bgcolor: "#00d2ff", color: "#100524", boxShadow: "0 0 20px rgba(0, 210, 255, 0.6)" },
    "&:focus": { outline: "none" },
    "&:focusVisible": { outline: "none" }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" sx={{ bgcolor: "#100524", p: 2 }}>
        <Backdrop sx={{ color: '#00d2ff', zIndex: 10, bgcolor: 'rgba(16, 5, 36, 0.8)', display: 'flex', flexDirection: 'column', gap: 2 }} open={loading}>
          <CircularProgress color="inherit" />
          <Typography variant="h6" sx={{ textShadow: "0 0 10px rgba(0, 210, 255, 0.5)" }}>{loadingMessage}</Typography>
        </Backdrop>

        <Box component="form" onSubmit={saveLoan} sx={{ display: "flex", flexDirection: "column", gap: 3, width: "100%", maxWidth: "550px", p: 4, borderRadius: 3, bgcolor: "#1d0b3b", border: "1px solid rgba(232, 28, 255, 0.4)", boxShadow: "0 8px 32px rgba(232, 28, 255, 0.2)" }}>
          
          <Box display="flex" justifyContent="center" alignItems="center" gap={1}>
            <Typography variant="h5" align="center" sx={{ color: "#00d2ff", fontWeight: "bold" }}>
              Registrar Préstamo
            </Typography>
            <PageHelp 
              title="Guía Para Registrar Préstamo" 
              steps={[
                "Seleccione una herramienta del catálogo.",
                "Busque al cliente por su nombre de usuario o RUT. (Escribir RUT Con puntos y guión).",
                <span key="ayuda-usuarios">
                  Si un usuario no aparece en la búsqueda, es porque está restringido o no se ha registrado en el sistema, revisar en la{" "}
                  <Link 
                    to="/users/list" 
                    style={{ color: "#00d2ff", textDecoration: "underline", fontWeight: "bold" }}
                  >
                    lista de usuarios
                  </Link>.
                </span>,
                "La fecha de inicio no puede ser anterior a hoy.",
                "La devolución debe ser al menos un día después del inicio."
              ]} 
            />
          </Box>

          <Autocomplete
            options={uniqueTools}
            getOptionLabel={(o) => o.name || ""}
            value={selectedTool}
            onChange={(e, v) => {
              setSelectedTool(v);
              if (v) setTimeout(() => clientRef.current?.focus(), 100);
            }}
            renderInput={(p) => (
              <TextField 
                {...p} 
                label="Buscar Herramienta" 
                required 
                sx={inputSx} 
                InputProps={{
                  ...p.InputProps,
                  endAdornment: (
                    <>
                      <Tooltip title="Solo se muestran herramientas disponibles" arrow placement="top">
                        <HelpOutlineIcon sx={{ color: "#e81cff", fontSize: "1.2rem", mr: 1, cursor: "help" }} />
                      </Tooltip>
                      {p.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
            slotProps={{ paper: { sx: { bgcolor: "#1d0b3b", color: "white", border: "1px solid #00d2ff" } } }}
          />

          <Autocomplete
            options={clients}
            getOptionLabel={(o) => o ? `${o.username} - ${o.rut}` : ""}
            value={selectedClient}
            onChange={(e, v) => {
              setSelectedClient(v);
              if (v) setTimeout(() => setStartDateOpen(true), 100);
            }}
            renderInput={(p) => (
              <TextField 
                {...p} 
                label="Buscar Cliente (Username o RUT)" 
                inputRef={clientRef} 
                required 
                sx={inputSx} 
                InputProps={{
                  ...p.InputProps,
                  endAdornment: (
                    <>
                      <Tooltip 
                        title="Puede buscar tanto por nombre de usuario como por RUT. Solo clientes no restringidos." 
                        arrow 
                        placement="top"
                      >
                        <HelpOutlineIcon sx={{ color: "#e81cff", fontSize: "1.2rem", mr: 1, cursor: "help" }} />
                      </Tooltip>
                      {p.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
            slotProps={{ paper: { sx: { bgcolor: "#1d0b3b", color: "white", border: "1px solid #00d2ff" } } }}
          />

          <Box sx={{ display: 'flex', gap: 2 }}>
            <DatePicker
              enableAccessibleFieldDOMStructure={false}
              label="Fecha Inicio"
              value={startDate}
              minDate={today}
              open={startDateOpen}
              onOpen={() => setStartDateOpen(true)}
              onClose={() => setStartDateOpen(false)}
              onChange={(newValue) => {
                setStartDate(newValue);
                if (scheduledReturnDate && newValue && scheduledReturnDate.isBefore(newValue)) {
                  setScheduledReturnDate(null);
                }
              }}
              onAccept={(newValue) => {
                setStartDate(newValue);
                setStartDateOpen(false);
                setEndDateOpen(true);
              }}
              format="DD/MM/YYYY"
              slots={{
                textField: (params) => (
                  <TextField
                    {...params}
                    sx={dateInputSx}
                    fullWidth
                    required
                    onClick={() => setStartDateOpen(true)}
                    onKeyDown={(e) => e.preventDefault()}
                    inputProps={{
                      ...params.inputProps,
                      value: startDate ? startDate.format("DD/MM/YYYY") : "",
                      placeholder: "",
                      readOnly: true
                    }}
                  />
                )
              }}
              slotProps={{ popper: { sx: popperSx } }}
            />

            <DatePicker
              enableAccessibleFieldDOMStructure={false}
              label="Fecha Devolución"
              value={scheduledReturnDate}
              minDate={getMinReturnDate()}
              open={endDateOpen}
              onOpen={() => setEndDateOpen(true)}
              onClose={() => setEndDateOpen(false)}
              onChange={(newValue) => setScheduledReturnDate(newValue)}
              onAccept={(newValue) => {
                setScheduledReturnDate(newValue);
                setEndDateOpen(false);
                setTimeout(() => submitBtnRef.current?.focus(), 100);
              }}
              format="DD/MM/YYYY"
              slots={{
                textField: (params) => (
                  <TextField
                    {...params}
                    sx={dateInputSx}
                    fullWidth
                    required
                    onClick={() => setEndDateOpen(true)}
                    onKeyDown={(e) => e.preventDefault()}
                    inputProps={{
                      ...params.inputProps,
                      value: scheduledReturnDate ? scheduledReturnDate.format("DD/MM/YYYY") : "",
                      placeholder: "",
                      readOnly: true
                    }}
                  />
                )
              }}
              slotProps={{ popper: { sx: popperSx } }}
            />
          </Box>

          <Tooltip title="Asegúrese de que las fechas y el cliente sean correctos">
            <Button ref={submitBtnRef} type="submit" variant="contained" sx={cyanButtonStyle} startIcon={<SaveIcon />}>
              Confirmar Préstamo
            </Button>
          </Tooltip>
        </Box>

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
                <p><strong>Cliente:</strong> {loanReceipt.client?.username || selectedClient?.username} ({loanReceipt.client?.rut || selectedClient?.rut})</p>
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
    </LocalizationProvider>
  );
};

export default AddLoan;