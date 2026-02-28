import { useState } from 'react';
import PropTypes from 'prop-types';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

const iconButtonSx = {
  color: '#38bdf8',
  '&:hover': {
    backgroundColor: 'rgba(56, 189, 248, 0.08)',
  },
};

const popoverPaperSx = {
  p: 2.5,
  bgcolor: '#1e293b',
  color: '#e2e8f0',
  border: '1px solid rgba(148, 163, 184, 0.2)',
  maxWidth: 320,
  borderRadius: 2,
  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)',
};

const titleSx = {
  color: '#38bdf8',
  mb: 1.5,
  fontWeight: 700,
  fontSize: '0.9rem',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
};

const listSx = {
  pl: 2,
  m: 0,
  fontSize: '0.875rem',
  color: '#94a3b8',
  lineHeight: 1.6,
};

const listItemStyle = {
  marginBottom: '8px',
};

const PageHelp = ({ title, steps }) => {
  const [anchor, setAnchor] = useState(null);

  const openHelp = (event) => setAnchor(event.currentTarget);
  const closeHelp = () => setAnchor(null);

  return (
    <>
      <Tooltip title="Ayuda sobre esta vista">
        <IconButton onClick={openHelp} sx={iconButtonSx}>
          <HelpOutlineIcon />
        </IconButton>
      </Tooltip>
      <Popover
        open={Boolean(anchor)}
        anchorEl={anchor}
        onClose={closeHelp}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
        slotProps={{
          paper: { sx: popoverPaperSx }
        }}
      >
        <Typography variant="subtitle2" sx={titleSx}>
          {title}
        </Typography>
        <Box component="ul" sx={listSx}>
          {steps.map((step, index) => {
            const itemKey =
              typeof step === 'string'
                ? `step-${step.substring(0, 10).replaceAll(/\s+/g, '')}-${index}`
                : `step-node-${index}`;

            return (
              <li key={itemKey} style={listItemStyle}>
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
  steps: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.node])
  ).isRequired,
};

export default PageHelp;