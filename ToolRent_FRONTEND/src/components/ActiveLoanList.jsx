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
import Chip from "@mui/material/Chip";

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

  const skyButtonStyle = {
    backgroundColor: "rgba(56, 189, 248, 0.07)",
    border: "1px solid rgba(56, 189, 248, 0.2)",
    color: "#7dd3fc",
    textTransform: "none",
    fontWeight: 600,
    outline: "none",
    "&:hover": { 
      backgroundColor: "rgba(56, 189, 248, 0.14)", 
      color: "#e2e8f0",
      border: "1px solid rgba(56, 189, 248, 0.4)"
    },
    "&:focus": { outline: "none" },
    "&:focusVisible": { outline: "none" },
    "&:disabled": { color: "rgba(148, 163, 184, 0.3)", borderColor: "rgba(148, 163, 184, 0.1)" }
  };

  const inputSx = {
    "& .MuiOutlinedInput-root": {
      color: "#e2e8f0",
      "& fieldset": { borderColor: "rgba(148, 163, 184, 0.12)" },
      "&:hover fieldset": { borderColor: "rgba(56, 189, 248, 0.4)" },
      "&.Mui-focused fieldset": { borderColor: "#38bdf8" },
      cursor: "pointer"
    },
    "& .MuiInputBase-input": {
      cursor: "pointer",
      caretColor: "transparent",
      userSelect: "none",
      pointerEvents: "none", 
    },
    "& .MuiInputLabel-root": { color: "#94a3b8", pointerEvents: "none" },
    "& .MuiInputLabel-root.Mui-focused": { color: "#38bdf8" },
    "& .MuiIconButton-root": { color: "#38bdf8", pointerEvents: "none" }
  };

  const popperSx = {
    '& .MuiPaper-root': {
      backgroundColor: '#1e293b',
      border: '1px solid rgba(148, 163, 184, 0.15)',
      color: '#e2e8f0',
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)',
    },
    '& .MuiPickersCalendarHeader-root': { color: '#38bdf8' },
    '& .MuiIconButton-root': { color: '#38bdf8' },
    '& .MuiPickersDay-root': {
      color: '#e2e8f0',
      '&:hover': { backgroundColor: 'rgba(56, 189, 248, 0.08)' },
      '&.Mui-selected': {
        backgroundColor: '#0ea5e9',
        color: '#0f172a',
        '&:hover': { backgroundColor: '#38bdf8' },
      },
      '&.MuiPickersDay-today': { border: '1px solid rgba(56, 189, 248, 0.3)' }
    },
    '& .MuiDayCalendar-weekDayLabel': { color: '#94a3b8' }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
      <Box sx={{ p: 3, bgcolor: '#0f172a', minHeight: '100vh' }}>
        
        <Backdrop sx={{ color: '#38bdf8', zIndex: 1201, backgroundColor: 'rgba(15, 23, 42, 0.9)' }} open={loading}>
          <CircularProgress color="inherit" />
          <Typography variant="h6" sx={{ mt: 2, color: '#38bdf8' }}>{loadingMessage}</Typography>
        </Backdrop>

        <Box display="flex" alignItems="center" gap={1} mb={3}>
          <Typography variant="h4" sx={{ color: "#e2e8f0", fontWeight: 700 }}>
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

        <Box sx={{ p: 3, mb: 3, bgcolor: '#1e293b', borderRadius: 2, border: '1px solid rgba(148, 163, 184, 0.12)', display: 'flex', flexDirection: 'column', gap: 2, borderTop: "3px solid rgba(56, 189, 248, 0.4)" }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography variant="overline" sx={{ color: '#38bdf8', fontWeight: 600, letterSpacing: '0.05em' }}>Filtros de fecha</Typography>
                    
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
                            size="small"
                            onClick={() => setStartDateOpen(true)}
                            onKeyDown={(e) => e.preventDefault()}
                            inputProps={{
                              ...params.inputProps,
                              value: startDate ? startDate.format("DD/MM/YYYY") : "",
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
                            size="small"
                            onClick={() => setEndDateOpen(true)}
                            onKeyDown={(e) => e.preventDefault()}
                            inputProps={{
                              ...params.inputProps,
                              value: endDate ? endDate.format("DD/MM/YYYY") : "",
                              readOnly: true
                            }}
                          />
                        )
                      }}
                      slotProps={{ popper: { sx: popperSx } }}
                    />

                    <Tooltip title="Filtrar resultados por el rango seleccionado" arrow placement="top">
                      <span>
                        <Button 
                            variant="contained" ref={filterBtnRef} onClick={fetchLoansByDate}
                            startIcon={<FilterAltIcon />} sx={skyButtonStyle} disabled={!startDate || !endDate || loading}
                        >
                            Filtrar
                        </Button>
                      </span>
                    </Tooltip>
                </Box>

                <Divider orientation="vertical" flexItem sx={{ bgcolor: 'rgba(148, 163, 184, 0.1)' }} />

                <Button 
                    onClick={resetFilters} startIcon={<DeleteSweepIcon />}
                    sx={{ ml: 'auto', color: '#f87171', fontWeight: 600, textTransform: 'none', border: '1px dashed rgba(248, 113, 113, 0.3)', px: 2, "&:hover": { bgcolor: 'rgba(248, 113, 113, 0.08)', borderColor: '#f87171' }, "&:focus": { outline: "none" } }}
                >
                    Limpiar Filtros
                </Button>
            </Box>
        </Box>

        <TableContainer component={Paper} sx={{ bgcolor: '#1e293b', borderRadius: 2, border: "1px solid rgba(148, 163, 184, 0.1)", boxShadow: "0 4px 24px rgba(0, 0, 0, 0.35)" }}>
          <Table>
            <TableHead sx={{ backgroundColor: 'rgba(15, 23, 42, 0.8)' }}>
              <TableRow>
                {["ID", "Herramienta", "Cliente (ID)", "Inicio", "Fecha límite", "Estado", "Acción"].map(head => (
                  <TableCell key={head} sx={{ color: '#7dd3fc', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em' }}>{head}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {loans.map(loan => (
                <TableRow key={loan.id} sx={{ '&:hover': { backgroundColor: 'rgba(56, 189, 248, 0.04)' }, '& td': { color: '#cbd5e1', borderBottom: '1px solid rgba(148,163,184,0.07)' } }}>
                  <TableCell>{loan.id}</TableCell>
                  <TableCell sx={{ color: '#e2e8f0', fontWeight: 500 }}>{loan.tool?.name}</TableCell>
                  <TableCell>{loan.client?.id}</TableCell>
                  <TableCell>{formatDate(loan.startDate)}</TableCell>
                  <TableCell>{formatDate(loan.scheduledReturnDate)}</TableCell>
                  <TableCell>
                    <Chip 
                      label={loan.loanStatus} 
                      size="small"
                      sx={{ 
                        backgroundColor: loan.loanStatus === 'ATRASADO' ? 'rgba(248, 113, 113, 0.1)' : 'rgba(56, 189, 248, 0.1)',
                        color: loan.loanStatus === 'ATRASADO' ? '#f87171' : '#38bdf8',
                        fontWeight: 600,
                        fontSize: '0.7rem',
                        border: `1px solid ${loan.loanStatus === 'ATRASADO' ? 'rgba(248, 113, 113, 0.2)' : 'rgba(56, 189, 248, 0.2)'}`
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Tooltip title="Procesar retorno físico" arrow placement="left">
                      <Button variant="contained" sx={skyButtonStyle} size="small" onClick={() => handleOpenDialog(loan)}>
                        Devolver
                      </Button>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
              {!loading && loans.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ color: "#64748b", py: 8 }}>
                    No se encontraron préstamos activos en este momento.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={openDialog} onClose={handleCloseDialog} PaperProps={{ sx: { bgcolor: '#1e293b', border: '1px solid rgba(148, 163, 184, 0.2)', color: '#e2e8f0', boxShadow: '0 24px 48px rgba(0,0,0,0.5)' } }}>
          <DialogTitle sx={{ color: '#38bdf8', borderBottom: '1px solid rgba(148, 163, 184, 0.1)', mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
            Devolver Herramienta
            <HelpOutlineIcon sx={{ color: "#94a3b8", fontSize: "1.2rem" }} />
          </DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography variant="body2" sx={{ color: '#94a3b8', mb: 1 }}>Marque las condiciones de entrega:</Typography>
              <FormControlLabel 
                control={<Checkbox sx={{ color: '#475569', '&.Mui-checked': { color: '#38bdf8' } }} checked={damaged} onChange={(e) => setDamaged(e.target.checked)} />} 
                label="La herramienta presenta daños" 
              />
              <FormControlLabel 
                control={<Checkbox sx={{ color: '#475569', '&.Mui-checked': { color: '#f87171' } }} checked={irreparable} onChange={(e) => setIrreparable(e.target.checked)} disabled={!damaged} />} 
                label={<Typography sx={{ color: !damaged ? '#475569' : '#e2e8f0' }}>El daño es irreparable (reposición total)</Typography>}
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 2.5, borderTop: '1px solid rgba(148, 163, 184, 0.1)' }}>
            <Button onClick={handleCloseDialog} sx={{ color: '#94a3b8', textTransform: 'none', fontWeight: 600 }}>Cancelar</Button>
            <Button variant="contained" sx={skyButtonStyle} onClick={handleReturn}>Confirmar devolución</Button>
          </DialogActions>
        </Dialog>

        <Dialog open={openReceiptDialog} onClose={() => setOpenReceiptDialog(false)} PaperProps={{ sx: { bgcolor: '#0f172a', border: '1px solid rgba(56, 189, 248, 0.3)', color: '#e2e8f0', p: 1, minWidth: 360 } }}>
          <DialogTitle sx={{ color: '#38bdf8', textAlign: 'center', fontWeight: 700, letterSpacing: '0.02em' }}>BOLETA DE DEVOLUCIÓN</DialogTitle>
          <DialogContent>
            {loanReceipt && (
              <Box sx={{ mt: 1 }}>
                <Box sx={{ '& p': { mb: 1.5, display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(148, 163, 184, 0.1)', pb: 1 } }}>
                  <Typography variant="body2" sx={{ color: '#94a3b8' }}>Cliente:</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{loanReceipt.client?.rut}</Typography>
                </Box>
                <Box sx={{ '& p': { mb: 1.5, display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(148, 163, 184, 0.1)', pb: 1 } }}>
                  <Typography variant="body2" sx={{ color: '#94a3b8' }}>Herramienta:</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{loanReceipt.tool?.name}</Typography>
                </Box>
                <Box sx={{ '& p': { mb: 1.5, display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(148, 163, 184, 0.1)', pb: 1 } }}>
                  <Typography variant="body2" sx={{ color: '#94a3b8' }}>Tarifa Préstamo:</Typography>
                  <Typography variant="body2" sx={{ color: '#38bdf8' }}>${loanReceipt.loanPrice || '0'}</Typography>
                </Box>
                <Box sx={{ '& p': { mb: 1.5, display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(148, 163, 184, 0.1)', pb: 1 } }}>
                  <Typography variant="body2" sx={{ color: '#94a3b8' }}>Multa por Atraso:</Typography>
                  <Typography variant="body2" sx={{ color: loanReceipt.fine > 0 ? '#f87171' : '#e2e8f0' }}>${loanReceipt.fine || '0'}</Typography>
                </Box>
                <Box sx={{ '& p': { mb: 1.5, display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(148, 163, 184, 0.1)', pb: 1 } }}>
                  <Typography variant="body2" sx={{ color: '#94a3b8' }}>Recargo por Daño:</Typography>
                  <Typography variant="body2" sx={{ color: loanReceipt.damagePrice > 0 ? '#f87171' : '#e2e8f0' }}>${loanReceipt.damagePrice || '0'}</Typography>
                </Box>
                
                <Typography variant="h5" sx={{ textAlign: 'right', mt: 3, mb: 3, color: '#38bdf8', fontWeight: 700 }}>
                  Total a pagar: ${loanReceipt.total || '0'}
                </Typography>

                {loanReceipt.fineTotal > 0 ? (
                  <Box sx={{ p: 2, bgcolor: 'rgba(15, 23, 42, 0.8)', borderRadius: 2, border: '1px solid rgba(56, 189, 248, 0.1)' }}>
                    <Typography variant="subtitle2" sx={{ color: '#e2e8f0', mb: 2, textAlign: 'center', fontWeight: 600 }}>¿Se liquidó la deuda en este momento?</Typography>
                    <Box display="flex" gap={2}>
                      <Button fullWidth sx={{ ...skyButtonStyle, bgcolor: 'rgba(56, 189, 248, 0.1)' }} variant="contained" onClick={() => handleFinePaid(true)}>Sí, pagó</Button>
                      <Button fullWidth variant="contained" sx={{ bgcolor: 'rgba(248, 113, 113, 0.05)', border: '1px solid rgba(248, 113, 113, 0.2)', color: '#f87171', textTransform: 'none', fontWeight: 600, '&:hover': { bgcolor: 'rgba(248, 113, 113, 0.15)', borderColor: '#f87171' } }} onClick={() => handleFinePaid(false)}>Pendiente</Button>
                    </Box>
                  </Box>
                ) : (
                  <Box display="flex" justifyContent="center" mt={2}>
                    <Button variant="contained" sx={{ ...skyButtonStyle, width: '100%', py: 1.2 }} onClick={() => { setOpenReceiptDialog(false); setSelectedLoan(null); fetchAllLoans(); }}>Cerrar Boleta</Button>
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
