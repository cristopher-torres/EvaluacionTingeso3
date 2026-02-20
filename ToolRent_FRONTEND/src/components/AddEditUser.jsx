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
import { Select, MenuItem, Backdrop, CircularProgress } from "@mui/material";

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

  const [titleUserForm, setTitleUserForm] = useState("Nuevo Usuario");
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
    
    // Validación de longitud mínima de RUT (8 o 9 dígitos)
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
      setSuccessMessage(userId ? "Usuario actualizado ✅" : "Usuario creado ✅");
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
      color: "white",
      "& fieldset": { borderColor: "rgba(0, 210, 255, 0.3)" },
      "&:hover fieldset": { borderColor: "#00d2ff" },
      "&.Mui-focused fieldset": { borderColor: "#00d2ff" },
    },
    "& .MuiInputLabel-root": { color: "#b392f0" },
    "& .MuiInputLabel-root.Mui-focused": { color: "#00d2ff" },
  };

  const handleKeyDown = (e, nextRef) => {
    if (e.key === "Enter") {
      e.preventDefault();
      nextRef.current?.focus();
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" sx={{ backgroundColor: "#100524", p: 2 }}>
      <Backdrop sx={{ color: '#00d2ff', zIndex: 10, backgroundColor: 'rgba(16, 5, 36, 0.8)' }} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>

      <Box component="form" onSubmit={saveUser} sx={{ display: "flex", flexDirection: "column", gap: 2.5, width: "100%", maxWidth: "500px", padding: 4, borderRadius: 3, boxShadow: "0 8px 32px rgba(232, 28, 255, 0.2)", backgroundColor: "#1d0b3b", border: "1px solid rgba(232, 28, 255, 0.4)" }}>
        <Typography variant="h5" align="center" sx={{ color: "#00d2ff", fontWeight: "bold", mb: 1 }}>{titleUserForm}</Typography>

        <TextField 
          label="RUT" value={rut} 
          onChange={(e) => setRut(formatRut(e.target.value))} 
          onKeyDown={(e) => handleKeyDown(e, nameRef)}
          required sx={inputSx} placeholder="12.345.678-9"
          helperText={rut.replace(/[^0-9kK]/g, "").length > 0 && rut.replace(/[^0-9kK]/g, "").length < 8 ? "Mínimo 8 dígitos" : ""}
          error={rut.replace(/[^0-9kK]/g, "").length > 0 && rut.replace(/[^0-9kK]/g, "").length < 8}
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
            sx={{ ...inputSx, width: '220px', color: 'white' }}
            MenuProps={{ PaperProps: { sx: { bgcolor: "#1d0b3b", color: "white" } } }}
          >
            {domains.map((d) => <MenuItem key={d} value={d}>{d}</MenuItem>)}
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
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, bgcolor: 'rgba(0,210,255,0.1)', p: 0.5, borderRadius: 1, border: '1px solid #00d2ff' }}>
                  <span style={{ fontSize: '1.2rem' }}>🇨🇱</span>
                  <Typography sx={{ color: '#00d2ff', fontWeight: 'bold', fontSize: '0.9rem' }}>+56 9</Typography>
                </Box>
              </InputAdornment>
            ),
          }}
        />
        
        <TextField label="Nombre de usuario" inputRef={userRef} value={username} onChange={(e) => setUsername(e.target.value)} onKeyDown={(e) => handleKeyDown(e, submitBtnRef)} required sx={inputSx} />

        <Button type="submit" variant="contained" ref={submitBtnRef} disabled={loading} sx={{ mt: 2, backgroundColor: "rgba(0, 210, 255, 0.1)", border: "1px solid #00d2ff", color: "#00d2ff", fontWeight: "bold", py: 1.5, "&:hover": { backgroundColor: "#00d2ff", color: "#100524", boxShadow: "0 0 20px rgba(0, 210, 255, 0.4)" } }} startIcon={<SaveIcon />}>
          Guardar Usuario
        </Button>
      </Box>

      <Snackbar open={openSnackbar} autoHideDuration={2000} onClose={() => setOpenSnackbar(false)} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
        <Alert severity="success" variant="filled" sx={{ bgcolor: "#00d2ff", color: "#100524", fontWeight: "bold" }}>{successMessage}</Alert>
      </Snackbar>

      <Snackbar open={openErrorSnackbar} autoHideDuration={5000} onClose={() => setOpenErrorSnackbar(false)} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
        <Alert severity="error" variant="filled" sx={{ bgcolor: "#f44336", color: "white", fontWeight: "bold" }}>{errorMessage}</Alert>
      </Snackbar>
    </Box>
  );
};

export default AddEditUser;



