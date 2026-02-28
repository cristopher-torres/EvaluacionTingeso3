import { useEffect, useState, useRef } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import Tooltip from '@mui/material/Tooltip';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import 'dayjs/locale/es';
import { getOverdueLoans, getOverdueLoansByDate } from '../services/loan.service';
import PageHelp from '../components/PageHelp';

const skyButtonStyle = {
  backgroundColor: 'rgba(56, 189, 248, 0.07)',
  border: '1px solid rgba(56, 189, 248, 0.2)',
  color: '#7dd3fc',
  textTransform: 'none',
  fontWeight: 600,
  outline: 'none',
  '&:hover': {
    backgroundColor: 'rgba(56, 189, 248, 0.14)',
    border: '1px solid rgba(56, 189, 248, 0.4)',
    color: '#e2e8f0',
  },
  '&:disabled': {
    color: 'rgba(148, 163, 184, 0.3)',
    borderColor: 'rgba(148, 163, 184, 0.1)',
  },
};

const inputSx = {
  '& .MuiOutlinedInput-root': {
    color: '#e2e8f0',
    '& fieldset': { borderColor: 'rgba(148, 163, 184, 0.12)' },
    '&:hover fieldset': { borderColor: 'rgba(56, 189, 248, 0.4)' },
    '&.Mui-focused fieldset': { borderColor: '#38bdf8' },
    cursor: 'pointer',
  },
  '& .MuiInputBase-input': {
    cursor: 'pointer',
    caretColor: 'transparent',
    userSelect: 'none',
    pointerEvents: 'none',
  },
  '& .MuiInputLabel-root': { color: '#94a3b8' },
  '& .MuiInputLabel-root.Mui-focused': { color: '#38bdf8' },
  '& .MuiIconButton-root': { color: '#38bdf8' },
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
    '&.MuiPickersDay-today': { border: '1px solid rgba(56, 189, 248, 0.3)' },
  },
  '& .MuiDayCalendar-weekDayLabel': { color: '#94a3b8' },
};

const tableHeaders = [
  { label: 'ID Cliente', tooltip: 'Identificador único del cliente con atraso' },
  { label: 'Nombre', tooltip: 'Nombre completo del cliente' },
  { label: 'Correo', tooltip: 'Dirección de correo electrónico de contacto' },
  { label: 'Teléfono', tooltip: 'Número de teléfono de contacto del cliente' },
  { label: 'ID Préstamo', tooltip: 'Identificador del préstamo que se encuentra atrasado' },
];

const ReportLateClient = () => {
  const [loans, setLoans] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [startDateOpen, setStartDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);
  const filterBtnRef = useRef(null);

  const fetchAllLateLoans = () => {
    setLoading(true);
    setLoadingMessage('Generando reporte de atrasos...');
    getOverdueLoans()
      .then((res) => setLoans(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  const fetchLateLoansByDate = () => {
    if (!startDate || !endDate) return;
    setLoading(true);
    const startStr = startDate.format('YYYY-MM-DD');
    const endStr = endDate.format('YYYY-MM-DD');
    setLoadingMessage('Filtrando atrasos...');
    getOverdueLoansByDate(startStr, endStr)
      .then((res) => setLoans(res.data))
      .catch((err) => console.error(err))
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

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
      <Box sx={{ p: 3, bgcolor: '#0f172a', minHeight: '100vh' }}>
        <Backdrop
          sx={{
            color: '#38bdf8',
            zIndex: 1201,
            backgroundColor: 'rgba(15, 23, 42, 0.9)',
          }}
          open={loading}
        >
          <CircularProgress color="inherit" />
          <Typography variant="h6" sx={{ mt: 2, color: '#38bdf8' }}>
            {loadingMessage}
          </Typography>
        </Backdrop>

        <Box display="flex" alignItems="center" gap={1} mb={4}>
          <Typography variant="h4" sx={{ color: '#e2e8f0', fontWeight: 700 }}>
            Préstamos Atrasados
          </Typography>
          <PageHelp
            title="Reporte de Atrasos"
            steps={[
              'Lista de clientes que no han devuelto herramientas en la fecha estipulada.',
              'Filtre por rango de fechas para acotar el reporte.',
              'Utilice los datos de contacto para la gestión de cobranza.',
            ]}
          />
        </Box>

        <Box
          sx={{
            p: 3,
            mb: 3,
            bgcolor: '#1e293b',
            borderRadius: 2,
            border: '1px solid rgba(148, 163, 184, 0.12)',
            borderTop: '3px solid rgba(56, 189, 248, 0.4)',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="overline" sx={{ color: '#38bdf8', fontWeight: 600 }}>
                Filtros
              </Typography>
              <DatePicker
                enableAccessibleFieldDOMStructure={false}
                label="Desde"
                value={startDate}
                open={startDateOpen}
                onOpen={() => setStartDateOpen(true)}
                onClose={() => setStartDateOpen(false)}
                onChange={setStartDate}
                onAccept={() => {
                  setStartDateOpen(false);
                  setEndDateOpen(true);
                }}
                format="DD/MM/YYYY"
                slotProps={{
                  popper: { sx: popperSx },
                  textField: {
                    size: 'small',
                    sx: inputSx,
                    onClick: () => setStartDateOpen(true),
                    InputProps: { readOnly: true },
                  },
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
                onAccept={() => {
                  setEndDateOpen(false);
                  setTimeout(() => filterBtnRef.current?.focus(), 100);
                }}
                format="DD/MM/YYYY"
                slotProps={{
                  popper: { sx: popperSx },
                  textField: {
                    size: 'small',
                    sx: inputSx,
                    onClick: () => setEndDateOpen(true),
                    InputProps: { readOnly: true },
                  },
                }}
              />
              <Button
                variant="contained"
                ref={filterBtnRef}
                onClick={fetchLateLoansByDate}
                startIcon={<FilterAltIcon />}
                sx={skyButtonStyle}
                disabled={!startDate || !endDate || loading}
              >
                Filtrar
              </Button>
            </Box>
            <Divider orientation="vertical" flexItem sx={{ bgcolor: 'rgba(148, 163, 184, 0.1)' }} />
            <Button
              onClick={resetFilters}
              startIcon={<DeleteSweepIcon />}
              sx={{
                ml: 'auto',
                color: '#f87171',
                fontWeight: 600,
                textTransform: 'none',
                border: '1px dashed rgba(248, 113, 113, 0.3)',
                px: 2,
                '&:hover': {
                  bgcolor: 'rgba(248, 113, 113, 0.08)',
                  borderColor: '#f87171',
                },
              }}
            >
              Limpiar
            </Button>
          </Box>
        </Box>

        <TableContainer
          component={Paper}
          sx={{
            bgcolor: '#1e293b',
            borderRadius: 2,
            border: '1px solid rgba(148, 163, 184, 0.12)',
            boxShadow: '0 4px 24px rgba(0, 0, 0, 0.35)',
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
              {loans.map((loan) => (
                <TableRow
                  key={loan.id}
                  sx={{
                    '&:hover': { backgroundColor: 'rgba(56, 189, 248, 0.04)' },
                    '& td': {
                      color: '#cbd5e1',
                      borderBottom: '1px solid rgba(148, 163, 184, 0.07)',
                    },
                  }}
                >
                  <TableCell>{loan.client.id}</TableCell>
                  <TableCell sx={{ color: '#e2e8f0', fontWeight: 500 }}>
                    {loan.client.name}
                  </TableCell>
                  <TableCell>{loan.client.email}</TableCell>
                  <TableCell>{loan.client.phoneNumber}</TableCell>
                  <TableCell sx={{ color: '#f87171', fontWeight: 600 }}>
                    {loan.id}
                  </TableCell>
                </TableRow>
              ))}
              {!loading && loans.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ color: '#64748b', py: 8 }}>
                    No hay registros de préstamos atrasados actualmente.
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