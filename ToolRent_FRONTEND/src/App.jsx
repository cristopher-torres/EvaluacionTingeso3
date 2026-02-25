import './App.css'
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom'
import Navbar from "./components/Navbar"
import Home from './components/Home'
import NotFound from './components/NotFound'
import { useKeycloak } from "@react-keycloak/web"
import ToolList from './components/ToolList'
import AddEditTool from './components/AddEditTool'
import LoanList from './components/LoanList'
import AddLoan from './components/AddLoan'
import ActiveLoanList from './components/ActiveLoanList'
import AddEditUser from './components/AddEditUser'
import ToolDecommission from './components/ToolDecommission'
import KardexList from './components/KardexList'
import ReportLateClient from './components/ReportLateClient'
import ToolListRanking from './components/ToolListRanking'
import UserList from './components/UserList'
import UnpaidLoansPage from './components/UnpaidLoanList'
import { Box, Typography, CircularProgress, Button } from "@mui/material"
import SecurityIcon from '@mui/icons-material/Security'
import HomeIcon from '@mui/icons-material/Home'

function App() {
  const { keycloak, initialized } = useKeycloak();

  if (!initialized) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', bgcolor: '#0f172a', gap: 2 }}>
        <CircularProgress sx={{ color: '#38bdf8' }} />
        <Typography sx={{ color: '#94a3b8', fontWeight: 500 }}>Inicializando servicios...</Typography>
      </Box>
    );
  }

  const isLoggedIn = keycloak.authenticated;
  const roles = keycloak.tokenParsed?.realm_access?.roles || [];

  const PrivateRoute = ({ element, rolesAllowed }) => {
    if (!isLoggedIn) {
      keycloak.login();
      return null;
    }

    if (rolesAllowed && !rolesAllowed.some(r => roles.includes(r))) {
      return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', mt: 15, p: 4, textAlign: 'center' }}>
          <SecurityIcon sx={{ fontSize: 60, color: '#f87171', mb: 2, opacity: 0.9 }} />
          <Typography variant="h5" sx={{ color: '#e2e8f0', fontWeight: 700, mb: 1 }}>Acceso Restringido</Typography>
          <Typography sx={{ color: '#94a3b8', maxWidth: 450, mb: 3 }}>
            No tienes los permisos necesarios para acceder a este módulo. Contacta al administrador del sistema.
          </Typography>
          
          <Button
            component={Link}
            to="/"
            variant="contained"
            startIcon={<HomeIcon />}
            sx={{
              backgroundColor: "rgba(56, 189, 248, 0.07)",
              border: "1px solid rgba(56, 189, 248, 0.2)",
              color: "#7dd3fc",
              textTransform: "none",
              fontWeight: 600,
              px: 3,
              "&:hover": {
                backgroundColor: "rgba(56, 189, 248, 0.14)",
                border: "1px solid rgba(56, 189, 248, 0.4)",
                color: "#e2e8f0"
              }
            }}
          >
            Volver al Inicio
          </Button>
        </Box>
      );
    }

    return element;
  };

  return (
    <Router>
      <Box sx={{ bgcolor: '#0f172a', minHeight: '100vh' }}>
        <Navbar />
        <Box component="main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/inventario" element={<PrivateRoute element={<ToolList />} rolesAllowed={['ADMIN']} />} />
            <Route path="/tools/add" element={<PrivateRoute element={<AddEditTool />} rolesAllowed={['ADMIN']} />} />
            <Route path="/tools/edit/:id" element={<PrivateRoute element={<AddEditTool />} rolesAllowed={['ADMIN']} />} />
            <Route path="/prestamos" element={<PrivateRoute element={<AddLoan />} rolesAllowed={['EMPLOYEE', 'ADMIN']} />} />
            <Route path="/loans/ActiveLoanList" element={<PrivateRoute element={<ActiveLoanList />} rolesAllowed={['EMPLOYEE', 'ADMIN']} />} />
            <Route path="/loans/list" element={<PrivateRoute element={<LoanList />} rolesAllowed={['ADMIN']} />} />
            <Route path="/user/userRegister" element={<PrivateRoute element={<AddEditUser />} rolesAllowed={['EMPLOYEE', 'ADMIN']} />} />
            <Route path="/users/edit/:userId" element={<PrivateRoute element={<AddEditUser />} rolesAllowed={['EMPLOYEE', 'ADMIN']} />} />
            <Route path="/tools/decommission" element={<PrivateRoute element={<ToolDecommission />} rolesAllowed={['ADMIN']} />} />
            <Route path="tool/movementHistory" element={<PrivateRoute element={<KardexList />} rolesAllowed={['ADMIN']} />} />
            <Route path="/reports/lateClients" element={<PrivateRoute element={<ReportLateClient />} rolesAllowed={['EMPLOYEE', 'ADMIN']} />} />
            <Route path="/loans/TopTools" element={<PrivateRoute element={<ToolListRanking />} rolesAllowed={['EMPLOYEE', 'ADMIN']} />} />
            <Route path="/users/list" element={<PrivateRoute element={<UserList />} rolesAllowed={['EMPLOYEE', 'ADMIN']} />} />
            <Route path="/loans/unpaidLoans" element={<PrivateRoute element={<UnpaidLoansPage />} rolesAllowed={['EMPLOYEE', 'ADMIN']} />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Box>
      </Box>
    </Router>
  );
}

export default App;