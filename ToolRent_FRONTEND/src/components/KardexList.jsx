import React, { useState, useEffect, useRef } from "react";
import { getMovementsByTool, getMovementsByDateRange, getAllMovements } from "../services/kardex.service";
import toolService from "../services/tool.service";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import Tooltip from "@mui/material/Tooltip";
import Chip from "@mui/material/Chip";
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import 'dayjs/locale/es';
import PageHelp from "../components/PageHelp";

const KardexList = () => {
    const [tools, setTools] = useState([]);
    const [selectedTool, setSelectedTool] = useState(null);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [movements, setMovements] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState("");

    const [startDateOpen, setStartDateOpen] = useState(false);
    const [endDateOpen, setEndDateOpen] = useState(false);
    const dateBtnRef = useRef(null);

    const loadInitialData = () => {
        setLoading(true);
        setLoadingMessage("Cargando historial de movimientos...");
        Promise.all([toolService.getAll(), getAllMovements()])
            .then(([toolsRes, movementsRes]) => {
                setTools(toolsRes.data);
                setMovements(movementsRes.data);
            })
            .catch(() => setError("Error al conectar con el servidor"))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        loadInitialData();
    }, []);

    const handleApplyFilters = () => {
        setLoading(true);
        setLoadingMessage("Aplicando filtros...");
        const hasDates = startDate && endDate;
        const hasTool = selectedTool !== null;

        if (hasTool && hasDates) {
            const startStr = startDate.format('YYYY-MM-DD');
            const endStr = endDate.format('YYYY-MM-DD');
            getMovementsByDateRange(`${startStr}T00:00:00`, `${endStr}T23:59:59`)
                .then(res => {
                    const filtered = res.data.filter(m => m.toolId === selectedTool.id);
                    setMovements(filtered);
                    setError("");
                })
                .finally(() => setLoading(false));
        } else if (hasTool) {
            getMovementsByTool(selectedTool.id)
                .then(res => {
                    setMovements(res.data);
                    setError("");
                })
                .finally(() => setLoading(false));
        } else if (hasDates) {
            const startStr = startDate.format('YYYY-MM-DD');
            const endStr = endDate.format('YYYY-MM-DD');
            getMovementsByDateRange(`${startStr}T00:00:00`, `${endStr}T23:59:59`)
                .then(res => {
                    setMovements(res.data);
                    setError("");
                })
                .finally(() => setLoading(false));
        } else {
            loadInitialData();
        }
    };

    const resetFilters = () => {
        setSelectedTool(null);
        setStartDate(null);
        setEndDate(null);
        loadInitialData();
    };

    const getChipStyles = (type) => {
        switch (type?.toUpperCase()) {
            case 'DEVOLUCION':
            case 'INGRESO':
                return { bg: 'rgba(34, 197, 94, 0.1)', color: '#4ade80', border: 'rgba(34, 197, 94, 0.25)' };
            case 'BAJA':
            case 'SALIDA':
                return { bg: 'rgba(248, 113, 113, 0.1)', color: '#f87171', border: 'rgba(248, 113, 113, 0.25)' };
            case 'PRESTAMO':
            case 'REPARACION':
                return { bg: 'rgba(251, 191, 36, 0.1)', color: '#fbbf24', border: 'rgba(251, 191, 36, 0.25)' };
            default:
                return { bg: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', border: 'rgba(56, 189, 248, 0.25)' };
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
        "& .MuiSvgIcon-root": { color: "#38bdf8" }
    };

    const dateInputSx = {
        "& .MuiOutlinedInput-root": {
            color: "#e2e8f0",
            "& fieldset": { borderColor: "rgba(148, 163, 184, 0.12)" },
            "&:hover fieldset": { borderColor: "rgba(56, 189, 248, 0.4)" },
            "&.Mui-focused fieldset": { borderColor: "#38bdf8" },
            cursor: "pointer"
        },
        "& .MuiInputBase-input": { cursor: "pointer", caretColor: "transparent", userSelect: "none", pointerEvents: "none" },
        "& .MuiInputLabel-root": { color: "#94a3b8", pointerEvents: "none" },
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
        }
    };

    const tableHeaders = [
        { label: "ID", tooltip: "Identificador único del movimiento" },
        { label: "RUT Usuario", tooltip: "RUT del usuario asociado al movimiento" },
        { label: "Cantidad", tooltip: "Cantidad de herramientas involucradas" },
        { label: "Tipo", tooltip: "Clasificación del movimiento en el kardex" },
        { label: "Fecha / Hora", tooltip: "Momento exacto en que se registró el movimiento" }
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
                        Kardex de Herramientas
                    </Typography>
                    <PageHelp 
                        title="Historial de Movimientos" 
                        steps={[
                            "Seleccione una herramienta para ver su historial específico.",
                            "Use las fechas para acotar la búsqueda a un período exacto.",
                            "Puede combinar ambos filtros o usarlos de forma individual."
                        ]} 
                    />
                </Box>

                <Box sx={{ display: 'flex', gap: 2, mb: 3, p: 3, bgcolor: '#1e293b', borderRadius: 2, border: '1px solid rgba(148, 163, 184, 0.12)', borderTop: "3px solid rgba(56, 189, 248, 0.4)", alignItems: 'center', flexWrap: 'wrap' }}>
                    <Autocomplete
                        options={tools}
                        getOptionLabel={(o) => `${o.id}. ${o.name}`}
                        value={selectedTool}
                        onChange={(e, v) => setSelectedTool(v)}
                        sx={{ minWidth: 280, ...inputSx }}
                        renderInput={(p) => (
                            <TextField 
                                {...p} 
                                size="small"
                                label="Filtrar por Herramienta" 
                                InputProps={{
                                    ...p.InputProps,
                                    endAdornment: (
                                        <>
                                            <Tooltip title="Filtre todos los movimientos de una herramienta en particular" arrow placement="top">
                                                <HelpOutlineIcon sx={{ color: "#94a3b8", fontSize: "1.1rem", mr: 1, cursor: "help" }} />
                                            </Tooltip>
                                            {p.InputProps.endAdornment}
                                        </>
                                    ),
                                }}
                            />
                        )}
                        slotProps={{ paper: { sx: { bgcolor: "#1e293b", color: "#e2e8f0", border: "1px solid rgba(56, 189, 248, 0.2)" } } }}
                    />

                    <Divider orientation="vertical" flexItem sx={{ bgcolor: 'rgba(148, 163, 184, 0.1)' }} />

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
                        onAccept={() => { setStartDateOpen(false); setEndDateOpen(true); }}
                        format="DD/MM/YYYY"
                        slots={{
                            textField: (params) => (
                                <TextField {...params} size="small" sx={dateInputSx} onClick={() => setStartDateOpen(true)} inputProps={{ ...params.inputProps, value: startDate ? startDate.format("DD/MM/YYYY") : "", readOnly: true }} />
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
                        onChange={setEndDate}
                        onAccept={() => { setEndDateOpen(false); setTimeout(() => dateBtnRef.current?.focus(), 100); }}
                        format="DD/MM/YYYY"
                        slots={{
                            textField: (params) => (
                                <TextField {...params} size="small" sx={dateInputSx} onClick={() => setEndDateOpen(true)} inputProps={{ ...params.inputProps, value: endDate ? endDate.format("DD/MM/YYYY") : "", readOnly: true }} />
                            )
                        }}
                        slotProps={{ popper: { sx: popperSx } }}
                    />

                    <Button variant="contained" ref={dateBtnRef} onClick={handleApplyFilters} sx={skyButtonStyle}>
                        Aplicar Filtros
                    </Button>

                    <Button onClick={resetFilters} startIcon={<DeleteSweepIcon />} sx={{ ml: 'auto', color: '#f87171', fontWeight: 600, textTransform: 'none', border: '1px dashed rgba(248, 113, 113, 0.3)', px: 2, "&:hover": { bgcolor: 'rgba(248, 113, 113, 0.08)', borderColor: '#f87171' } }}>
                        Limpiar
                    </Button>
                </Box>

                {error && <Typography sx={{ color: "#f87171", mb: 2, fontWeight: 600 }}>{error}</Typography>}

                <Box sx={{ display: 'flex', gap: 3, mb: 2, px: 1, flexWrap: 'wrap' }}>
                    <Box display="flex" alignItems="center" gap={1}>
                        <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#4ade80', boxShadow: '0 0 8px rgba(74, 222, 128, 0.4)' }} />
                        <Typography variant="body2" sx={{ color: '#cbd5e1', fontWeight: 500 }}>Aumento en el stock</Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1}>
                        <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#fbbf24', boxShadow: '0 0 8px rgba(251, 191, 36, 0.4)' }} />
                        <Typography variant="body2" sx={{ color: '#cbd5e1', fontWeight: 500 }}>Baja momentánea de stock</Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1}>
                        <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#f87171', boxShadow: '0 0 8px rgba(248, 113, 113, 0.4)' }} />
                        <Typography variant="body2" sx={{ color: '#cbd5e1', fontWeight: 500 }}>Baja en el stock</Typography>
                    </Box>
                </Box>

                <TableContainer component={Paper} sx={{ bgcolor: '#1e293b', borderRadius: 2, border: "1px solid rgba(148, 163, 184, 0.1)", boxShadow: "0 4px 24px rgba(0, 0, 0, 0.35)" }}>
                    <Table>
                        <TableHead sx={{ backgroundColor: 'rgba(15, 23, 42, 0.8)' }}>
                            <TableRow>
                                {tableHeaders.map(h => (
                                    <TableCell key={h.label} sx={{ color: '#7dd3fc', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em' }}>
                                        <Tooltip title={h.tooltip} arrow placement="top">
                                            <span style={{ cursor: 'help' }}>{h.label}</span>
                                        </Tooltip>
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {movements.map(m => (
                                <TableRow key={m.id} sx={{ '&:hover': { backgroundColor: 'rgba(56, 189, 248, 0.04)' }, '& td': { color: '#cbd5e1', borderBottom: '1px solid rgba(148, 163, 184, 0.07)' } }}>
                                    <TableCell>{m.id}</TableCell>
                                    <TableCell sx={{ color: '#e2e8f0', fontWeight: 500 }}>{m.userRut}</TableCell>
                                    <TableCell>{m.quantity}</TableCell>
                                    <TableCell>
                                        {(() => {
                                            const styles = getChipStyles(m.type);
                                            return (
                                                <Chip 
                                                    label={m.type} 
                                                    size="small"
                                                    sx={{ 
                                                        backgroundColor: styles.bg,
                                                        color: styles.color,
                                                        fontWeight: 700,
                                                        fontSize: '0.72rem',
                                                        letterSpacing: '0.03em',
                                                        border: `1px solid ${styles.border}`,
                                                        borderRadius: '16px',
                                                        textTransform: 'uppercase',
                                                        minWidth: '95px'
                                                    }}
                                                />
                                            );
                                        })()}
                                    </TableCell>
                                    <TableCell>{new Date(m.dateTime).toLocaleString()}</TableCell>
                                </TableRow>
                            ))}
                            {!loading && movements.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} align="center" sx={{ color: "#64748b", py: 8 }}>
                                        No se encontraron registros de movimientos.
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

export default KardexList;