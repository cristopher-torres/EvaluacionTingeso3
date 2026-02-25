import { useState } from "react";
import { IconButton, Tooltip, Popover, Typography, Box } from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

const PageHelp = ({ title, steps }) => {
  const [anchor, setAnchor] = useState(null);

  const openHelp = (event) => setAnchor(event.currentTarget);
  const closeHelp = () => setAnchor(null);

  return (
    <>
      <Tooltip title="Ayuda sobre esta vista">
        <IconButton onClick={openHelp} sx={{ color: "#e81cff" }}>
          <HelpOutlineIcon />
        </IconButton>
      </Tooltip>
      <Popover 
        open={Boolean(anchor)} 
        anchorEl={anchor} 
        onClose={closeHelp}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
        PaperProps={{ 
          sx: { 
            p: 2, 
            bgcolor: '#1d0b3b', 
            color: 'white', 
            border: '1px solid #00d2ff',
            maxWidth: 300,
            boxShadow: '0 4px 20px rgba(0, 210, 255, 0.3)'
          } 
        }}
      >
        <Typography variant="subtitle2" sx={{ color: "#e81cff", mb: 1, fontWeight: "bold", fontSize: '1rem' }}>
          {title}
        </Typography>
        <Box component="ul" sx={{ pl: 2, m: 0, fontSize: '0.9rem' }}>
          {steps.map((step, index) => (
            <li key={index} style={{ marginBottom: '6px' }}>{step}</li>
          ))}
        </Box>
      </Popover>
    </>
  );
};

export default PageHelp;