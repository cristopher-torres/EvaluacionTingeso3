import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import userService from "../services/user.service";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import SaveIcon from "@mui/icons-material/Save";
import Typography from "@mui/material/Typography";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import InputAdornment from "@mui/material/InputAdornment";
import { Select, MenuItem, Backdrop, CircularProgress, Tooltip } from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import PageHelp from "../components/PageHelp";
import { Link } from "react-router-dom";

const AddEditUser = () => {
  const { userId } = useParams();
  const [rut, setRut] = useState("");
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [emailLocal, setEmailLocal] = useState("");
  const [emailDomain, setEmailDomain] = useState("@gmail.com");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [username, setUsername] = useState("");
  const [status, setStatus] = useState("ACTIVO");

  // Corrección Sonar: Se usa constante en lugar de estado innecesario
  const titleUserForm = userId ? "Editar Usuario" : "Nuevo Usuario";
  
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false);

  const nameRef = useRef(null);
  const lastNameRef = useRef(null);
  const emailRef = useRef(null);
  const phoneRef = useRef(null);
  const userRef = useRef(null);
  const submitBtnRef = useRef(null);

  const domains = ["@gmail.com", "@outlook.com", "@hotmail.com", "@yahoo.com"];

  useEffect(() => {
    if (userId) {
      setLoading(true);
      userService.get(userId)
        .then((response) => {
          const user = response.data;
          setRut(user.rut);
          setName(user.name);
          setLastName(user.lastName);
          const [local, domain] = user.email.split("@");
          setEmailLocal(local);
          setEmailDomain(`@${domain}`);
          setPhoneNumber(user.phoneNumber.replace("+569", ""));
          setUsername(user.username);
          setStatus(user.status);
        })
        .catch((error) => console.error(error))
        .finally(() => setLoading(false));
    }
  }, [userId]);

  const formatRut = (value) => {
    let cleanValue = value.replace(/[^0-9kK]/g, "");
    if (cleanValue.length > 9) cleanValue = cleanValue.slice(0, 9);
    if (cleanValue.length <= 1) return cleanValue;
    let body = cleanValue.slice(0, -1);
    let dv = cleanValue.slice(-1).toUpperCase();
    body = body.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return `${body}-${dv}`;
  };

  const saveUser = (e) => {
    e.preventDefault();
    const rawRut = rut.replace(/[^0-9kK]/g, "");
    if (rawRut.length < 8) {
      setErrorMessage("El RUT debe tener al menos 8 caracteres.");
      setOpenErrorSnackbar(true);
      return;
    }

    setLoading(true);
    const fullEmail = `${emailLocal}${emailDomain}`;
    const userData = { 
      rut, name, lastName, 
      email: fullEmail, 
      phoneNumber: `+569${phoneNumber}`, 
      username, status, role: "CLIENT" 
    };

    const handleResponse = () => {
      setSuccessMessage(userId ? "Usuario actualizado exitosamente ✅" : "Usuario creado exitosamente ✅");
      setOpenSnackbar(true);
      setTimeout(() => navigate("/users/list"), 2000);
    };

    const handleError = (err) => {
      const msg = err.response?.data;
      setErrorMessage(typeof msg === 'string' ? msg : "Error al procesar la solicitud");
      setOpenErrorSnackbar(true);
    };

    if (userId) {
      userService.updateUser(userId, userData).then(handleResponse).catch(handleError).finally(() => setLoading(false));
    } else {
      userService.createUser(userData).then(handleResponse).catch(handleError).finally(() => setLoading(false));
    }
  };

  const inputSx = {
    "& .MuiOutlinedInput-root": {
      color: "#e2e8f0",
      "& fieldset": { borderColor: "rgba(148, 163, 184, 0.12)" },
      "&:hover fieldset": { borderColor: "rgba(56, 189, 248, 0.4)" },
      "&.Mui-focused fieldset": { borderColor: "#38bdf8" },
    },
    "& .MuiInputLabel-root": { color: "#94a3b8" },
    "& .MuiInputLabel-root.Mui-focused": { color: "#38bdf8" },
  };

  const skyButtonStyle = {
    mt: 2,
    backgroundColor: "rgba(56, 189, 248, 0.07)",
    border: "1px solid rgba(56, 189, 248, 0.2)",
    color: "#7dd3fc",
    fontWeight: 600,
    py: 1.5,
    textTransform: "none",
    fontSize: "1rem",
    "&:hover": { 
      backgroundColor: "rgba(56, 189, 248, 0.14)", 
      color: "#e2e8f0",
      border: "1px solid rgba(56, 189, 248, 0.4)",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)"
    },
    "&:disabled": { color: "rgba(148, 163, 184, 0.3)" }
  };

  const handleKeyDown = (e, nextRef) => {
    if (e.key === "Enter") {
      e.preventDefault();
      nextRef.current?.focus();
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" sx={{ backgroundColor: "#0f172a", p: 2 }}>
      <Backdrop sx={{ color: '#38bdf8', zIndex: 1201, backgroundColor: 'rgba(15, 23, 42, 0.9)' }} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>

      <Box 
        component="form" 
        onSubmit={saveUser} 
        sx={{ 
          display: "flex", 
          flexDirection: "column", 
          gap: 2.5, 
          width: "100%", 
          maxWidth: "500px", 
          padding: 4, 
          borderRadius: 3, 
          backgroundColor: "#1e293b", 
          border: "1px solid rgba(148, 163, 184, 0.1)", 
          borderTop: "3px solid rgba(56, 189, 248, 0.4)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.5)" 
        }}
      >
        
        <Box display="flex" justifyContent="center" alignItems="center" gap={1} mb={1}>
          <Typography variant="h5" align="center" sx={{ color: "#38bdf8", fontWeight: 700 }}>
            {titleUserForm}
          </Typography>
          <PageHelp 
            title="Registro de Usuario" 
            steps={[
              "Ingrese el RUT incluyendo puntos y guión.",
              "El número de teléfono debe constar de 8 dígitos.",
              "Verifique que el dominio de correo seleccionado sea el correcto.",
              "Solo se permiten números de teléfono de Chile (+56 9).",
            ]} 
          />
        </Box>

        <TextField 
          label="RUT" value={rut} 
          onChange={(e) => setRut(formatRut(e.target.value))} 
          onKeyDown={(e) => handleKeyDown(e, nameRef)}
          required sx={inputSx} placeholder="12.345.678-9"
          error={rut.replace(/[^0-9kK]/g, "").length > 0 && rut.replace(/[^0-9kK]/g, "").length < 8}
          InputProps={{
            endAdornment: (
              rut.replace(/[^0-9kK]/g, "").length > 0 && rut.replace(/[^0-9kK]/g, "").length < 8 ? (
                <Tooltip title="Mínimo 8 dígitos" arrow placement="top">
                  <HelpOutlineIcon sx={{ color: "#f87171", fontSize: "1.2rem", cursor: "help" }} />
                </Tooltip>
              ) : null
            ),
          }}
        />
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField fullWidth label="Nombre" inputRef={nameRef} value={name} onChange={(e) => setName(e.target.value)} onKeyDown={(e) => handleKeyDown(e, lastNameRef)} required sx={inputSx} />
          <TextField fullWidth label="Apellido" inputRef={lastNameRef} value={lastName} onChange={(e) => setLastName(e.target.value)} onKeyDown={(e) => handleKeyDown(e, emailRef)} required sx={inputSx} />
        </Box>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField 
            fullWidth label="Email" inputRef={emailRef} value={emailLocal} 
            onChange={(e) => setEmailLocal(e.target.value)} 
            onKeyDown={(e) => handleKeyDown(e, phoneRef)}
            required sx={inputSx} placeholder="usuario"
          />
          <Select
            value={emailDomain}
            onChange={(e) => setEmailDomain(e.target.value)}
            sx={{ 
              ...inputSx, 
              width: '220px', 
              color: '#e2e8f0',
              "& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(148, 163, 184, 0.12)" },
              "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(56, 189, 248, 0.4)" },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#38bdf8" }
            }}
            MenuProps={{ PaperProps: { sx: { bgcolor: "#1e293b", color: "#e2e8f0", border: '1px solid rgba(148, 163, 184, 0.2)' } } }}
          >
            {domains.map((d) => <MenuItem key={d} value={d} sx={{ "&:hover": { bgcolor: "rgba(56, 189, 248, 0.08)" } }}>{d}</MenuItem>)}
          </Select>
        </Box>
        
        <TextField 
          label="Teléfono" inputRef={phoneRef} value={phoneNumber}
          onChange={(e) => {
            const val = e.target.value.replace(/\D/g, "");
            if (val.length <= 8) setPhoneNumber(val);
          }}
          onKeyDown={(e) => handleKeyDown(e, userRef)}
          required sx={inputSx}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, bgcolor: 'rgba(56, 189, 248, 0.05)', p: 0.6, borderRadius: 1, border: '1px solid rgba(56, 189, 248, 0.2)' }}>
                  <span style={{ fontSize: '1.1rem' }}>🇨🇱</span>
                  <Typography sx={{ color: '#38bdf8', fontWeight: 600, fontSize: '0.85rem' }}>+56 9</Typography>
                </Box>
              </InputAdornment>
            ),
            endAdornment: (
              <Tooltip title="Ingrese los 8 dígitos del número celular" arrow placement="top">
                <HelpOutlineIcon sx={{ color: "#94a3b8", fontSize: "1.1rem", cursor: "help", mr: 1 }} />
              </Tooltip>
            )
          }}
        />
        
        <TextField label="Nombre de usuario" inputRef={userRef} value={username} onChange={(e) => setUsername(e.target.value)} onKeyDown={(e) => handleKeyDown(e, submitBtnRef)} required sx={inputSx} />

        <Button type="submit" variant="contained" ref={submitBtnRef} disabled={loading} sx={skyButtonStyle} startIcon={<SaveIcon />}>
          Guardar Usuario
        </Button>

        <Typography variant="body2" align="center" sx={{ mt: 1 }}>
          <Link to="/" style={{ color: "#94a3b8", textDecoration: "none", fontWeight: 600 }}>
            ← Volver al Home
          </Link>
        </Typography>
      </Box>

      <Snackbar open={openSnackbar} autoHideDuration={2000} onClose={() => setOpenSnackbar(false)} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
        <Alert severity="success" variant="filled" sx={{ bgcolor: "#0ea5e9", color: "#0f172a", fontWeight: 700, boxShadow: "0 4px 12px rgba(0,0,0,0.3)" }}>{successMessage}</Alert>
      </Snackbar>

      <Snackbar open={openErrorSnackbar} autoHideDuration={5000} onClose={() => setOpenErrorSnackbar(false)} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
        <Alert severity="error" variant="filled" sx={{ bgcolor: "#f87171", color: "white", fontWeight: 700 }}>{errorMessage}</Alert>
      </Snackbar>
    </Box>
  );
};

export default AddEditUser;