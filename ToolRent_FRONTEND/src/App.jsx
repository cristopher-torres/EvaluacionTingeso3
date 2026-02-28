import './App.css';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
} from 'react-router-dom';
import PropTypes from 'prop-types';
import { useKeycloak } from '@react-keycloak/web';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import SecurityIcon from '@mui/icons-material/Security';
import HomeIcon from '@mui/icons-material/Home';
import Navbar from './components/Navbar';
import Home from './components/Home';
import NotFound from './components/NotFound';
import ToolList from './components/ToolList';
import AddEditTool from './components/AddEditTool';
import LoanList from './components/LoanList';
import AddLoan from './components/AddLoan';
import ActiveLoanList from './components/ActiveLoanList';
import AddEditUser from './components/AddEditUser';
import ToolDecommission from './components/ToolDecommission';
import KardexList from './components/KardexList';
import ReportLateClient from './components/ReportLateClient';
import ToolListRanking from './components/ToolListRanking';
import UserList from './components/UserList';
import UnpaidLoansPage from './components/UnpaidLoanList';

const PrivateRoute = ({
  element,
  rolesAllowed,
  isLoggedIn,
  roles,
  keycloak,
}) => {
  if (!isLoggedIn) {
    keycloak.login();
    return null;
  }

  const hasAccess = !rolesAllowed || rolesAllowed.some((r) => roles.includes(r));

  if (!hasAccess) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          mt: 15,
          p: 4,
          textAlign: 'center',
        }}
      >
        <SecurityIcon
          sx={{
            fontSize: 60,
            color: '#f87171',
            mb: 2,
            opacity: 0.9,
          }}
        />
        <Typography
          variant="h5"
          sx={{
            color: '#e2e8f0',
            fontWeight: 700,
            mb: 1,
          }}
        >
          Acceso Restringido
        </Typography>
        <Typography
          sx={{
            color: '#94a3b8',
            maxWidth: 450,
            mb: 3,
          }}
        >
          No tienes los permisos necesarios para acceder a este módulo.
          Contacta al administrador del sistema.
        </Typography>
        <Button
          component={Link}
          to="/"
          variant="contained"
          startIcon={<HomeIcon />}
          sx={{
            backgroundColor: 'rgba(56, 189, 248, 0.07)',
            border: '1px solid rgba(56, 189, 248, 0.2)',
            color: '#7dd3fc',
            textTransform: 'none',
            fontWeight: 600,
            px: 3,
            '&:hover': {
              backgroundColor: 'rgba(56, 189, 248, 0.14)',
              border: '1px solid rgba(56, 189, 248, 0.4)',
              color: '#e2e8f0',
            },
          }}
        >
          Volver al Inicio
        </Button>
      </Box>
    );
  }

  return element;
};

PrivateRoute.propTypes = {
  element: PropTypes.node.isRequired,
  rolesAllowed: PropTypes.arrayOf(PropTypes.string),
  isLoggedIn: PropTypes.bool.isRequired,
  roles: PropTypes.arrayOf(PropTypes.string).isRequired,
  keycloak: PropTypes.shape({
    login: PropTypes.func.isRequired,
  }).isRequired,
};

PrivateRoute.defaultProps = {
  rolesAllowed: null,
};

function App() {
  const { keycloak, initialized } = useKeycloak();

  if (!initialized) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          bgcolor: '#0f172a',
          gap: 2,
        }}
      >
        <CircularProgress sx={{ color: '#38bdf8' }} />
        <Typography sx={{ color: '#94a3b8', fontWeight: 500 }}>
          Inicializando servicios...
        </Typography>
      </Box>
    );
  }

  const isLoggedIn = keycloak.authenticated;
  const roles = keycloak.tokenParsed?.realm_access?.roles || [];

  const renderPrivate = (element, rolesAllowed) => (
    <PrivateRoute
      element={element}
      rolesAllowed={rolesAllowed}
      isLoggedIn={isLoggedIn}
      roles={roles}
      keycloak={keycloak}
    />
  );

  return (
    <Router>
      <Box sx={{ bgcolor: '#0f172a', minHeight: '100vh' }}>
        <Navbar />
        <Box component="main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/inventario"
              element={renderPrivate(<ToolList />, ['ADMIN'])}
            />
            <Route
              path="/tools/add"
              element={renderPrivate(<AddEditTool />, ['ADMIN'])}
            />
            <Route
              path="/tools/edit/:id"
              element={renderPrivate(<AddEditTool />, ['ADMIN'])}
            />
            <Route
              path="/prestamos"
              element={renderPrivate(<AddLoan />, ['EMPLOYEE', 'ADMIN'])}
            />
            <Route
              path="/loans/ActiveLoanList"
              element={renderPrivate(<ActiveLoanList />, ['EMPLOYEE', 'ADMIN'])}
            />
            <Route
              path="/loans/list"
              element={renderPrivate(<LoanList />, ['ADMIN'])}
            />
            <Route
              path="/user/userRegister"
              element={renderPrivate(<AddEditUser />, ['EMPLOYEE', 'ADMIN'])}
            />
            <Route
              path="/users/edit/:userId"
              element={renderPrivate(<AddEditUser />, ['EMPLOYEE', 'ADMIN'])}
            />
            <Route
              path="/tools/decommission"
              element={renderPrivate(<ToolDecommission />, ['ADMIN'])}
            />
            <Route
              path="tool/movementHistory"
              element={renderPrivate(<KardexList />, ['ADMIN'])}
            />
            <Route
              path="/reports/lateClients"
              element={renderPrivate(<ReportLateClient />, ['EMPLOYEE', 'ADMIN'])}
            />
            <Route
              path="/loans/TopTools"
              element={renderPrivate(<ToolListRanking />, ['EMPLOYEE', 'ADMIN'])}
            />
            <Route
              path="/users/list"
              element={renderPrivate(<UserList />, ['EMPLOYEE', 'ADMIN'])}
            />
            <Route
              path="/loans/unpaidLoans"
              element={renderPrivate(<UnpaidLoansPage />, ['EMPLOYEE', 'ADMIN'])}
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Box>
      </Box>
    </Router>
  );
}

export default App;