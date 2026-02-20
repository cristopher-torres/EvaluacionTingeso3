import { useEffect, useState } from "react";
import { getTopToolsByDate, getTopToolsAllTime } from "../services/loan.service";
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

const ToolListRanking = () => {
  const [tools, setTools] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");

  const fetchAllTools = () => {
    setLoading(true);
    setLoadingMessage("Generando ranking histórico...");
    getTopToolsAllTime()
      .then(res => setTools(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  const fetchToolsByDate = () => {
    if (!startDate || !endDate) return;
    setLoading(true);
    setLoadingMessage(`Generando ranking desde ${startDate} hasta ${endDate}...`);
    getTopToolsByDate(startDate, endDate)
      .then(res => setTools(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAllTools();
  }, []);

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
      
      <Backdrop
        sx={{ 
          color: '#00d2ff', 
          zIndex: 10, 
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
        Ranking de Herramientas Más Prestadas
      </Typography>

      <Box display="flex" gap={2} mb={4} sx={{ p: 3, bgcolor: '#1d0b3b', borderRadius: 2, border: '1px solid rgba(232, 28, 255, 0.2)', alignItems: 'center' }}>
        <TextField
          type="date" label="Desde" InputLabelProps={{ shrink: true }}
          value={startDate} onChange={(e) => setStartDate(e.target.value)} sx={inputSx}
        />
        <TextField
          type="date" label="Hasta" InputLabelProps={{ shrink: true }}
          value={endDate} onChange={(e) => setEndDate(e.target.value)} sx={inputSx}
        />
        <Button 
          variant="contained" 
          sx={cyanButtonStyle} 
          onClick={fetchToolsByDate}
          disabled={!startDate || !endDate || loading}
        >
          Filtrar por fechas
        </Button>
        <Button 
          variant="contained" 
          sx={cyanButtonStyle} 
          onClick={fetchAllTools}
          disabled={loading}
        >
          Ver todos
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ bgcolor: '#1d0b3b', borderRadius: 2, border: "1px solid rgba(0, 210, 255, 0.3)", boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)" }}>
        <Table>
          <TableHead sx={{ backgroundColor: 'rgba(0, 210, 255, 0.1)' }}>
            <TableRow>
              <TableCell sx={{ color: '#00d2ff', fontWeight: 'bold', borderBottom: '2px solid #e81cff' }}>
                Nombre Herramienta
              </TableCell>
              <TableCell sx={{ color: '#00d2ff', fontWeight: 'bold', borderBottom: '2px solid #e81cff' }}>
                Veces Prestada
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tools.map((tool, index) => (
              <TableRow key={index} sx={{ '&:hover': { backgroundColor: 'rgba(232, 28, 255, 0.05)' }, '& td': { color: '#f1f5f9', borderBottom: '1px solid rgba(255,255,255,0.05)' } }}>
                <TableCell sx={{ fontWeight: 'bold' }}>{tool[0]}</TableCell> 
                <TableCell sx={{ color: '#e81cff', fontWeight: 'bold' }}>{tool[1]}</TableCell> 
              </TableRow>
            ))}
            {!loading && tools.length === 0 && (
              <TableRow>
                <TableCell colSpan={2} align="center" sx={{ color: "#b392f0", py: 4 }}>
                  No hay datos disponibles para el ranking.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ToolListRanking;
