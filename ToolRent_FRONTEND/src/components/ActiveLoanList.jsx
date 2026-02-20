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

const ActiveLoanList = () => {
  const [loans, setLoans] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [damaged, setDamaged] = useState(false);
  const [irreparable, setIrreparable] = useState(false);

  const [openReceiptDialog, setOpenReceiptDialog] = useState(false);
  const [loanReceipt, setLoanReceipt] = useState(null);
  const { keycloak } = useKeycloak();
  const rut = keycloak?.tokenParsed?.rut;

  const startDateRef = useRef(null);
  const endDateRef = useRef(null);
  const dateBtnRef = useRef(null);

  const fetchAllLoans = () => {
    getActiveLoans().then(res => setLoans(res.data));
  };

  const fetchLoansByDate = () => {
    if (!startDate || !endDate) return;
    getActiveLoansByDate(startDate, endDate).then(res => setLoans(res.data));
  };

  const resetFilters = () => {
    setStartDate("");
    setEndDate("");
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

    returnLoan(selectedLoan.id, rut, damaged, irreparable).then(res => {
      setLoanReceipt(res.data);
      setOpenReceiptDialog(true);
      setOpenDialog(false);
    });
  };

  const handleFinePaid = (paid) => {
    if (!loanReceipt || !loanReceipt.id) return;

    updateFinePaid(loanReceipt.id, paid).then(() => {
      setLoanReceipt(prev => ({
        ...prev,
        finePaid: paid
      }));

      setOpenReceiptDialog(false);
      setSelectedLoan(null);
      fetchAllLoans();
    }).catch(error => {
      console.error('Error actualizando estado de multa:', error);
    });
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
    "&:hover": {
      backgroundColor: "#00d2ff",
      color: "#100524",
    },
    "&:focus": { outline: "none" },
    "&:focusVisible": { outline: "none" }
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
    "& input[type='date']::-webkit-calendar-picker-indicator": {
      filter: "invert(1) sepia(100%) saturate(10000%) hue-rotate(170deg)",
      cursor: "pointer", position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', opacity: 0
    }
  };

  return (
    <Box sx={{ p: 3, bgcolor: '#100524', minHeight: '100vh' }}>
      <Typography variant="h4" sx={{ color: "#00d2ff", mb: 3, fontWeight: "bold" }}>
        Préstamos Activos
      </Typography>

      <Box sx={{ 
          p: 3, mb: 3, bgcolor: '#1d0b3b', borderRadius: 2, 
          border: '1px solid rgba(232, 28, 255, 0.2)',
          display: 'flex', flexDirection: 'column', gap: 2 
      }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography sx={{ color: '#b392f0', fontWeight: 'bold' }}>FECHAS:</Typography>
                  <TextField
                      label="Desde" type="date" inputRef={startDateRef}
                      value={startDate} sx={inputSx} InputLabelProps={{ shrink: true }}
                      onChange={(e) => {
                          const newStartDate = e.target.value;
                          setStartDate(newStartDate);
                          if (endDate && endDate < newStartDate) setEndDate("");
                          setTimeout(() => endDateRef.current?.showPicker(), 100);
                      }}
                      onClick={(e) => e.target.showPicker()}
                  />
                  <TextField
                      label="Hasta" type="date" inputRef={endDateRef}
                      value={endDate} sx={inputSx} InputLabelProps={{ shrink: true }}
                      inputProps={{ min: startDate }}
                      onChange={(e) => {
                          setEndDate(e.target.value);
                          setTimeout(() => dateBtnRef.current?.focus(), 100);
                      }}
                      onClick={(e) => e.target.showPicker()}
                  />
                  <Button 
                      variant="contained" ref={dateBtnRef} onClick={fetchLoansByDate}
                      startIcon={<FilterAltIcon />}
                      sx={{ 
                        bgcolor: "rgba(0, 210, 255, 0.1)", color: "#00d2ff", border: "1px solid #00d2ff", 
                        fontWeight: "bold", "&:hover": { bgcolor: "#00d2ff", color: "#100524" },
                        "&:focus": { outline: "none" }, "&:focusVisible": { outline: "none" }
                      }}
                  >
                      Filtrar Rango
                  </Button>
              </Box>

              <Divider orientation="vertical" flexItem sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />

              <Button 
                  onClick={resetFilters}
                  startIcon={<DeleteSweepIcon />}
                  sx={{ 
                      ml: 'auto', color: '#ff1744', fontWeight: 'bold',
                      border: '1px dashed #ff1744', "&:hover": { bgcolor: 'rgba(255,23,68,0.1)' },
                      "&:focus": { outline: "none" }, "&:focusVisible": { outline: "none" }
                  }}
              >
                  Limpiar Filtros
              </Button>
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
                  <Button variant="contained" sx={cyanButtonStyle} onClick={() => handleOpenDialog(loan)}>
                    Devolver
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog}
        PaperProps={{ sx: { bgcolor: '#1d0b3b', border: '1px solid #e81cff', color: 'white' } }}
      >
        <DialogTitle sx={{ color: '#00d2ff' }}>Devolver Herramienta</DialogTitle>
        <DialogContent>
          <FormControlLabel
            control={<Checkbox sx={{ color: '#e81cff', '&.Mui-checked': { color: '#e81cff' } }} checked={damaged} onChange={(e) => setDamaged(e.target.checked)} />}
            label="Herramienta dañada"
          />
          <FormControlLabel
            control={<Checkbox sx={{ color: '#e81cff', '&.Mui-checked': { color: '#e81cff' } }} checked={irreparable} onChange={(e) => setIrreparable(e.target.checked)} disabled={!damaged} />}
            label="Daño irreparable"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} sx={{ color: '#b392f0', "&:focus": { outline: "none" } }}>Cancelar</Button>
          <Button variant="contained" sx={cyanButtonStyle} onClick={handleReturn}>
            Confirmar devolución
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog 
        open={openReceiptDialog} 
        onClose={() => setOpenReceiptDialog(false)}
        PaperProps={{ sx: { bgcolor: '#1d0b3b', border: '2px solid #00d2ff', color: 'white', p: 2 } }}
      >
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
              <Typography variant="h6" sx={{ textAlign: 'right', mt: 2, color: '#00d2ff' }}>
                Total a pagar: ${loanReceipt.total || '0'}
              </Typography>

              {loanReceipt.fineTotal > 0 ? (
                <Box display="flex" flexDirection="column" alignItems="center" mt={3} sx={{ p: 2, bgcolor: 'rgba(232, 28, 255, 0.05)', borderRadius: 2 }}>
                  <Typography sx={{ color: '#b392f0', mb: 2 }}>¿Pagó la multa?</Typography>
                  <Box display="flex" gap={2}>
                    <Button sx={cyanButtonStyle} variant="contained" onClick={() => handleFinePaid(true)}>
                      Sí, pagó
                    </Button>
                    <Button variant="contained" sx={{ bgcolor: 'rgba(255, 23, 68, 0.1)', border: '1px solid #ff1744', color: '#ff1744', '&:hover': { bgcolor: '#ff1744', color: 'white' }, "&:focus": { outline: "none" } }} onClick={() => handleFinePaid(false)}>
                      No pagó
                    </Button>
                  </Box>
                </Box>
              ) : (
                <Box display="flex" justifyContent="center" mt={3}>
                  <Button variant="contained" sx={cyanButtonStyle} onClick={() => {
                      setOpenReceiptDialog(false);
                      setSelectedLoan(null);
                      fetchAllLoans();
                    }}
                  >
                    Cerrar
                  </Button>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default ActiveLoanList;
