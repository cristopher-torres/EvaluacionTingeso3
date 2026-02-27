import { useEffect, useState, useRef } from "react";
import { getTopToolsByDate, getTopToolsAllTime } from "../services/loan.service";
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
import Divider from "@mui/material/Divider";
import Tooltip from "@mui/material/Tooltip";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import 'dayjs/locale/es';
import PageHelp from "../components/PageHelp";

const ToolListRanking = () => {
  const [tools, setTools] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [startDateOpen, setStartDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);
  const filterBtnRef = useRef(null);

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
    setLoadingMessage(`Generando ranking...`);
    getTopToolsByDate(startDate.format('YYYY-MM-DD'), endDate.format('YYYY-MM-DD'))
      .then(res => setTools(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  const resetFilters = () => {
    setStartDate(null);
    setEndDate(null);
    fetchAllTools();
  };

  useEffect(() => {
    fetchAllTools();
  }, []);

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
    "& .MuiInputBase-input": { cursor: "pointer", caretColor: "transparent", userSelect: "none", pointerEvents: "none" },
    "& .MuiInputLabel-root": { color: "#94a3b8" },
    "& .MuiInputLabel-root.Mui-focused": { color: "#38bdf8" },
    "& .MuiIconButton-root": { color: "#38bdf8" }
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
      '&.Mui-selected': { backgroundColor: '#0ea5e9', color: '#0f172a', '&:hover': { backgroundColor: '#38bdf8' } },
      '&.MuiPickersDay-today': { border: '1px solid rgba(56, 189, 248, 0.3)' }
    },
    '& .MuiDayCalendar-weekDayLabel': { color: '#94a3b8' }
  };

  const tableHeaders = [
    { label: "Nombre Herramienta", tooltip: "Nombre de la herramienta" },
    { label: "Veces Prestada", tooltip: "Frecuencia o cantidad de veces que ha sido solicitada" }
  ];

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
      <Box sx={{ p: 3, bgcolor: '#0f172a', minHeight: '100vh' }}>
        <Backdrop sx={{ display: 'flex', flexDirection: 'column', color: '#38bdf8', zIndex: 1201, backgroundColor: 'rgba(15, 23, 42, 0.9)' }} open={loading}>
          <CircularProgress color="inherit" />
          <Typography variant="h6" sx={{ mt: 2, color: '#38bdf8' }}>{loadingMessage}</Typography>
        </Backdrop>

        <Box display="flex" alignItems="center" gap={1} mb={4}>
          <Typography variant="h4" sx={{ color: "#e2e8f0", fontWeight: 700 }}>
            Ranking de Herramientas
          </Typography>
          <PageHelp 
            title="Estadísticas de Préstamos" 
            steps={[
              "Ranking ordenado por frecuencia de préstamo.",
              "Muestra por defecto el historial completo.",
              "Use los filtros para analizar periodos específicos."
            ]} 
          />
        </Box>

        <Box sx={{ p: 3, mb: 3, bgcolor: '#1e293b', borderRadius: 2, border: '1px solid rgba(148, 163, 184, 0.12)', borderTop: "3px solid rgba(56, 189, 248, 0.4)", display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="overline" sx={{ color: '#38bdf8', fontWeight: 600 }}>Periodo</Typography>
              
              <DatePicker
                enableAccessibleFieldDOMStructure={false}
                label="Desde"
                value={startDate}
                open={startDateOpen}
                onOpen={() => setStartDateOpen(true)}
                onClose={() => setStartDateOpen(false)}
                onChange={setStartDate}
                onAccept={() => { setStartDateOpen(false); setEndDateOpen(true); }}
                format="DD/MM/YYYY"
                slotProps={{ 
                  popper: { sx: popperSx },
                  textField: {
                    size: "small",
                    sx: inputSx,
                    onClick: () => setStartDateOpen(true),
                    InputProps: { readOnly: true }
                  }
                }}
              />
              
              <DatePicker
                enableAccessibleFieldDOMStructure={false}
                label="Hasta"
                value={endDate}
                minDate={startDate || undefined}
                open={endDateOpen}
                onOpen={() => setEndDateOpen(true)}
                onClose={() => setEndDateOpen(false)}
                onChange={setEndDate}
                onAccept={() => { setEndDateOpen(false); setTimeout(() => filterBtnRef.current?.focus(), 100); }}
                format="DD/MM/YYYY"
                slotProps={{ 
                  popper: { sx: popperSx },
                  textField: {
                    size: "small",
                    sx: inputSx,
                    onClick: () => setEndDateOpen(true),
                    InputProps: { readOnly: true }
                  }
                }}
              />
              
              <Button variant="contained" ref={filterBtnRef} onClick={fetchToolsByDate} startIcon={<FilterAltIcon />} sx={skyButtonStyle} disabled={!startDate || !endDate || loading}>
                Filtrar
              </Button>
            </Box>
            <Divider orientation="vertical" flexItem sx={{ bgcolor: 'rgba(148, 163, 184, 0.1)' }} />
            <Button onClick={resetFilters} startIcon={<DeleteSweepIcon />} sx={{ ml: 'auto', color: '#f87171', fontWeight: 600, textTransform: 'none', border: '1px dashed rgba(248, 113, 113, 0.3)', px: 2, "&:hover": { bgcolor: 'rgba(248, 113, 113, 0.08)', borderColor: '#f87171' } }}>
              Limpiar Ranking
            </Button>
          </Box>
        </Box>

        <TableContainer component={Paper} sx={{ bgcolor: '#1e293b', borderRadius: 2, border: "1px solid rgba(148, 163, 184, 0.1)", boxShadow: "0 4px 24px rgba(0, 0, 0, 0.35)" }}>
          <Table>
            <TableHead sx={{ backgroundColor: 'rgba(15, 23, 42, 0.8)' }}>
              <TableRow>
                {tableHeaders.map((h) => (
                  <TableCell key={h.label} sx={{ color: '#7dd3fc', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em', borderBottom: '2px solid rgba(56, 189, 248, 0.3)' }}>
                    <Tooltip title={h.tooltip} arrow placement="top">
                      <span style={{ cursor: 'help' }}>{h.label}</span>
                    </Tooltip>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {tools.map((tool, index) => {
                // Generamos una key única usando el nombre de la herramienta y el índice como respaldo
                const uniqueKey = tool[0] ? `tool-ranking-${tool[0].replace(/\s+/g, '-').toLowerCase()}-${index}` : `ranking-item-${index}`;
                
                return (
                  <TableRow key={uniqueKey} sx={{ '&:hover': { backgroundColor: 'rgba(56, 189, 248, 0.04)' }, '& td': { color: '#cbd5e1', borderBottom: '1px solid rgba(148, 163, 184, 0.07)' } }}>
                    <TableCell sx={{ fontWeight: 600, color: '#e2e8f0 !important' }}>{tool[0]}</TableCell> 
                    <TableCell sx={{ color: '#38bdf8 !important', fontWeight: 700 }}>{tool[1]}</TableCell> 
                  </TableRow>
                );
              })}
              {!loading && tools.length === 0 && (
                <TableRow>
                  <TableCell colSpan={2} align="center" sx={{ color: "#64748b", py: 8 }}>
                    Sin datos para el periodo seleccionado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </LocalizationProvider>
  );
};

export default ToolListRanking;