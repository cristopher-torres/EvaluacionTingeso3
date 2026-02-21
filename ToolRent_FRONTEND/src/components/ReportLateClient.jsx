import { useEffect, useState, useRef } from "react";
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
import Divider from "@mui/material/Divider";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import FilterAltIcon from "@mui/icons-material/FilterAlt";

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import 'dayjs/locale/es';

const ReportLateClient = () => {
  const [loans, setLoans] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");

  const [startDateOpen, setStartDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);
  const filterBtnRef = useRef(null);

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
    const startStr = startDate.format('YYYY-MM-DD');
    const endStr = endDate.format('YYYY-MM-DD');
    setLoadingMessage(`Filtrando atrasos desde ${startStr} hasta ${endStr}...`);
    getOverdueLoansByDate(startStr, endStr)
      .then(res => setLoans(res.data))
      .catch(err => console.error("Error cargando préstamos por fecha:", err))
      .finally(() => setLoading(false));
  };

  const resetFilters = () => {
    setStartDate(null);
    setEndDate(null);
    fetchAllLateLoans();
  };

  useEffect(() => {
    fetchAllLateLoans();
  }, []);

  const cyanButtonStyle = {
    backgroundColor: "rgba(0, 210, 255, 0.1)",
    border: "1px solid rgba(0, 210, 255, 0.4)",
    color: "#00d2ff",
    textTransform: "none",
    fontWeight: "bold",
    outline: "none",
    "&:hover": {
      backgroundColor: "#00d2ff",
      color: "#100524",
      boxShadow: "0 0 15px rgba(0, 210, 255, 0.5)"
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

              <Button 
                variant="contained" ref={filterBtnRef} onClick={fetchLateLoansByDate}
                startIcon={<FilterAltIcon />} sx={cyanButtonStyle} disabled={!startDate || !endDate || loading}
              >
                Filtrar Rango
              </Button>
            </Box>

            <Divider orientation="vertical" flexItem sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />

            <Button 
              onClick={resetFilters} startIcon={<DeleteSweepIcon />}
              sx={{ ml: 'auto', color: '#ff1744', fontWeight: 'bold', border: '1px dashed #ff1744', "&:hover": { bgcolor: 'rgba(255,23,68,0.1)' }, "&:focus": { outline: "none" }, "&:focusVisible": { outline: "none" } }}
            >
              Limpiar Filtros
            </Button>
          </Box>
        </Box>

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
    </LocalizationProvider>
  );
};

export default ReportLateClient;