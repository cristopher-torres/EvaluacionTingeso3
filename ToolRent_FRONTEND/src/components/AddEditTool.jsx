import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import SaveIcon from '@mui/icons-material/Save';
import Typography from '@mui/material/Typography';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Tooltip from '@mui/material/Tooltip';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { useKeycloak } from '@react-keycloak/web';
import toolService from '../services/tool.service';
import PageHelp from '../components/PageHelp';

const inputSx = {
  '& .MuiOutlinedInput-root': {
    color: '#e2e8f0',
    '& fieldset': { borderColor: 'rgba(148, 163, 184, 0.12)' },
    '&:hover fieldset': { borderColor: 'rgba(56, 189, 248, 0.4)' },
    '&.Mui-focused fieldset': { borderColor: '#38bdf8' },
  },
  '& .MuiInputLabel-root': { color: '#94a3b8' },
  '& .MuiInputLabel-root.Mui-focused': { color: '#38bdf8' },
  '& .MuiSvgIcon-root': { color: '#38bdf8' },
};

const skyButtonStyle = {
  mt: 2,
  backgroundColor: 'rgba(56, 189, 248, 0.07)',
  border: '1px solid rgba(56, 189, 248, 0.2)',
  color: '#7dd3fc',
  fontWeight: 600,
  py: 1.5,
  textTransform: 'none',
  fontSize: '1rem',
  '&:hover': {
    backgroundColor: 'rgba(56, 189, 248, 0.14)',
    color: '#e2e8f0',
    border: '1px solid rgba(56, 189, 248, 0.4)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
  },
};

const AddEditTool = () => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [quantity, setQuantity] = useState('');
  const [replacementValue, setReplacementValue] = useState('');
  const [dailyRate, setDailyRate] = useState('');
  const [dailyLateRate, setDailyLateRate] = useState('');
  const [repairValue, setRepairValue] = useState('');
  const [status, setStatus] = useState('DISPONIBLE');

  const { id } = useParams();
  const [titleToolForm, setTitleToolForm] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const { keycloak } = useKeycloak();

  const saveTool = (e) => {
    e.preventDefault();
    const rut = keycloak?.tokenParsed?.rut;

    const tool = {
      name,
      category,
      replacementValue: Number(replacementValue),
      dailyRate: Number(dailyRate),
      dailyLateRate: Number(dailyLateRate),
      repairValue: Number(repairValue),
      id,
      status,
    };

    if (id) {
      toolService
        .update(tool, rut)
        .then(() => {
          setSuccessMessage('Herramienta actualizada exitosamente ✅');
          setOpenSnackbar(true);
          setTimeout(() => navigate('/inventario'), 3000);
        })
        .catch((error) => console.error(error));
    } else {
      toolService
        .create(tool, Number(quantity), rut)
        .then(() => {
          setSuccessMessage('Herramienta creada exitosamente ✅');
          setOpenSnackbar(true);
          setTimeout(() => navigate('/inventario'), 1500);
        })
        .catch((error) => console.error(error));
    }
  };

  useEffect(() => {
    if (id) {
      setTitleToolForm('Editar Herramienta');
      toolService
        .get(id)
        .then((response) => {
          const tool = response.data;
          setName(tool.name);
          setCategory(tool.category);
          setQuantity(tool.stock);
          setReplacementValue(tool.replacementValue);
          setDailyRate(tool.dailyRate);
          setDailyLateRate(tool.dailyLateRate);
          setRepairValue(tool.repairValue);
          setStatus(tool.status);
        })
        .catch((error) => console.error(error));
    } else {
      setTitleToolForm('Nueva Herramienta');
    }
  }, [id]);

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      sx={{ backgroundColor: '#0f172a', p: 2 }}
    >
      <Box
        component="form"
        onSubmit={saveTool}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2.5,
          width: '100%',
          maxWidth: '500px',
          padding: 4,
          borderRadius: 3,
          backgroundColor: '#1e293b',
          border: '1px solid rgba(148, 163, 184, 0.1)',
          borderTop: '3px solid rgba(56, 189, 248, 0.4)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
        }}
      >
        <Box display="flex" justifyContent="center" alignItems="center" gap={1} mb={1}>
          <Typography variant="h5" align="center" sx={{ color: '#38bdf8', fontWeight: 700 }}>
            {titleToolForm}
          </Typography>
          <PageHelp
            title="Gestión de Inventario"
            steps={[
              'Complete todos los campos requeridos.',
              'Los valores y tarifas deben ingresarse como números enteros.',
              'La cantidad inicial solo se define al crear un ítem nuevo.',
            ]}
          />
        </Box>

        <TextField
          label="Nombre de Herramienta"
          value={name}
          variant="outlined"
          onChange={(e) => setName(e.target.value)}
          required
          sx={inputSx}
          fullWidth
        />
        <TextField
          label="Categoría"
          value={category}
          select
          variant="outlined"
          onChange={(e) => setCategory(e.target.value)}
          required
          sx={inputSx}
          fullWidth
          slotProps={{
            select: {
              MenuProps: {
                PaperProps: {
                  sx: {
                    bgcolor: '#1e293b',
                    color: '#e2e8f0',
                    border: '1px solid rgba(56, 189, 248, 0.2)',
                    '& .MuiMenuItem-root:hover': { bgcolor: 'rgba(56, 189, 248, 0.08)' },
                  },
                },
              },
            },
          }}
        >
          <MenuItem value="Herramientas Eléctricas">Herramientas Eléctricas</MenuItem>
          <MenuItem value="Herramientas Manuales">Herramientas Manuales</MenuItem>
          <MenuItem value="Construcción">Construcción</MenuItem>
          <MenuItem value="Carpintería">Carpintería</MenuItem>
          <MenuItem value="Jardinería">Jardinería</MenuItem>
        </TextField>

        {/* FIX: InputProps movido a slotProps.input */}
        {!id && (
          <TextField
            label="Cantidad inicial"
            type="number"
            value={quantity}
            variant="outlined"
            onChange={(e) => setQuantity(e.target.value)}
            required
            sx={inputSx}
            fullWidth
            slotProps={{
              input: {
                endAdornment: (
                  <Tooltip title="Stock inicial no modificable después." arrow placement="top">
                    <HelpOutlineIcon sx={{ color: '#94a3b8', fontSize: '1.1rem', cursor: 'help', mr: 1 }} />
                  </Tooltip>
                ),
              },
            }}
          />
        )}

        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            fullWidth
            label="Valor Reposición"
            type="number"
            value={replacementValue}
            onChange={(e) => setReplacementValue(e.target.value)}
            required
            sx={inputSx}
            slotProps={{
              input: {
                endAdornment: (
                  <Tooltip title="Costo por pérdida total" arrow placement="top">
                    <HelpOutlineIcon sx={{ color: '#94a3b8', fontSize: '1.1rem', cursor: 'help' }} />
                  </Tooltip>
                ),
              },
            }}
          />
          <TextField
            fullWidth
            label="Tarifa Diaria"
            type="number"
            value={dailyRate}
            onChange={(e) => setDailyRate(e.target.value)}
            sx={inputSx}
            slotProps={{
              input: {
                endAdornment: (
                  <Tooltip title="Costo base de arriendo" arrow placement="top">
                    <HelpOutlineIcon sx={{ color: '#94a3b8', fontSize: '1.1rem', cursor: 'help' }} />
                  </Tooltip>
                ),
              },
            }}
          />
        </Box>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            fullWidth
            label="Tarifa Atraso"
            type="number"
            value={dailyLateRate}
            onChange={(e) => setDailyLateRate(e.target.value)}
            sx={inputSx}
            slotProps={{
              input: {
                endAdornment: (
                  <Tooltip title="Multa diaria por retraso" arrow placement="top">
                    <HelpOutlineIcon sx={{ color: '#94a3b8', fontSize: '1.1rem', cursor: 'help' }} />
                  </Tooltip>
                ),
              },
            }}
          />
          <TextField
            fullWidth
            label="Costo Reparación"
            type="number"
            value={repairValue}
            onChange={(e) => setRepairValue(e.target.value)}
            sx={inputSx}
            slotProps={{
              input: {
                endAdornment: (
                  <Tooltip title="Costo por daños menores" arrow placement="top">
                    <HelpOutlineIcon sx={{ color: '#94a3b8', fontSize: '1.1rem', cursor: 'help' }} />
                  </Tooltip>
                ),
              },
            }}
          />
        </Box>

        {id && (
          <TextField
            label="Estado"
            value={status}
            select
            variant="outlined"
            onChange={(e) => setStatus(e.target.value)}
            required
            sx={inputSx}
            fullWidth
            slotProps={{
              select: {
                MenuProps: {
                  PaperProps: {
                    sx: {
                      bgcolor: '#1e293b',
                      color: '#e2e8f0',
                      border: '1px solid rgba(56, 189, 248, 0.2)',
                    },
                  },
                },
              },
            }}
          >
            <MenuItem value="DISPONIBLE">DISPONIBLE</MenuItem>
            <MenuItem value="PRESTADA">PRESTADA</MenuItem>
            <MenuItem value="EN_REPARACION">EN REPARACION</MenuItem>
            <MenuItem value="DADA_DE_BAJA">DAR DE BAJA</MenuItem>
          </TextField>
        )}

        <Button
          type="submit"
          variant="contained"
          sx={skyButtonStyle}
          startIcon={<SaveIcon />}
        >
          Guardar Cambios
        </Button>

        <Typography variant="body2" align="center" sx={{ mt: 1 }}>
          <Link to="/inventario" style={{ color: '#94a3b8', textDecoration: 'none', fontWeight: 600 }}>
            ← Volver al Inventario
          </Link>
        </Typography>
      </Box>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={2500}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity="success"
          variant="filled"
          sx={{
            width: '100%',
            bgcolor: '#0ea5e9',
            color: '#0f172a',
            fontWeight: 700,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
          }}
        >
          {successMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AddEditTool;



