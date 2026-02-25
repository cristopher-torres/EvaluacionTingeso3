import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import HomeIcon from "@mui/icons-material/Home";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import HistoryIcon from "@mui/icons-material/History";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import GroupsIcon from "@mui/icons-material/Groups";
import MoneyOffIcon from "@mui/icons-material/MoneyOff";
import Typography from "@mui/material/Typography";
import { useNavigate, useLocation } from "react-router-dom";

export default function Sidemenu({ open, toggleDrawer }) {
  const navigate = useNavigate();
  const location = useLocation();

  const getIconStyle = (path) => ({
    color: location.pathname === path ? "#38bdf8" : "#94a3b8",
    minWidth: 40,
    transition: "color 0.2s ease"
  });

  const getButtonStyle = (path) => ({
    mx: 1,
    mb: 0.5,
    borderRadius: 1.5,
    "&:hover": { 
      bgcolor: "rgba(56, 189, 248, 0.08)",
      "& .MuiListItemIcon-root": { color: "#38bdf8" }
    },
    bgcolor: location.pathname === path ? "rgba(56, 189, 248, 0.12)" : "transparent"
  });

  const getTextStyle = (path) => ({
    "& span": { 
      fontWeight: location.pathname === path ? 700 : 500,
      color: location.pathname === path ? "#e2e8f0" : "#94a3b8",
      fontSize: "0.875rem"
    }
  });

  const listOptions = () => (
    <Box 
      role="presentation" 
      onClick={toggleDrawer(false)}
      sx={{ 
        height: "100%", 
        bgcolor: "#1e293b", 
        color: "#e2e8f0",
        width: 280,
        pt: 2
      }}
    >
      <Box sx={{ px: 3, mb: 2 }}>
        <Typography variant="overline" sx={{ color: "#38bdf8", fontWeight: 700, letterSpacing: '0.1em' }}>
          Operaciones
        </Typography>
      </Box>

      <List>
        <ListItemButton onClick={() => navigate("/")} sx={getButtonStyle("/")}>
          <ListItemIcon><HomeIcon sx={getIconStyle("/")} /></ListItemIcon>
          <ListItemText primary="Inicio" sx={getTextStyle("/")} />
        </ListItemButton>

        <ListItemButton onClick={() => navigate("/user/userRegister")} sx={getButtonStyle("/user/userRegister")}>
          <ListItemIcon><PersonAddIcon sx={getIconStyle("/user/userRegister")} /></ListItemIcon>
          <ListItemText primary="Registrar un usuario" sx={getTextStyle("/user/userRegister")} />
        </ListItemButton>

        <ListItemButton onClick={() => navigate("/tools/decommission")} sx={getButtonStyle("/tools/decommission")}>
          <ListItemIcon><RemoveCircleOutlineIcon sx={getIconStyle("/tools/decommission")} /></ListItemIcon>
          <ListItemText primary="Dar de baja herramienta" sx={getTextStyle("/tools/decommission")} />
        </ListItemButton>
      </List>

      <Divider sx={{ bgcolor: "rgba(148, 163, 184, 0.1)", my: 1.5, mx: 2 }} />

      <Box sx={{ px: 3, mb: 1 }}>
        <Typography variant="overline" sx={{ color: "#38bdf8", fontWeight: 700, letterSpacing: '0.1em' }}>
          Gestión y Reportes
        </Typography>
      </Box>

      <List>
        <ListItemButton onClick={() => navigate("/tool/movementHistory")} sx={getButtonStyle("/tool/movementHistory")}>
          <ListItemIcon><HistoryIcon sx={getIconStyle("/tool/movementHistory")} /></ListItemIcon>
          <ListItemText primary="Historial de movimientos" sx={getTextStyle("/tool/movementHistory")} />
        </ListItemButton>

        <ListItemButton onClick={() => navigate("/loans/ActiveLoanList")} sx={getButtonStyle("/loans/ActiveLoanList")}>
          <ListItemIcon><AttachMoneyIcon sx={getIconStyle("/loans/ActiveLoanList")} /></ListItemIcon>
          <ListItemText primary="Préstamos activos" sx={getTextStyle("/loans/ActiveLoanList")} />
        </ListItemButton>

        <ListItemButton onClick={() => navigate("/loans/unpaidLoans")} sx={getButtonStyle("/loans/unpaidLoans")}>
          <ListItemIcon><MoneyOffIcon sx={getIconStyle("/loans/unpaidLoans")} /></ListItemIcon>
          <ListItemText primary="Clientes con multas" sx={getTextStyle("/loans/unpaidLoans")} />
        </ListItemButton>

        <ListItemButton onClick={() => navigate("/reports/lateClients")} sx={getButtonStyle("/reports/lateClients")}>
          <ListItemIcon><ReportProblemIcon sx={getIconStyle("/reports/lateClients")} /></ListItemIcon>
          <ListItemText primary="Clientes atrasados" sx={getTextStyle("/reports/lateClients")} />
        </ListItemButton>

        <ListItemButton onClick={() => navigate("/loans/TopTools")} sx={getButtonStyle("/loans/TopTools")}>
          <ListItemIcon><LeaderboardIcon sx={getIconStyle("/loans/TopTools")} /></ListItemIcon>
          <ListItemText primary="Ranking herramientas" sx={getTextStyle("/loans/TopTools")} />
        </ListItemButton>
      </List>

      <Divider sx={{ bgcolor: "rgba(148, 163, 184, 0.1)", my: 1.5, mx: 2 }} />

      <List>
        <ListItemButton onClick={() => navigate("/loans/list")} sx={getButtonStyle("/loans/list")}>
          <ListItemIcon><ReceiptLongIcon sx={getIconStyle("/loans/list")} /></ListItemIcon>
          <ListItemText primary="Todos los préstamos" sx={getTextStyle("/loans/list")} />
        </ListItemButton>

        <ListItemButton onClick={() => navigate("/users/list")} sx={getButtonStyle("/users/list")}>
          <ListItemIcon><GroupsIcon sx={getIconStyle("/users/list")} /></ListItemIcon>
          <ListItemText primary="Todos los clientes" sx={getTextStyle("/users/list")} />
        </ListItemButton>
      </List>
    </Box>
  );

  return (
    <Drawer 
      anchor="left" 
      open={open} 
      onClose={toggleDrawer(false)}
      PaperProps={{
        sx: {
          bgcolor: "#1e293b",
          borderRight: "1px solid rgba(148, 163, 184, 0.15)",
          boxShadow: "10px 0 30px rgba(0, 0, 0, 0.5)"
        }
      }}
    >
      {listOptions()}
    </Drawer>
  );
}

