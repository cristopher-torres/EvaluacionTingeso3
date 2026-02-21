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
    setLoadingMessage("Cargando multas pendientes...");
    getUnpaidLoans()
      .then(res => {
        setLoans(res.data);
        setFilteredLoans(res.data);
      })
      .catch(err => {
        console.error("Error cargando préstamos:", err);
        showFeedback("Error al cargar la lista", "error");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUnpaidLoans();
  }, []);

  useEffect(() => {
    if (!rutFilter.trim()) {
      setFilteredLoans(loans);
    } else {
      const filtered = loans.filter(loan => 
        loan.client?.rut?.toLowerCase().includes(rutFilter.toLowerCase())
      );
      setFilteredLoans(filtered);
    }
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

  const handleCloseConfirmDialog = () => {
    setConfirmDialogOpen(false);
    setLoanToPay(null);
  };

  const confirmPayment = () => {
    if (!loanToPay) return;
    
    handleCloseConfirmDialog();
    setLoading(true);
    setLoadingMessage("Actualizando estado de pago...");
    
    updateFinePaid(loanToPay.id, true)
      .then(() => {
        showFeedback("Pago registrado exitosamente ✅", "success");
        fetchUnpaidLoans();
      })
      .catch(err => {
        console.error("Error actualizando multa:", err);
        showFeedback("Error al procesar el pago ❌", "error");
      })
      .finally(() => setLoading(false));
  };

  const payButtonStyle = {
    backgroundColor: "rgba(0, 210, 255, 0.1)",
    border: "1px solid rgba(0, 210, 255, 0.4)",
    color: "#00d2ff",
    textTransform: "none",
    fontWeight: "bold",
    outline: "none",
    "&:hover": {
      backgroundColor: "#00d2ff",
      color: "#100524",
      boxShadow: "0 0 15px rgba(0, 210, 255, 0.6)",
    },
    "&:focus": { outline: "none" },
    "&:focusVisible": { outline: "none" },
    "&:disabled": {
      color: "rgba(0, 210, 255, 0.3)",
      borderColor: "rgba(0, 210, 255, 0.1)"
    }
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
  };

  return (
    <Box sx={{ p: 3, bgcolor: '#100524', minHeight: '100vh' }}>
      
      <Backdrop
        sx={{ color: '#00d2ff', zIndex: 10, backgroundColor: 'rgba(16, 5, 36, 0.9)', display: 'flex', flexDirection: 'column', gap: 2 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
        <Typography variant="h6" sx={{ textShadow: "0 0 10px rgba(0, 210, 255, 0.5)" }}>
          {loadingMessage}
        </Typography>
      </Backdrop>

      <Typography variant="h4" sx={{ color: "#00d2ff", fontWeight: "bold", mb: 4, textShadow: "0 0 10px rgba(0, 210, 255, 0.3)" }}>
        Préstamos con Multas No Pagadas
      </Typography>

      <Box sx={{ mb: 4, p: 2, bgcolor: '#1d0b3b', borderRadius: 2, border: '1px solid rgba(232, 28, 255, 0.2)' }}>
        <TextField 
          label="Buscar por RUT" 
          variant="outlined" 
          size="small" 
          fullWidth 
          sx={inputSx} 
          value={rutFilter} 
          onChange={(e) => setRutFilter(e.target.value)} 
          placeholder="Ej: 12.345.678-9"
        />
      </Box>

      <TableContainer component={Paper} sx={{ bgcolor: '#1d0b3b', borderRadius: 2, border: "1px solid rgba(0, 210, 255, 0.3)", boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)" }}>
        <Table>
          <TableHead sx={{ backgroundColor: 'rgba(0, 210, 255, 0.1)' }}>
            <TableRow>
              {["ID Préstamo", "ID Usuario", "RUT", "Email", "Teléfono", "Deuda", "Acción"].map((head) => (
                <TableCell key={head} sx={{ color: '#00d2ff', fontWeight: 'bold', borderBottom: '2px solid #e81cff' }}>{head}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredLoans.map((loan) => (
              <TableRow key={loan.id} sx={{ '&:hover': { backgroundColor: 'rgba(232, 28, 255, 0.05)' }, '& td': { color: '#f1f5f9', borderBottom: '1px solid rgba(255,255,255,0.05)' } }}>
                <TableCell>{loan.id}</TableCell>
                <TableCell>{loan.client?.id}</TableCell>
                <TableCell>{loan.client?.rut}</TableCell>
                <TableCell>{loan.client?.email}</TableCell>
                <TableCell>{loan.client?.phoneNumber}</TableCell>
                <TableCell sx={{ color: '#e81cff', fontWeight: 'bold' }}>${loan.fineTotal}</TableCell>
                <TableCell>
                  <Button variant="contained" sx={payButtonStyle} onClick={() => handleOpenConfirmDialog(loan)} disabled={loading}>
                    Marcar Pago
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {!loading && filteredLoans.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ color: "#b392f0", py: 4 }}>
                  No se encontraron préstamos con multas pendientes que coincidan con la búsqueda.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={confirmDialogOpen}
        onClose={handleCloseConfirmDialog}
        PaperProps={{ sx: { bgcolor: "#1d0b3b", color: "white", border: "1px solid #00d2ff", borderRadius: 2 } }}
      >
        <DialogTitle sx={{ color: "#00d2ff", fontWeight: "bold" }}>Confirmar Pago</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: "white" }}>
            ¿Estás seguro de que deseas marcar como pagada la deuda de <strong>${loanToPay?.fineTotal}</strong> del RUT <strong>{loanToPay?.client?.rut}</strong>?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseConfirmDialog} sx={{ color: "#b392f0", "&:focus": { outline: "none" } }}>Cancelar</Button>
          <Button 
            onClick={confirmPayment} 
            variant="contained" 
            sx={{ bgcolor: "#00d2ff", color: "#100524", fontWeight: "bold", "&:hover": { bgcolor: "#00a8cc" }, "&:focus": { outline: "none" } }}
          >
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert 
          onClose={() => setOpenSnackbar(false)} 
          severity={severity} 
          variant="filled" 
          sx={{ bgcolor: severity === "success" ? "#00d2ff" : "#f44336", color: severity === "success" ? "#100524" : "white", fontWeight: "bold" }}
        >
          {snackbarMsg}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UnpaidLoansPage;