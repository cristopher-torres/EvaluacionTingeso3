import React from 'react';
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const NotFound = () => {
    const navigate = useNavigate();

    const skyButtonStyle = {
        backgroundColor: "rgba(56, 189, 248, 0.07)",
        border: "1px solid rgba(56, 189, 248, 0.2)",
        color: "#7dd3fc",
        fontWeight: 600,
        textTransform: 'none',
        px: 4,
        py: 1.2,
        fontSize: "1rem",
        '&:hover': {
            backgroundColor: 'rgba(56, 189, 248, 0.14)',
            border: '1px solid rgba(56, 189, 248, 0.4)',
            color: '#e2e8f0',
        }
    };

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "100vh",
                backgroundColor: "#0f172a",
                textAlign: "center",
                p: 3
            }}
        >
            <ErrorOutlineIcon 
                sx={{ 
                    fontSize: 120, 
                    color: "#38bdf8", 
                    mb: 2,
                    opacity: 0.8
                }} 
            />

            <Typography 
                variant="h2" 
                sx={{ 
                    color: "#e2e8f0", 
                    fontWeight: 700,
                    mb: 1,
                    letterSpacing: '-0.02em'
                }}
            >
                404
            </Typography>

            <Typography 
                variant="h5" 
                sx={{ 
                    color: "#94a3b8", 
                    mb: 5, 
                    maxWidth: "500px",
                    fontWeight: 400,
                    lineHeight: 1.6
                }}
            >
                La página que estás buscando no existe o ha sido movida temporalmente.
            </Typography>

            <Button
                variant="contained"
                onClick={() => navigate("/")}
                sx={skyButtonStyle}
            >
                Volver al Inicio
            </Button>
        </Box>
    );
}

export default NotFound;