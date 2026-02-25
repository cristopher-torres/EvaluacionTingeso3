import React, { useState, useEffect, useRef } from "react";
import { getMovementsByTool, getMovementsByDateRange, getAllMovements } from "../services/kardex.service";
import toolService from "../services/tool.service";
import { 
    Autocomplete, TextField, Button, Table, TableBody, TableCell, 
    TableContainer, TableHead, TableRow, Paper, Typography, Box,
    Backdrop, CircularProgress, Divider, Tooltip
} from "@mui/material";
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
        setLoadingMessage("Cargando historial completo de movimientos...");
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

    const inputSx = {
        "& .MuiOutlinedInput-root": {
            color: "white",
            "& fieldset": { borderColor: "rgba(0, 210, 255, 0.3)" },
            "&:hover fieldset": { borderColor: "#00d2ff" },
            "&.Mui-focused fieldset": { borderColor: "#00d2ff" },
        },
        "& .MuiInputLabel-root": { color: "#b392f0" },
        "& .MuiInputLabel-root.Mui-focused": { color: "#00d2ff" },
        "& .MuiSvgIcon-root": { color: "#00d2ff" }
    };

    const dateInputSx = {
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
                <Backdrop sx={{ color: '#00d2ff', zIndex: 10, bgcolor: 'rgba(16, 5, 36, 0.9)', display: 'flex', flexDirection: 'column', gap: 2 }} open={loading}>
                    <CircularProgress color="inherit" />
                    <Typography variant="h6">{loadingMessage}</Typography>
                </Backdrop>

                <Box display="flex" alignItems="center" gap={1} mb={4}>
                    <Typography variant="h4" sx={{ color: "#00d2ff", fontWeight: "bold", textShadow: "0 0 10px rgba(0, 210, 255, 0.3)" }}>
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

                <Box sx={{ display: 'flex', gap: 2, mb: 3, p: 3, bgcolor: '#1d0b3b', borderRadius: 2, border: '1px solid rgba(232, 28, 255, 0.2)', alignItems: 'center', flexWrap: 'wrap' }}>
                    <Autocomplete
                        options={tools}
                        getOptionLabel={(o) => `${o.id}. ${o.name}`}
                        value={selectedTool}
                        onChange={(e, v) => setSelectedTool(v)}
                        sx={{ minWidth: 250, ...inputSx }}
                        renderInput={(p) => (
                            <TextField 
                                {...p} 
                                label="Herramienta" 
                                InputProps={{
                                    ...p.InputProps,
                                    endAdornment: (
                                        <>
                                            <Tooltip title="Filtre todos los movimientos de una herramienta en particular" arrow placement="top">
                                                <HelpOutlineIcon sx={{ color: "#e81cff", fontSize: "1.2rem", mr: 1, cursor: "help" }} />
                                            </Tooltip>
                                            {p.InputProps.endAdornment}
                                        </>
                                    ),
                                }}
                            />
                        )}
                    />

                    <Divider orientation="vertical" flexItem sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />

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
                                    sx={dateInputSx}
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
                            setTimeout(() => dateBtnRef.current?.focus(), 100);
                        }}
                        format="DD/MM/YYYY"
                        slots={{
                            textField: (params) => (
                                <TextField
                                    {...params}
                                    sx={dateInputSx}
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

                    <Tooltip title="Ejecutar la búsqueda con los parámetros ingresados" arrow placement="top">
                        <Button variant="contained" ref={dateBtnRef} onClick={handleApplyFilters} sx={{ bgcolor: "rgba(0, 210, 255, 0.1)", color: "#00d2ff", border: "1px solid #00d2ff", fontWeight: "bold", "&:hover": { bgcolor: "#00d2ff", color: "#100524" } }}>
                            Aplicar Filtros
                        </Button>
                    </Tooltip>

                    <Tooltip title="Eliminar los filtros y recargar todos los movimientos" arrow placement="top">
                        <Button onClick={resetFilters} startIcon={<DeleteSweepIcon />} sx={{ color: '#ff1744', fontWeight: 'bold', ml: 'auto', border: '1px dashed transparent', "&:hover": { bgcolor: 'rgba(255,23,68,0.1)', border: '1px dashed #ff1744' }, "&:focus": { outline: "none" } }}>
                            Limpiar
                        </Button>
                    </Tooltip>
                </Box>

                {error && <Typography sx={{ color: "#e81cff", mb: 2, fontWeight: 'bold' }}>{error}</Typography>}

                <TableContainer component={Paper} sx={{ bgcolor: '#1d0b3b', borderRadius: 2, border: "1px solid rgba(0, 210, 255, 0.3)", boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)" }}>
                    <Table>
                        <TableHead sx={{ backgroundColor: 'rgba(0, 210, 255, 0.1)' }}>
                            <TableRow>
                                {["ID", "RUT Usuario", "Cantidad", "Tipo", "Fecha"].map(h => (
                                    <TableCell key={h} sx={{ color: '#00d2ff', fontWeight: 'bold', borderBottom: '2px solid #e81cff' }}>{h}</TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {movements.map(m => (
                                <TableRow key={m.id} sx={{ '&:hover': { backgroundColor: 'rgba(232, 28, 255, 0.05)' }, '& td': { color: '#f1f5f9', borderBottom: '1px solid rgba(255,255,255,0.05)' } }}>
                                    <TableCell>{m.id}</TableCell>
                                    <TableCell>{m.userRut}</TableCell>
                                    <TableCell>{m.quantity}</TableCell>
                                    <TableCell sx={{ color: m.type === 'SALIDA' ? '#e81cff' : '#00ff88', fontWeight: 'bold' }}>{m.type}</TableCell>
                                    <TableCell>{new Date(m.dateTime).toLocaleString()}</TableCell>
                                </TableRow>
                            ))}
                            {!loading && movements.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} align="center" sx={{ color: "#b392f0", py: 4 }}>
                                        No se encontraron registros de movimientos para esta búsqueda.
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


