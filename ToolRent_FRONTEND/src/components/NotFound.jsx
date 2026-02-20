import React from 'react';
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "100vh",
                backgroundColor: "#100524", 
                textAlign: "center",
                p: 3
            }}
        >
            {/* Icono Neón Magenta */}
            <ErrorOutlineIcon 
                sx={{ 
                    fontSize: 100, 
                    color: "#e81cff", // Magenta neón
                    filter: "drop-shadow(0 0 15px rgba(232, 28, 255, 0.6))",
                    mb: 2
                }} 
            />

            <Typography 
                variant="h2" 
                sx={{ 
                    color: "#00d2ff", // Cian brillante
                    fontWeight: "bold",
                    mb: 1,
                    textShadow: "0 0 20px rgba(0, 210, 255, 0.5)"
                }}
            >
                404
            </Typography>

            <Typography 
                variant="h5" 
                sx={{ 
                    color: "#b392f0", // Lila suave para texto secundario
                    mb: 4,
                    maxWidth: "500px"
                }}
            >
                Página web no está disponible
            </Typography>

            <Button
                variant="contained"
                onClick={() => navigate("/")}
                sx={{
                    backgroundColor: "rgba(0, 210, 255, 0.1)",
                    border: "1px solid #00d2ff",
                    color: "#00d2ff",
                    fontWeight: "bold",
                    px: 4,
                    py: 1.5,
                    textTransform: "none",
                    fontSize: "1.1rem",
                    "&:hover": { 
                        backgroundColor: "#00d2ff", 
                        color: "#100524",
                        boxShadow: "0 0 25px rgba(0, 210, 255, 0.6)" 
                    },
                }}
            >
                Volver al Inicio
            </Button>
        </Box>
    );
}

export default NotFound;