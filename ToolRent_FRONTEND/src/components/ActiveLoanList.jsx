import { useEffect, useState, useRef } from "react";
import { getActiveLoans, getActiveLoansByDate, returnLoan, updateFinePaid } from "../services/loan.service";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useKeycloak } from "@react-keycloak/web";
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import Divider from '@mui/material/Divider';
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Tooltip from "@mui/material/Tooltip";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import 'dayjs/locale/es';

import PageHelp from "../components/PageHelp";

const ActiveLoanList = () => {
  const [loans, setLoans] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [damaged, setDamaged] = useState(false);
  const [irreparable, setIrreparable] = useState(false);

  const [openReceiptDialog, setOpenReceiptDialog] = useState(false);
  const [loanReceipt, setLoanReceipt] = useState(null);
  const { keycloak } = useKeycloak();
  const rut = keycloak?.tokenParsed?.rut;

  const [startDateOpen, setStartDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);
  const filterBtnRef = useRef(null);

  const fetchAllLoans = () => {
    setLoading(true);
    setLoadingMessage("Cargando préstamos activos...");
    getActiveLoans()
      .then(res => setLoans(res.data))
      .catch(err => console.error("Error cargando préstamos", err))
      .finally(() => setLoading(false));
  };

  const fetchLoansByDate = () => {
    if (!startDate || !endDate) return;
    setLoading(true);
    const startStr = startDate.format('YYYY-MM-DD');
    const endStr = endDate.format('YYYY-MM-DD');
    setLoadingMessage("Filtrando préstamos...");
    getActiveLoansByDate(startStr, endStr)
      .then(res => setLoans(res.data))
      .catch(err => console.error("Error filtrando préstamos", err))
      .finally(() => setLoading(false));
  };

  const resetFilters = () => {
    setStartDate(null);
    setEndDate(null);
    fetchAllLoans();
  };

  useEffect(() => {
    fetchAllLoans();
  }, []);

  const handleOpenDialog = (loan) => {
    setSelectedLoan(loan);
    setDamaged(false);
    setIrreparable(false);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedLoan(null);
  };

  const handleReturn = () => {
    if (!selectedLoan) return;
    setLoading(true);
    setLoadingMessage("Procesando devolución...");
    returnLoan(selectedLoan.id, rut, damaged, irreparable)
      .then(res => {
        setLoanReceipt(res.data);
        setOpenReceiptDialog(true);
        setOpenDialog(false);
      })
      .catch(err => console.error("Error al devolver", err))
      .finally(() => setLoading(false));
  };

  const handleFinePaid = (paid) => {
    if (!loanReceipt || !loanReceipt.id) return;
    setLoading(true);
    setLoadingMessage("Actualizando estado...");
    updateFinePaid(loanReceipt.id, paid)
      .then(() => {
        setLoanReceipt(prev => ({ ...prev, finePaid: paid }));
        setOpenReceiptDialog(false);
        setSelectedLoan(null);
        fetchAllLoans();
      })
      .catch(error => console.error('Error actualizando estado de multa:', error))
      .finally(() => setLoading(false));
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  };

  const cyanButtonStyle = {
    backgroundColor: "rgba(0, 210, 255, 0.1)",
    border: "1px solid rgba(0, 210, 255, 0.3)",
    color: "#00d2ff",
    textTransform: "none",
    fontWeight: "bold",
    outline: "none",
    "&:hover": { backgroundColor: "#00d2ff", color: "#100524" },
    "&:focus": { outline: "none" },
    "&:focusVisible": { outline: "none" },
    "&:disabled": { color: "rgba(0, 210, 255, 0.3)", borderColor: "rgba(0, 210, 255, 0.1)" }
  };

  const inputSx = {
    "& .MuiOutlinedInput-root": {
      color: "white",
      "& fieldset": { borderColor: "rgba(0, 210, 255, 0.3)" },
      "&:hover fieldset": { borderColor: "#00d2ff" },
      "&.Mui-focused fieldset": { borderColor: "#00d2ff" },
      cursor: "pointer"
    },
    "& .MuiInputBase-input": {
      cursor: "pointer",
      caretColor: "transparent",
      userSelect: "none",
      pointerEvents: "none", 
      "&::selection": {
        backgroundColor: "transparent",
      },
      "&::-moz-selection": {
        backgroundColor: "transparent",
      }
    },
    "& .MuiInputLabel-root": { color: "#b392f0", pointerEvents: "none" },
    "& .MuiInputLabel-root.Mui-focused": { color: "#00d2ff" },
    "& .MuiIconButton-root": { color: "#00d2ff", pointerEvents: "none" }
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

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
      <Box sx={{ p: 3, bgcolor: '#100524', minHeight: '100vh' }}>
        
        <Backdrop sx={{ color: '#00d2ff', zIndex: 10, backgroundColor: 'rgba(16, 5, 36, 0.9)', display: 'flex', flexDirection: 'column', gap: 2 }} open={loading}>
          <CircularProgress color="inherit" />
          <Typography variant="h6">{loadingMessage}</Typography>
        </Backdrop>

        <Box display="flex" alignItems="center" gap={1} mb={3}>
          <Typography variant="h4" sx={{ color: "#00d2ff", fontWeight: "bold" }}>
            Préstamos Activos
          </Typography>
          <PageHelp 
            title="Gestión de Devoluciones" 
            steps={[
              "Utilice los filtros de fecha para buscar préstamos específicos.",
              "Haga clic en 'Devolver' para procesar el retorno de una herramienta.",
              "Si la herramienta fue dañada, seleccione las casillas correspondientes durante la devolución para calcular las multas."
            ]} 
          />
        </Box>

        <Box sx={{ p: 3, mb: 3, bgcolor: '#1d0b3b', borderRadius: 2, border: '1px solid rgba(232, 28, 255, 0.2)', display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography sx={{ color: '#b392f0', fontWeight: 'bold' }}>FECHAS:</Typography>
                    
                    <DatePicker
                      enableAccessibleFieldDOMStructure={false}
                      label="Desde"
                      value={startDate}
                      open={startDateOpen}
                      onOpen={() => setStartDateOpen(true)}
                      onClose={() => setStartDateOpen(false)}
                      onChange={(newValue) => {
                        setStartDate(newValue);
                        if (endDate && newValue && endDate.isBefore(newValue)) {
                          setEndDate(null);
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
                            sx={inputSx}
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
                      label="Hasta"
                      value={endDate}
                      minDate={startDate || undefined}
                      open={endDateOpen}
                      onOpen={() => setEndDateOpen(true)}
                      onClose={() => setEndDateOpen(false)}
                      onChange={(newValue) => setEndDate(newValue)}
                      onAccept={(newValue) => {
                        setEndDate(newValue);
                        setEndDateOpen(false);
                        setTimeout(() => filterBtnRef.current?.focus(), 100);
                      }}
                      format="DD/MM/YYYY"
                      slots={{
                        textField: (params) => (
                          <TextField
                            {...params}
                            sx={inputSx}
                            onClick={() => setEndDateOpen(true)}
                            onKeyDown={(e) => e.preventDefault()}
                            inputProps={{
                              ...params.inputProps,
                              value: endDate ? endDate.format("DD/MM/YYYY") : "",
                              placeholder: "",
                              readOnly: true
                            }}
                          />
                        )
                      }}
                      slotProps={{ popper: { sx: popperSx } }}
                    />

                    <Tooltip title="Filtrar resultados por el rango de fechas seleccionado" arrow placement="top">
                      <span>
                        <Button 
                            variant="contained" ref={filterBtnRef} onClick={fetchLoansByDate}
                            startIcon={<FilterAltIcon />} sx={cyanButtonStyle} disabled={!startDate || !endDate || loading}
                        >
                            Filtrar Rango
                        </Button>
                      </span>
                    </Tooltip>
                </Box>

                <Divider orientation="vertical" flexItem sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />

                <Tooltip title="Quitar filtros y mostrar todos los préstamos activos" arrow placement="top">
                  <Button 
                      onClick={resetFilters} startIcon={<DeleteSweepIcon />}
                      sx={{ ml: 'auto', color: '#ff1744', fontWeight: 'bold', border: '1px dashed #ff1744', "&:hover": { bgcolor: 'rgba(255,23,68,0.1)' }, "&:focus": { outline: "none" }, "&:focusVisible": { outline: "none" } }}
                  >
                      Limpiar Filtros
                  </Button>
                </Tooltip>
            </Box>
        </Box>

        <TableContainer component={Paper} sx={{ bgcolor: '#1d0b3b', borderRadius: 2, border: "1px solid rgba(0, 210, 255, 0.3)" }}>
          <Table>
            <TableHead sx={{ backgroundColor: 'rgba(0, 210, 255, 0.1)' }}>
              <TableRow>
                <TableCell sx={{ color: '#00d2ff', fontWeight: 'bold' }}>ID</TableCell>
                <TableCell sx={{ color: '#00d2ff', fontWeight: 'bold' }}>Herramienta</TableCell>
                <TableCell sx={{ color: '#00d2ff', fontWeight: 'bold' }}>Cliente (ID)</TableCell>
                <TableCell sx={{ color: '#00d2ff', fontWeight: 'bold' }}>Inicio</TableCell>
                <TableCell sx={{ color: '#00d2ff', fontWeight: 'bold' }}>Fecha límite</TableCell>
                <TableCell sx={{ color: '#00d2ff', fontWeight: 'bold' }}>Estado</TableCell>
                <TableCell sx={{ color: '#00d2ff', fontWeight: 'bold' }}>Acción</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loans.map(loan => (
                <TableRow key={loan.id} sx={{ '&:hover': { backgroundColor: 'rgba(232, 28, 255, 0.05)' }, '& td': { color: '#f1f5f9', borderBottom: '1px solid rgba(255,255,255,0.05)' } }}>
                  <TableCell>{loan.id}</TableCell>
                  <TableCell>{loan.tool?.name}</TableCell>
                  <TableCell>{loan.client?.id}</TableCell>
                  <TableCell>{formatDate(loan.startDate)}</TableCell>
                  <TableCell>{formatDate(loan.scheduledReturnDate)}</TableCell>
                  <TableCell sx={{ color: '#e81cff', fontWeight: 'bold' }}>{loan.loanStatus}</TableCell>
                  <TableCell>
                    <Tooltip title="Registrar entrega de la herramienta y calcular cobros" arrow placement="left">
                      <Button variant="contained" sx={cyanButtonStyle} onClick={() => handleOpenDialog(loan)}>
                        Devolver
                      </Button>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
              {!loading && loans.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ color: "#b392f0", py: 4 }}>
                    No se encontraron préstamos activos.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={openDialog} onClose={handleCloseDialog} PaperProps={{ sx: { bgcolor: '#1d0b3b', border: '1px solid #e81cff', color: 'white' } }}>
          <DialogTitle sx={{ color: '#00d2ff', display: 'flex', alignItems: 'center', gap: 1 }}>
            Devolver Herramienta
            <Tooltip title="Seleccione si la herramienta presenta daños para aplicar los cobros de reparación o reposición correspondientes." arrow placement="right">
              <HelpOutlineIcon sx={{ color: "#e81cff", fontSize: "1.2rem", cursor: "help" }} />
            </Tooltip>
          </DialogTitle>
          <DialogContent>
            <Box display="flex" flexDirection="column" gap={1}>
              <FormControlLabel 
                control={<Checkbox sx={{ color: '#e81cff', '&.Mui-checked': { color: '#e81cff' } }} checked={damaged} onChange={(e) => setDamaged(e.target.checked)} />} 
                label={
                  <Box display="flex" alignItems="center" gap={1}>
                    Herramienta dañada
                    {damaged && (
                      <Tooltip title="Se sumará el costo de reparación definido para esta herramienta." arrow placement="right">
                        <HelpOutlineIcon sx={{ color: "#b392f0", fontSize: "1rem" }} />
                      </Tooltip>
                    )}
                  </Box>
                } 
              />
              <FormControlLabel 
                control={<Checkbox sx={{ color: '#e81cff', '&.Mui-checked': { color: '#e81cff' } }} checked={irreparable} onChange={(e) => setIrreparable(e.target.checked)} disabled={!damaged} />} 
                label={
                  <Box display="flex" alignItems="center" gap={1}>
                    Daño irreparable
                    {irreparable && (
                      <Tooltip title="Se cobrará el valor total de reposición de la herramienta." arrow placement="right">
                        <HelpOutlineIcon sx={{ color: "#b392f0", fontSize: "1rem" }} />
                      </Tooltip>
                    )}
                  </Box>
                } 
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} sx={{ color: '#b392f0', "&:focus": { outline: "none" } }}>Cancelar</Button>
            <Button variant="contained" sx={cyanButtonStyle} onClick={handleReturn}>Confirmar devolución</Button>
          </DialogActions>
        </Dialog>

        <Dialog open={openReceiptDialog} onClose={() => setOpenReceiptDialog(false)} PaperProps={{ sx: { bgcolor: '#1d0b3b', border: '2px solid #00d2ff', color: 'white', p: 2 } }}>
          <DialogTitle sx={{ color: '#00d2ff', textAlign: 'center', fontWeight: 'bold' }}>Boleta de Devolución</DialogTitle>
          <DialogContent>
            {loanReceipt && (
              <Box sx={{ minWidth: "300px", '& p': { mb: 1, borderBottom: '1px solid rgba(255,255,255,0.1)', pb: 0.5 } }}>
                <p><strong>Cliente:</strong> {loanReceipt.client?.rut}</p>
                <p><strong>Herramienta:</strong> {loanReceipt.tool?.name}</p>
                <p><strong>Precio préstamo:</strong> <span style={{ color: '#00d2ff' }}>${loanReceipt.loanPrice || '0'}</span></p>
                <p><strong>Multa por atraso:</strong> <span style={{ color: '#00d2ff' }}>${loanReceipt.fine || '0'}</span></p>
                <p><strong>Daño:</strong> <span style={{ color: '#00d2ff' }}>${loanReceipt.damagePrice || '0'}</span></p>
                <p><strong>Total multa + daño:</strong> <span style={{ color: '#00d2ff', fontWeight: 'bold' }}>${loanReceipt.fineTotal || '0'}</span></p>
                <Typography variant="h6" sx={{ textAlign: 'right', mt: 2, color: '#00d2ff' }}>Total a pagar: ${loanReceipt.total || '0'}</Typography>
                {loanReceipt.fineTotal > 0 ? (
                  <Box display="flex" flexDirection="column" alignItems="center" mt={3} sx={{ p: 2, bgcolor: 'rgba(232, 28, 255, 0.05)', borderRadius: 2 }}>
                    <Box display="flex" alignItems="center" gap={1} mb={2}>
                      <Typography sx={{ color: '#b392f0' }}>¿Pagó la multa?</Typography>
                      <Tooltip title="Confirme si el cliente ha pagado los recargos adicionales generados por atraso o daños" arrow placement="top">
                        <HelpOutlineIcon sx={{ color: "#e81cff", fontSize: "1rem", cursor: "help" }} />
                      </Tooltip>
                    </Box>
                    <Box display="flex" gap={2}>
                      <Button sx={cyanButtonStyle} variant="contained" onClick={() => handleFinePaid(true)}>Sí, pagó</Button>
                      <Button variant="contained" sx={{ bgcolor: 'rgba(255, 23, 68, 0.1)', border: '1px solid #ff1744', color: '#ff1744', '&:hover': { bgcolor: '#ff1744', color: 'white' }, "&:focus": { outline: "none" } }} onClick={() => handleFinePaid(false)}>No pagó</Button>
                    </Box>
                  </Box>
                ) : (
                  <Box display="flex" justifyContent="center" mt={3}>
                    <Button variant="contained" sx={cyanButtonStyle} onClick={() => { setOpenReceiptDialog(false); setSelectedLoan(null); fetchAllLoans(); }}>Cerrar</Button>
                  </Box>
                )}
              </Box>
            )}
          </DialogContent>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
};

export default ActiveLoanList;
