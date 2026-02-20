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
import { useNavigate } from "react-router-dom";

export default function Sidemenu({ open, toggleDrawer }) {
  const navigate = useNavigate();

  // Estilo común para los iconos neón cian
  const iconSx = { 
    color: "#00d2ff", 
    filter: "drop-shadow(0 0 5px rgba(0, 210, 255, 0.5))" 
  };

  const listOptions = () => (
    <Box 
      role="presentation" 
      onClick={toggleDrawer(false)}
      sx={{ 
        height: "100%", 
        bgcolor: "#1d0b3b", // Morado de tarjeta
        color: "white",
        width: 280
      }}
    >
      <List sx={{ mt: 2 }}>
        <ListItemButton 
          onClick={() => navigate("/")}
          sx={{ "&:hover": { bgcolor: "rgba(0, 210, 255, 0.1)" } }}
        >
          <ListItemIcon><HomeIcon sx={iconSx} /></ListItemIcon>
          <ListItemText primary="Home" sx={{ "& span": { fontWeight: "bold" } }} />
        </ListItemButton>

        <Divider sx={{ bgcolor: "rgba(232, 28, 255, 0.3)", my: 1 }} />

        <ListItemButton 
          onClick={() => navigate("/user/userRegister")}
          sx={{ "&:hover": { bgcolor: "rgba(0, 210, 255, 0.1)" } }}
        >
          <ListItemIcon><PersonAddIcon sx={iconSx} /></ListItemIcon>
          <ListItemText primary="Registrar un usuario" />
        </ListItemButton>

        <ListItemButton 
          onClick={() => navigate("/tools/decommission")}
          sx={{ "&:hover": { bgcolor: "rgba(0, 210, 255, 0.1)" } }}
        >
          <ListItemIcon><RemoveCircleOutlineIcon sx={iconSx} /></ListItemIcon>
          <ListItemText primary="Dar de baja herramienta" />
        </ListItemButton>

        <ListItemButton 
          onClick={() => navigate("/tool/movementHistory")}
          sx={{ "&:hover": { bgcolor: "rgba(0, 210, 255, 0.1)" } }}
        >
          <ListItemIcon><HistoryIcon sx={iconSx} /></ListItemIcon>
          <ListItemText primary="Historial de movimientos" />
        </ListItemButton>

        <ListItemButton 
          onClick={() => navigate("/loans/ActiveLoanList")}
          sx={{ "&:hover": { bgcolor: "rgba(0, 210, 255, 0.1)" } }}
        >
          <ListItemIcon><AttachMoneyIcon sx={iconSx} /></ListItemIcon>
          <ListItemText primary="Préstamos activos" />
        </ListItemButton>

        <ListItemButton 
          onClick={() => navigate("/loans/unpaidLoans")}
          sx={{ "&:hover": { bgcolor: "rgba(0, 210, 255, 0.1)" } }}
        >
          <ListItemIcon><MoneyOffIcon sx={iconSx} /></ListItemIcon>
          <ListItemText primary="Clientes con multas sin pagar" />
        </ListItemButton>

        <ListItemButton 
          onClick={() => navigate("/reports/lateClients")}
          sx={{ "&:hover": { bgcolor: "rgba(0, 210, 255, 0.1)" } }}
        >
          <ListItemIcon><ReportProblemIcon sx={iconSx} /></ListItemIcon>
          <ListItemText primary="Clientes atrasados" />
        </ListItemButton>

        <ListItemButton 
          onClick={() => navigate("/loans/TopTools")}
          sx={{ "&:hover": { bgcolor: "rgba(0, 210, 255, 0.1)" } }}
        >
          <ListItemIcon><LeaderboardIcon sx={iconSx} /></ListItemIcon>
          <ListItemText primary="Ranking herramientas más prestadas" />
        </ListItemButton>
      </List>

      <Divider sx={{ bgcolor: "rgba(232, 28, 255, 0.3)", my: 1 }} />

      <List>
        <ListItemButton 
          onClick={() => navigate("/loans/list")}
          sx={{ "&:hover": { bgcolor: "rgba(0, 210, 255, 0.1)" } }}
        >
          <ListItemIcon><ReceiptLongIcon sx={iconSx} /></ListItemIcon>
          <ListItemText primary="Todos los préstamos" />
        </ListItemButton>

        <ListItemButton 
          onClick={() => navigate("/users/list")}
          sx={{ "&:hover": { bgcolor: "rgba(0, 210, 255, 0.1)" } }}
        >
          <ListItemIcon><GroupsIcon sx={iconSx} /></ListItemIcon>
          <ListItemText primary="Todos los clientes" />
        </ListItemButton>
      </List>
    </Box>
  );

  return (
    <Drawer 
      anchor={"left"} 
      open={open} 
      onClose={toggleDrawer(false)}
      PaperProps={{
        sx: {
          bgcolor: "#1d0b3b",
          borderRight: "2px solid #e81cff", // Línea magenta neón al cerrar el menú
          boxShadow: "4px 0 15px rgba(232, 28, 255, 0.2)"
        }
      }}
    >
      {listOptions()}
    </Drawer>
  );
}

