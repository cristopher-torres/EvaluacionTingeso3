import React, { useState, useEffect, useRef } from "react";
import { getMovementsByTool, getMovementsByDateRange, getAllMovements } from "../services/kardex.service";
import toolService from "../services/tool.service";
import { 
    Autocomplete, TextField, Button, Table, TableBody, TableCell, 
    TableContainer, TableHead, TableRow, Paper, Typography, Box,
    Backdrop, CircularProgress, Divider
} from "@mui/material";
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';

const KardexList = () => {
    const [tools, setTools] = useState([]);
    const [selectedTool, setSelectedTool] = useState(null);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [movements, setMovements] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState("");

    const startDateRef = useRef(null);
    const endDateRef = useRef(null);
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
            getMovementsByDateRange(`${startDate}T00:00:00`, `${endDate}T23:59:59`)
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
            getMovementsByDateRange(`${startDate}T00:00:00`, `${endDate}T23:59:59`)
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
        setStartDate("");
        setEndDate("");
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
        "& .MuiSvgIcon-root": { color: "#00d2ff" },
        "& input[type='date']::-webkit-calendar-picker-indicator": {
            filter: "invert(1) sepia(100%) saturate(10000%) hue-rotate(170deg)",
            cursor: "pointer", position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', opacity: 0
        }
    };

    return (
        <Box sx={{ p: 3, bgcolor: '#100524', minHeight: '100vh' }}>
            <Backdrop sx={{ color: '#00d2ff', zIndex: 10, bgcolor: 'rgba(16, 5, 36, 0.9)', display: 'flex', flexDirection: 'column', gap: 2 }} open={loading}>
                <CircularProgress color="inherit" />
                <Typography variant="h6">{loadingMessage}</Typography>
            </Backdrop>

            <Typography variant="h4" sx={{ color: "#00d2ff", fontWeight: "bold", mb: 4, textShadow: "0 0 10px rgba(0, 210, 255, 0.3)" }}>
                Kardex de Herramientas
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, mb: 3, p: 3, bgcolor: '#1d0b3b', borderRadius: 2, border: '1px solid rgba(232, 28, 255, 0.2)', alignItems: 'center', flexWrap: 'wrap' }}>
                <Autocomplete
                    options={tools}
                    getOptionLabel={(o) => `${o.id}. ${o.name}`}
                    value={selectedTool}
                    onChange={(e, v) => setSelectedTool(v)}
                    sx={{ minWidth: 250, ...inputSx }}
                    renderInput={(p) => <TextField {...p} label="Herramienta" />}
                />

                <Divider orientation="vertical" flexItem sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />

                <TextField
                    label="Desde" type="date" inputRef={startDateRef}
                    value={startDate} sx={inputSx} InputLabelProps={{ shrink: true }}
                    onChange={(e) => {
                        const newStartDate = e.target.value;
                        setStartDate(newStartDate);
                        // Limpia el "Hasta" si la nueva fecha "Desde" es mayor
                        if (endDate && endDate < newStartDate) {
                            setEndDate("");
                        }
                        setTimeout(() => endDateRef.current?.showPicker(), 100);
                    }}
                    onClick={(e) => e.target.showPicker()}
                />

                <TextField
                    label="Hasta" type="date" inputRef={endDateRef}
                    value={endDate} sx={inputSx} InputLabelProps={{ shrink: true }}
                    inputProps={{ min: startDate }} // Restringe fechas anteriores a "Desde"
                    onChange={(e) => {
                        setEndDate(e.target.value);
                        setTimeout(() => dateBtnRef.current?.focus(), 100);
                    }}
                    onClick={(e) => e.target.showPicker()}
                />

                <Button variant="contained" ref={dateBtnRef} onClick={handleApplyFilters} sx={{ bgcolor: "rgba(0, 210, 255, 0.1)", color: "#00d2ff", border: "1px solid #00d2ff", fontWeight: "bold", "&:hover": { bgcolor: "#00d2ff", color: "#100524" } }}>
                    Aplicar Filtros
                </Button>

                <Button onClick={resetFilters} startIcon={<DeleteSweepIcon />} sx={{ color: '#ff1744', fontWeight: 'bold' }}>
                    Limpiar
                </Button>
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
                            <TableRow key={m.id} sx={{ '& td': { color: '#f1f5f9', borderBottom: '1px solid rgba(255,255,255,0.05)' } }}>
                                <TableCell>{m.id}</TableCell>
                                <TableCell>{m.userRut}</TableCell>
                                <TableCell>{m.quantity}</TableCell>
                                <TableCell sx={{ color: m.type === 'SALIDA' ? '#e81cff' : '#00ff88', fontWeight: 'bold' }}>{m.type}</TableCell>
                                <TableCell>{new Date(m.dateTime).toLocaleString()}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default KardexList;


