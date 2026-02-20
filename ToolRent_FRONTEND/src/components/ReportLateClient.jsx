import { useEffect, useState } from "react";
import { getOverdueLoans, getOverdueLoansByDate } from "../services/loan.service";
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

const ReportLateClient = () => {
  const [loans, setLoans] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");

  const fetchAllLateLoans = () => {
    setLoading(true);
    setLoadingMessage("Generando reporte de todos los atrasos...");
    getOverdueLoans()
      .then(res => setLoans(res.data))
      .catch(err => console.error("Error cargando préstamos:", err))
      .finally(() => setLoading(false));
  };

  const fetchLateLoansByDate = () => {
    if (!startDate || !endDate) return;
    setLoading(true);
    setLoadingMessage(`Filtrando atrasos desde ${startDate} hasta ${endDate}...`);
    getOverdueLoansByDate(startDate, endDate)
      .then(res => setLoans(res.data))
      .catch(err => console.error("Error cargando préstamos por fecha:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAllLateLoans();
  }, []);

  // Estilo base para botones cian neón
  const cyanButtonStyle = {
    backgroundColor: "rgba(0, 210, 255, 0.1)",
    border: "1px solid rgba(0, 210, 255, 0.4)",
    color: "#00d2ff",
    textTransform: "none",
    fontWeight: "bold",
    "&:hover": {
      backgroundColor: "#00d2ff",
      color: "#100524",
      boxShadow: "0 0 15px rgba(0, 210, 255, 0.5)"
    },
    "&:disabled": {
      color: "rgba(0, 210, 255, 0.3)",
      borderColor: "rgba(0, 210, 255, 0.1)"
    }
  };

  // Estilo para inputs neón
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
      cursor: "pointer"
    }
  };

  return (
    <Box sx={{ p: 3, bgcolor: '#100524', minHeight: '100vh' }}>
      
      {/* INDICADOR DE CARGA (Heurística #1) */}
      <Backdrop
        sx={{ 
          color: '#00d2ff', 
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: 'rgba(16, 5, 36, 0.9)',
          display: 'flex',
          flexDirection: 'column',
          gap: 2
        }}
        open={loading}
      >
        <CircularProgress color="inherit" />
        <Typography variant="h6" sx={{ textShadow: "0 0 10px rgba(0, 210, 255, 0.5)" }}>
          {loadingMessage}
        </Typography>
      </Backdrop>

      <Typography variant="h4" sx={{ color: "#00d2ff", fontWeight: "bold", mb: 4, textShadow: "0 0 10px rgba(0, 210, 255, 0.3)" }}>
        Préstamos Atrasados
      </Typography>

      {/* Panel de Filtros */}
      <Box 
        display="flex" 
        gap={2} 
        mb={4} 
        sx={{ 
          p: 3, 
          bgcolor: '#1d0b3b', 
          borderRadius: 2, 
          border: '1px solid rgba(232, 28, 255, 0.2)',
          alignItems: 'center' 
        }}
      >
        <TextField
          type="date"
          label="Desde"
          InputLabelProps={{ shrink: true }}
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          sx={inputSx}
          disabled={loading}
        />
        <TextField
          type="date"
          label="Hasta"
          InputLabelProps={{ shrink: true }}
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          sx={inputSx}
          disabled={loading}
        />
        <Button 
          variant="contained" 
          sx={cyanButtonStyle} 
          onClick={fetchLateLoansByDate}
          disabled={loading || !startDate || !endDate}
        >
          Filtrar por fechas
        </Button>
        <Button 
          variant="contained" 
          sx={cyanButtonStyle} 
          onClick={fetchAllLateLoans}
          disabled={loading}
        >
          Ver todos
        </Button>
      </Box>

      {/* Tabla de Reporte */}
      <TableContainer 
        component={Paper} 
        sx={{ 
          bgcolor: '#1d0b3b', 
          borderRadius: 2, 
          border: "1px solid rgba(0, 210, 255, 0.3)",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)"
        }}
      >
        <Table>
          <TableHead sx={{ backgroundColor: 'rgba(0, 210, 255, 0.1)' }}>
            <TableRow>
              {["ID Cliente", "Nombre", "Correo", "Teléfono", "ID Préstamo"].map((head) => (
                <TableCell 
                  key={head} 
                  sx={{ 
                    color: '#00d2ff', 
                    fontWeight: 'bold', 
                    borderBottom: '2px solid #e81cff' 
                  }}
                >
                  {head}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loans.map(loan => (
              <TableRow 
                key={loan.id} 
                sx={{ 
                  '&:hover': { backgroundColor: 'rgba(232, 28, 255, 0.05)' },
                  '& td': { color: '#f1f5f9', borderBottom: '1px solid rgba(255,255,255,0.05)' } 
                }}
              >
                <TableCell>{loan.client.id}</TableCell>
                <TableCell>{loan.client.name}</TableCell>
                <TableCell>{loan.client.email}</TableCell>
                <TableCell>{loan.client.phoneNumber}</TableCell>
                <TableCell sx={{ color: '#e81cff', fontWeight: 'bold' }}>{loan.id}</TableCell>
              </TableRow>
            ))}
            {!loading && loans.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ color: "#b392f0", py: 4 }}>
                  No hay clientes con atrasos en devolución de préstamos.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ReportLateClient;
