import { useState } from "react";
import PropTypes from "prop-types"; // 1. Importamos PropTypes
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

const PageHelp = ({ title, steps }) => {
  const [anchor, setAnchor] = useState(null);

  const openHelp = (event) => setAnchor(event.currentTarget);
  const closeHelp = () => setAnchor(null);

  return (
    <>
      <Tooltip title="Ayuda sobre esta vista">
        <IconButton 
          onClick={openHelp} 
          sx={{ 
            color: "#38bdf8",
            "&:hover": { backgroundColor: "rgba(56, 189, 248, 0.08)" }
          }}
        >
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
            p: 2.5, 
            bgcolor: '#1e293b', 
            color: '#e2e8f0', 
            border: '1px solid rgba(148, 163, 184, 0.2)',
            maxWidth: 320,
            borderRadius: 2,
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)'
          } 
        }}
      >
        <Typography 
          variant="subtitle2" 
          sx={{ 
            color: "#38bdf8", 
            mb: 1.5, 
            fontWeight: 700, 
            fontSize: '0.9rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}
        >
          {title}
        </Typography>
        <Box 
          component="ul" 
          sx={{ 
            pl: 2, 
            m: 0, 
            fontSize: '0.875rem',
            color: '#94a3b8',
            lineHeight: 1.6
          }}
        >
          {steps.map((step, index) => {
            const itemKey = typeof step === 'string' 
              ? `step-${step.substring(0, 10).replace(/\s+/g, '')}-${index}` 
              : `step-node-${index}`;

            return (
              <li key={itemKey} style={{ marginBottom: '8px' }}>
                {step}
              </li>
            );
          })}
        </Box>
      </Popover>
    </>
  );
};

PageHelp.propTypes = {
  title: PropTypes.string.isRequired,
  steps: PropTypes.array.isRequired,
};

export default PageHelp;