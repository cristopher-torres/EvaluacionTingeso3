import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import toolService from "../services/tool.service";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import SaveIcon from "@mui/icons-material/Save";
import Typography from "@mui/material/Typography";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { useKeycloak } from "@react-keycloak/web";

const AddEditTool = () => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [replacementValue, setReplacementValue] = useState("");
  const [dailyRate, setDailyRate] = useState("");
  const [dailyLateRate, setDailyLateRate] = useState("");
  const [repairValue, setRepairValue] = useState("");
  const [status, setStatus] = useState("DISPONIBLE");

  const { id } = useParams();
  const [titleToolForm, setTitleToolForm] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
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
      status
    };

    if (id) {
      toolService.update(tool, rut)
        .then(() => {
          setSuccessMessage("Herramienta actualizada exitosamente ✅");
          setOpenSnackbar(true);
          setTimeout(() => navigate("/inventario"), 3000);
        })
        .catch((error) => console.error("Error al actualizar herramienta ❌", error));
    } else {
      toolService.create(tool, Number(quantity), rut)
        .then(() => {
          setSuccessMessage("Herramienta creada exitosamente ✅");
          setOpenSnackbar(true);
          setTimeout(() => navigate("/inventario"), 1500);
        })
        .catch((error) => console.error("Error al crear herramienta ❌", error));
    }
  };

  useEffect(() => {
    if (id) {
      setTitleToolForm("Editar Herramienta");
      toolService.get(id)
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
        .catch((error) => console.error("Error al cargar herramienta ❌", error));
    } else {
      setTitleToolForm("Nueva Herramienta");
    }
  }, [id]);

  // Estilo común para los inputs neón
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
    "& .MuiSelect-select": { color: "white" }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      sx={{ backgroundColor: "#100524", p: 2 }} // Fondo morado profundo
    >
      <Box
        component="form"
        onSubmit={saveTool}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2.5,
          width: "100%",
          maxWidth: "500px",
          padding: 4,
          borderRadius: 3,
          boxShadow: "0 8px 32px rgba(232, 28, 255, 0.2)",
          backgroundColor: "#1d0b3b", // Morado de tarjeta
          border: "1px solid rgba(232, 28, 255, 0.4)",
        }}
      >
        <Typography variant="h5" align="center" sx={{ color: "#00d2ff", fontWeight: "bold", mb: 1 }}>
          {titleToolForm}
        </Typography>

        <FormControl fullWidth>
          <TextField
            label="Nombre de Herramienta"
            value={name}
            variant="outlined"
            onChange={(e) => setName(e.target.value)}
            required
            sx={inputSx}
          />
        </FormControl>

        <FormControl fullWidth>
          <TextField
            label="Categoría"
            value={category}
            select
            variant="outlined"
            onChange={(e) => setCategory(e.target.value)}
            required
            sx={inputSx}
            SelectProps={{ 
                MenuProps: { 
                    PaperProps: { 
                        sx: { 
                            bgcolor: "#1d0b3b", 
                            color: "white",
                            border: "1px solid #00d2ff",
                            "& .MuiMenuItem-root:hover": { bgcolor: "rgba(0, 210, 255, 0.1)" }
                        } 
                    } 
                } 
            }}
          >
            <MenuItem value="Herramientas Eléctricas">Herramientas Eléctricas</MenuItem>
            <MenuItem value="Herramientas Manuales">Herramientas Manuales</MenuItem>
            <MenuItem value="Construcción">Construcción</MenuItem>
            <MenuItem value="Carpintería">Carpintería</MenuItem>
            <MenuItem value="Jardinería">Jardinería</MenuItem>
          </TextField>
        </FormControl>

        {!id && (
          <FormControl fullWidth>
            <TextField
              label="Cantidad inicial"
              type="number"
              value={quantity}
              variant="outlined"
              onChange={(e) => setQuantity(e.target.value)}
              required
              sx={inputSx}
            />
          </FormControl>
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
            />
            <TextField
                fullWidth
                label="Tarifa Diaria"
                type="number"
                value={dailyRate}
                onChange={(e) => setDailyRate(e.target.value)}
                sx={inputSx}
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
            />
            <TextField
                fullWidth
                label="Costo Reparación"
                type="number"
                value={repairValue}
                onChange={(e) => setRepairValue(e.target.value)}
                sx={inputSx}
            />
        </Box>

        {id && (
          <FormControl fullWidth>
            <TextField
              label="Estado"
              value={status}
              select
              variant="outlined"
              onChange={(e) => setStatus(e.target.value)}
              required
              sx={inputSx}
              SelectProps={{ 
                  MenuProps: { 
                      PaperProps: { 
                          sx: { 
                              bgcolor: "#1d0b3b", 
                              color: "white",
                              border: "1px solid #00d2ff"
                          } 
                      } 
                  } 
              }}
            >
              <MenuItem value="DISPONIBLE">DISPONIBLE</MenuItem>
              <MenuItem value="PRESTADA">PRESTADA</MenuItem>
              <MenuItem value="EN_REPARACION">EN REPARACION</MenuItem>
              <MenuItem value="DADA_DE_BAJA">DAR DE BAJA</MenuItem>
            </TextField>
          </FormControl>
        )}

        <Button
          type="submit"
          variant="contained"
          sx={{
            mt: 2,
            backgroundColor: "rgba(0, 210, 255, 0.1)",
            border: "1px solid #00d2ff",
            color: "#00d2ff",
            fontWeight: "bold",
            py: 1.5,
            textTransform: "none",
            fontSize: "1rem",
            "&:hover": { 
                backgroundColor: "#00d2ff", 
                color: "#100524",
                boxShadow: "0 0 20px rgba(0, 210, 255, 0.6)" 
            },
          }}
          startIcon={<SaveIcon />}
        >
          Guardar Cambios
        </Button>

        <Typography variant="body2" align="center" sx={{ mt: 1 }}>
          <Link to="/inventario" style={{ color: "#b392f0", textDecoration: "none", fontWeight: "bold" }}>
            ← Volver al Inventario
          </Link>
        </Typography>
      </Box>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={2500}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity="success"
          variant="filled"
          sx={{ 
              width: "100%", 
              bgcolor: "#00d2ff", 
              color: "#100524", 
              fontWeight: "bold",
              boxShadow: "0 0 15px rgba(0, 210, 255, 0.5)"
          }}
        >
          {successMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AddEditTool;



