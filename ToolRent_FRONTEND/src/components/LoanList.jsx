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

  return (
    <Box sx={{ 
      p: 3, 
      bgcolor: '#100524', 
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column'
    }}>
      
      {/* INDICADOR DE CARGA GLOBAL (Heurística #1) */}
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

      <Typography 
        variant="h4" 
        sx={{ 
          color: "#00d2ff", 
          mb: 3, 
          fontWeight: "bold",
          textShadow: "0 0 10px rgba(0, 210, 255, 0.3)" 
        }}
      >
        Listado de Préstamos
      </Typography>

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
              {["ID", "Herramienta", "Cliente", "Inicio", "Fecha límite", "Devuelto"].map((head) => (
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
