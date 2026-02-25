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

import PageHelp from "../components/PageHelp";

const LoanList = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getLoans()
      .then(res => {
        setLoans(res.data);
      })
      .catch(err => {
        console.error("Error al cargar préstamos:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  };

  const tableHeaders = [
    { label: "ID", tooltip: "Identificador único del registro de préstamo" },
    { label: "Herramienta", tooltip: "Identificador de la herramienta prestada" },
    { label: "Cliente", tooltip: "Identificador del usuario que solicitó el préstamo" },
    { label: "Inicio", tooltip: "Fecha en que se inició el préstamo" },
    { label: "Fecha límite", tooltip: "Fecha programada para la devolución" },
    { label: "Devuelto", tooltip: "Indica si la herramienta ya fue retornada al inventario" }
  ];

  return (
    <Box sx={{ 
      p: 3, 
      bgcolor: '#100524', 
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column'
    }}>
      
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
          Cargando historial de préstamos...
        </Typography>
      </Backdrop>

      <Box display="flex" alignItems="center" gap={1} mb={3}>
        <Typography 
          variant="h4" 
          sx={{ 
            color: "#00d2ff", 
            fontWeight: "bold",
            textShadow: "0 0 10px rgba(0, 210, 255, 0.3)" 
          }}
        >
          Listado de Préstamos
        </Typography>
        <PageHelp 
          title="Historial General" 
          steps={[
            "Esta vista muestra el registro histórico de todos los préstamos.",
            "Incluye tanto los préstamos que están en curso como los ya finalizados.",
            "Pase el cursor sobre los encabezados de la tabla para ver más detalles de cada columna."
          ]} 
        />
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
              {tableHeaders.map((header) => (
                <TableCell 
                  key={header.label} 
                  sx={{ 
                    color: '#00d2ff', 
                    fontWeight: 'bold', 
                    borderBottom: '2px solid #e81cff' 
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
            {loans.map(loan => (
              <TableRow 
                key={loan.id} 
                sx={{ 
                  '&:hover': { backgroundColor: 'rgba(232, 28, 255, 0.05)' }, 
                  '& td': { 
                    color: '#f1f5f9', 
                    borderBottom: '1px solid rgba(255,255,255,0.05)' 
                  } 
                }}
              >
                <TableCell>{loan.id}</TableCell>
                <TableCell>{loan.tool?.id}</TableCell>
                <TableCell>{loan.client?.id}</TableCell>
                <TableCell>{formatDate(loan.startDate)}</TableCell>
                <TableCell>{formatDate(loan.scheduledReturnDate)}</TableCell>
                <TableCell 
                  sx={{ 
                    color: loan.delivered ? '#00ff88' : '#e81cff', 
                    fontWeight: 'bold' 
                  }}
                >
                  {loan.delivered ? "Sí" : "No"}
                </TableCell>
              </TableRow>
            ))}
            {!loading && loans.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ color: "#b392f0", py: 4 }}>
                  No hay registros de préstamos disponibles.
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
