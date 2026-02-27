import { useEffect, useState } from "react";
import { getLoans } from "../services/loan.service";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Tooltip from "@mui/material/Tooltip";
import Chip from "@mui/material/Chip";
import TextField from "@mui/material/TextField";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

import PageHelp from "../components/PageHelp";

const LoanList = () => {
  const [loans, setLoans] = useState([]);
  const [filteredLoans, setFilteredLoans] = useState([]);
  const [rutFilter, setRutFilter] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getLoans()
      .then(res => {
        setLoans(res.data);
        setFilteredLoans(res.data);
      })
      .catch(err => {
        console.error("Error al cargar préstamos:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const formatRut = (value) => {
    let cleanValue = value.replace(/[^0-9kK]/g, "");
    if (cleanValue.length > 9) cleanValue = cleanValue.slice(0, 9);
    if (cleanValue.length <= 1) return cleanValue;
    let body = cleanValue.slice(0, -1);
    let dv = cleanValue.slice(-1).toUpperCase();
    body = body.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return `${body}-${dv}`;
  };

  useEffect(() => {
    // CORRECCIÓN: Se cambió [^0-9kK] por [^0-9k] ya que usamos la bandera 'i'
    const cleanFilter = rutFilter.replace(/[^0-9k]/gi, "").toLowerCase();
    const filtered = loans.filter(loan => {
      // CORRECCIÓN: Igual aquí, se quitó la 'K' duplicada
      const cleanRut = (loan.client?.rut || "").replace(/[^0-9k]/gi, "").toLowerCase();
      return cleanRut.includes(cleanFilter);
    });
    setFilteredLoans(filtered);
  }, [rutFilter, loans]);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
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
    { label: "ID", tooltip: "Identificador único del registro de préstamo" },
    { label: "Herramienta (id)", tooltip: "Nombre e identificador de la herramienta prestada" },
    { label: "Cliente", tooltip: "Identificador del usuario que solicitó el préstamo" },
    { label: "Inicio", tooltip: "Fecha en que se inició el préstamo" },
    { label: "Fecha límite", tooltip: "Fecha programada para la devolución" },
    { label: "Devuelto", tooltip: "Indica si la herramienta ya fue retornada al inventario" }
  ];

  return (
    <Box sx={{ p: 3, bgcolor: '#0f172a', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      <Backdrop
        sx={{ 
          color: '#38bdf8', 
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: 'rgba(15, 23, 42, 0.9)',
          display: 'flex',
          flexDirection: 'column',
          gap: 2
        }}
        open={loading}
      >
        <CircularProgress color="inherit" />
        <Typography variant="h6" sx={{ color: '#38bdf8' }}>
          Cargando historial de préstamos...
        </Typography>
      </Backdrop>

      <Box display="flex" alignItems="center" gap={1} mb={3}>
        <Typography variant="h4" sx={{ color: "#e2e8f0", fontWeight: 700 }}>
          Listado de Préstamos
        </Typography>
        <PageHelp 
          title="Historial General" 
          steps={[
            "Esta vista muestra el registro histórico de todos los préstamos.",
            "Utilice el buscador para filtrar préstamos por el RUT del cliente.",
            "Incluye tanto los préstamos que están en curso como los ya finalizados.",
            "Pase el cursor sobre los encabezados de la tabla para ver más detalles de cada columna."
          ]} 
        />
      </Box>

      <Box sx={{ mb: 4, p: 3, bgcolor: '#1e293b', borderRadius: 2, border: '1px solid rgba(148, 163, 184, 0.12)', borderTop: "3px solid rgba(56, 189, 248, 0.4)" }}>
        <TextField 
          label="Buscar préstamo por RUT de cliente" 
          variant="outlined" 
          size="small" 
          fullWidth 
          sx={inputSx} 
          value={rutFilter} 
          onChange={(e) => setRutFilter(formatRut(e.target.value))} 
          placeholder="12.345.678-9"
        />
      </Box>

      <TableContainer 
        component={Paper} 
        sx={{ 
          bgcolor: '#1e293b', 
          borderRadius: 2, 
          border: "1px solid rgba(148, 163, 184, 0.1)", 
          boxShadow: "0 4px 24px rgba(0, 0, 0, 0.35)"
        }}
      >
        <Table>
          <TableHead sx={{ backgroundColor: 'rgba(15, 23, 42, 0.8)' }}>
            <TableRow>
              {tableHeaders.map((header) => (
                <TableCell 
                  key={header.label} 
                  sx={{ 
                    color: '#7dd3fc', 
                    fontWeight: 600, 
                    textTransform: 'uppercase',
                    fontSize: '0.75rem',
                    letterSpacing: '0.05em',
                    borderBottom: '2px solid rgba(56, 189, 248, 0.3)' 
                  }}
                >
                  <Tooltip title={header.tooltip} arrow placement="top">
                    <span style={{ cursor: 'help' }}>{header.label}</span>
                  </Tooltip>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredLoans.map(loan => (
              <TableRow 
                key={loan.id} 
                sx={{ 
                  '&:hover': { backgroundColor: 'rgba(56, 189, 248, 0.04)' }, 
                  '& td': { 
                    color: '#cbd5e1', 
                    borderBottom: '1px solid rgba(148, 163, 184, 0.07)' 
                  } 
                }}
              >
                <TableCell>{loan.id}</TableCell>
                <TableCell sx={{ color: '#e2e8f0', fontWeight: 500 }}> {loan.tool?.name} ({loan.tool?.id})</TableCell>
                <TableCell>{loan.client?.rut}</TableCell>
                <TableCell>{formatDate(loan.startDate)}</TableCell>
                <TableCell>{formatDate(loan.scheduledReturnDate)}</TableCell>
                <TableCell>
                  <Chip 
                    label={loan.delivered ? "Sí" : "No"} 
                    size="small"
                    sx={{ 
                      backgroundColor: loan.delivered ? 'rgba(34, 197, 94, 0.1)' : 'rgba(248, 113, 113, 0.1)',
                      color: loan.delivered ? '#4ade80' : '#f87171',
                      fontWeight: 600,
                      fontSize: '0.7rem',
                      border: `1px solid ${loan.delivered ? 'rgba(74, 222, 128, 0.2)' : 'rgba(248, 113, 113, 0.2)'}`
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
            {!loading && filteredLoans.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ color: "#94a3b8", py: 8 }}>
                  No hay registros de préstamos disponibles para ese RUT.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default LoanList;
