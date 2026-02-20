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

const UnpaidLoansPage = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");
  const [severity, setSeverity] = useState("success");

  const fetchUnpaidLoans = () => {
    setLoading(true);
    setLoadingMessage("Cargando multas pendientes...");
    getUnpaidLoans()
      .then(res => setLoans(res.data))
      .catch(err => {
        console.error("Error cargando préstamos:", err);
        showFeedback("Error al cargar la lista", "error");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUnpaidLoans();
  }, []);

  const showFeedback = (msg, type) => {
    setSnackbarMsg(msg);
    setSeverity(type);
    setOpenSnackbar(true);
  };

  const handleMarkPaid = (loanId) => {
    setLoading(true);
    setLoadingMessage("Actualizando estado de pago...");
    updateFinePaid(loanId, true)
      .then(() => {
        showFeedback("Pago registrado exitosamente ✅", "success");
        fetchUnpaidLoans();
      })
      .catch(err => {
        console.error("Error actualizando multa:", err);
        showFeedback("Error al procesar el pago ❌", "error");
        setLoading(false);
      });
  };

  const payButtonStyle = {
    backgroundColor: "rgba(0, 210, 255, 0.1)",
    border: "1px solid rgba(0, 210, 255, 0.4)",
    color: "#00d2ff",
    textTransform: "none",
    fontWeight: "bold",
    "&:hover": {
      backgroundColor: "#00d2ff",
      color: "#100524",
      boxShadow: "0 0 15px rgba(0, 210, 255, 0.6)",
    },
    "&:disabled": {
      color: "rgba(0, 210, 255, 0.3)",
      borderColor: "rgba(0, 210, 255, 0.1)"
    }
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
            {loans.map((loan) => (
              <TableRow key={loan.id} sx={{ '&:hover': { backgroundColor: 'rgba(232, 28, 255, 0.05)' }, '& td': { color: '#f1f5f9', borderBottom: '1px solid rgba(255,255,255,0.05)' } }}>
                <TableCell>{loan.id}</TableCell>
                <TableCell>{loan.client?.id}</TableCell>
                <TableCell>{loan.client?.rut}</TableCell>
                <TableCell>{loan.client?.email}</TableCell>
                <TableCell>{loan.client?.phoneNumber}</TableCell>
                <TableCell sx={{ color: '#e81cff', fontWeight: 'bold' }}>${loan.fineTotal}</TableCell>
                <TableCell>
                  <Button variant="contained" sx={payButtonStyle} onClick={() => handleMarkPaid(loan.id)} disabled={loading}>
                    Marcar Pago
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {!loading && loans.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ color: "#b392f0", py: 4 }}>No hay préstamos con multas pendientes.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

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