import { useEffect, useState } from "react";
import { getUnpaidLoans, updateFinePaid } from "../services/loan.service";
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
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Tooltip from "@mui/material/Tooltip";
import Divider from "@mui/material/Divider";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import PageHelp from "../components/PageHelp";

const UnpaidLoansPage = () => {
  const [loans, setLoans] = useState([]);
  const [filteredLoans, setFilteredLoans] = useState([]);
  const [rutFilter, setRutFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");
  const [severity, setSeverity] = useState("success");
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [loanToPay, setLoanToPay] = useState(null);

  const fetchUnpaidLoans = () => {
    setLoading(true);
    setLoadingMessage("Sincronizando multas...");
    getUnpaidLoans()
      .then(res => {
        setLoans(res.data);
        setFilteredLoans(res.data);
      })
      .catch(() => showFeedback("Error al conectar con el servidor", "error"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchUnpaidLoans(); }, []);

  useEffect(() => {
    const filtered = loans.filter(loan => 
      loan.client?.rut?.toLowerCase().includes(rutFilter.toLowerCase())
    );
    setFilteredLoans(filtered);
  }, [rutFilter, loans]);

  const showFeedback = (msg, type) => {
    setSnackbarMsg(msg);
    setSeverity(type);
    setOpenSnackbar(true);
  };

  const handleOpenConfirmDialog = (loan) => {
    setLoanToPay(loan);
    setConfirmDialogOpen(true);
  };

  const confirmPayment = () => {
    if (!loanToPay) return;
    setConfirmDialogOpen(false);
    setLoading(true);
    updateFinePaid(loanToPay.id, true)
      .then(() => {
        showFeedback("Pago validado exitosamente ✅", "success");
        fetchUnpaidLoans();
      })
      .catch(() => showFeedback("Error al registrar el pago ❌", "error"))
      .finally(() => setLoading(false));
  };

  const skyButtonStyle = {
    backgroundColor: "rgba(56, 189, 248, 0.07)",
    border: "1px solid rgba(56, 189, 248, 0.25)",
    color: "#7dd3fc",
    textTransform: "none",
    fontWeight: 600,
    "&:hover": { 
      backgroundColor: "rgba(56, 189, 248, 0.14)", 
      color: "#e2e8f0",
      border: "1px solid rgba(56, 189, 248, 0.4)"
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

  const tableHeaders = [
    { label: "ID Préstamo", tooltip: "Folio del préstamo asociado" },
    { label: "ID Cliente", tooltip: "Identificador interno" },
    { label: "RUT", tooltip: "Identificación fiscal" },
    { label: "Email", tooltip: "Correo de contacto" },
    { label: "Teléfono", tooltip: "Número móvil" },
    { label: "Monto Deuda", tooltip: "Total acumulado por multas o daños" },
    { label: "Gestión", tooltip: "Registrar recepción de fondos" }
  ];

  return (
    <Box sx={{ p: 3, bgcolor: '#0f172a', minHeight: '100vh' }}>
      <Backdrop sx={{ color: '#38bdf8', zIndex: 1201, backgroundColor: 'rgba(15, 23, 42, 0.9)' }} open={loading}>
        <CircularProgress color="inherit" />
        <Typography variant="h6" sx={{ mt: 2, color: '#38bdf8' }}>{loadingMessage}</Typography>
      </Backdrop>

      <Box display="flex" alignItems="center" gap={1} mb={4}>
        <Typography variant="h4" sx={{ color: "#e2e8f0", fontWeight: 700 }}>
          Control de Multas
        </Typography>
        <PageHelp 
          title="Gestión de Deudas" 
          steps={[
            "Visualice las multas generadas por retrasos o daños.",
            "Utilice el filtro de RUT para ubicar clientes específicos.",
            "Al recibir el pago físico o transferencia, use 'Marcar Pago'.",
            "Esta acción liberará la restricción del cliente automáticamente."
          ]} 
        />
      </Box>

      <Box sx={{ mb: 4, p: 3, bgcolor: '#1e293b', borderRadius: 2, border: '1px solid rgba(148, 163, 184, 0.12)', borderTop: "3px solid rgba(56, 189, 248, 0.4)" }}>
        <TextField 
          label="Buscar cliente por RUT" 
          variant="outlined" 
          size="small" 
          fullWidth 
          sx={inputSx} 
          value={rutFilter} 
          onChange={(e) => setRutFilter(e.target.value)} 
          InputProps={{
            endAdornment: <HelpOutlineIcon sx={{ color: "#94a3b8", fontSize: "1.1rem", mr: 1 }} />
          }}
        />
      </Box>

      <TableContainer component={Paper} sx={{ bgcolor: '#1e293b', borderRadius: 2, border: "1px solid rgba(148, 163, 184, 0.1)", boxShadow: "0 4px 24px rgba(0, 0, 0, 0.35)" }}>
        <Table>
          <TableHead sx={{ backgroundColor: 'rgba(15, 23, 42, 0.8)' }}>
            <TableRow>
              {tableHeaders.map((head) => (
                <TableCell key={head.label} sx={{ color: '#7dd3fc', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em' }}>
                  <Tooltip title={head.tooltip} arrow placement="top">
                    <span style={{ cursor: 'help' }}>{head.label}</span>
                  </Tooltip>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredLoans.map((loan) => (
              <TableRow key={loan.id} sx={{ '&:hover': { backgroundColor: 'rgba(56, 189, 248, 0.04)' }, '& td': { color: '#cbd5e1', borderBottom: '1px solid rgba(148,163,184,0.07)' } }}>
                <TableCell>{loan.id}</TableCell>
                <TableCell>{loan.client?.id}</TableCell>
                <TableCell sx={{ color: '#e2e8f0', fontWeight: 500 }}>{loan.client?.rut}</TableCell>
                <TableCell>{loan.client?.email}</TableCell>
                <TableCell>{loan.client?.phoneNumber}</TableCell>
                <TableCell sx={{ color: '#f87171', fontWeight: 700 }}>${loan.fineTotal}</TableCell>
                <TableCell>
                  <Button variant="contained" sx={skyButtonStyle} size="small" onClick={() => handleOpenConfirmDialog(loan)}>
                    Marcar Pago
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {!loading && filteredLoans.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ color: "#64748b", py: 8 }}>
                  No se encontraron deudas pendientes.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog 
        open={confirmDialogOpen} 
        onClose={() => setConfirmDialogOpen(false)}
        PaperProps={{ sx: { bgcolor: "#1e293b", border: "1px solid rgba(148, 163, 184, 0.2)", color: "#e2e8f0" } }}
      >
        <DialogTitle sx={{ color: "#38bdf8", fontWeight: 700 }}>Confirmar Regularización</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: "#cbd5e1" }}>
            ¿Confirma que el cliente con RUT <strong>{loanToPay?.client?.rut}</strong> ha cancelado la totalidad de la multa por <strong>${loanToPay?.fineTotal}</strong>?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 3, borderTop: '1px solid rgba(148, 163, 184, 0.1)' }}>
          <Button onClick={() => setConfirmDialogOpen(false)} sx={{ color: "#94a3b8", textTransform: 'none' }}>Cancelar</Button>
          <Button onClick={confirmPayment} variant="contained" sx={skyButtonStyle}>Validar Pago</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={openSnackbar} autoHideDuration={4000} onClose={() => setOpenSnackbar(false)} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
        <Alert severity={severity} variant="filled" sx={{ bgcolor: severity === "success" ? "#0ea5e9" : "#f87171", color: severity === "success" ? "#0f172a" : "white", fontWeight: 700 }}>
          {snackbarMsg}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UnpaidLoansPage;