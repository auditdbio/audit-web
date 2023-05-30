import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import theme from '../styles/themes.js';
import { Box } from '@mui/system';
import { Typography } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import Markdown from './custom/Markdown.jsx';

export default function ProjectModal({ open, handleClose, project }) {
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogContent sx={modalWindow}>
        <Box sx={titlesBox}>
          <Typography sx={modalHeader}>{project.name}</Typography>
          <Typography sx={modalSubheader}>
            {' '}
            {project.tags
              .map(item => item.charAt(0).toUpperCase() + item.slice(1))
              .join(', ')}
          </Typography>
          <Markdown value={project.description} />
        </Box>
        <Box sx={linksList}>
          {project.scope.map((item, index) => (
            <Box sx={linkGroup} key={index}>
              <GitHubIcon sx={iconStyle} />
              <a href={item} target="_blank">
                <Typography sx={linkStyle}>{item}</Typography>
              </a>
            </Box>
          ))}
        </Box>
        <Box sx={fieldButtonContainer}>
          <Button sx={backButton} onClick={handleClose}>
            Back
          </Button>
          <Button sx={findButton}>Make offer</Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

const modalWindow = {
  backgroundColor: theme.palette.background,

  width: '600px',
  display: 'flex',
  gap: '50px',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  padding: {
    zero: '25px',
    sm: '25px',
    md: '45px',
    lg: '50px',
  },
  [theme.breakpoints.down('sm')]: {
    height: '100%',
    width: '100%',
    gap: '20px',
  },
};

const titlesBox = {
  maxWidth: '400px',
  display: 'flex',
  flexDirection: 'column',
  gap: {
    zero: '10px',
    sm: '15px',
    md: '25px',
    lg: '30px',
  },
  alignItems: 'center',
};

const modalHeader = {
  fontSize: {
    zero: '25px',
    sm: '30px',
    md: '33px',
    lg: '37px',
  },
  fontWeight: '500',
};

const modalSubheader = {
  textAlign: 'center',
  fontSize: {
    zero: '16px',
    sm: '20px',
    md: '22px',
    lg: '25px',
  },
  fontWeight: '400',
};

const modalDescription = {
  fontSize: {
    zero: '12px',
    sm: '12px',
    md: '14px',
    lg: '15px',
  },
  fontWeight: '400',
};

const linksList = {
  display: 'flex',
  flexDirection: 'column',
  gap: {
    zero: '10px',
    sm: '15px',
    md: '2px',
    lg: '20px',
  },
};

const iconStyle = {
  fontSize: {
    zero: '15px',
    sm: '20px',
    md: '25px',
    lg: '30px',
  },
};
const linkStyle = {
  fontSize: {
    zero: '12px',
    sm: '12px',
    md: '14px',
    lg: '16px',
  },
  width: {
    zero: '180px',
    sm: '300px',
    md: '400px',
    lg: '450px',
  },
  whiteSpace: 'nowrap',
  color: '#152BEA',
  textDecoration: 'underline',
  textOverflow: 'ellipsis',
  overflow: 'hidden',
};

const linkGroup = {
  maxWidth: {
    zero: '280px',
    sm: '380px',
    md: '550px',
    lg: '550px',
  },
  display: 'flex',
  gap: {
    zero: '10px',
    sm: '12px',
    md: '14px',
    lg: '16px',
  },
  alignItems: 'center',
};
const fieldButtonContainer = {
  display: 'flex',
  gap: '10px',
};

const findButton = {
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.background.default,
  borderRadius: '4px',
  // padding: "12px 63px",
  height: '45px',
  width: {
    zero: '100px',
    sm: '100px',
    md: '150px',
    lg: '230px',
  },
  textTransform: 'none',
  ':hover': {
    backgroundColor: theme.palette.primary.main,
  },
  [theme.breakpoints.down('sm')]: {
    height: '30px',
    fontSize: '10px',
    // padding: "6px 31px",
  },
};

const backButton = {
  backgroundColor: theme.palette.secondary.main,
  color: theme.palette.background.default,
  borderRadius: '4px',
  width: {
    zero: '100px',
    sm: '100px',
    md: '150px',
    lg: '230px',
  },
  // padding: "12px 63px",
  height: '45px',
  textTransform: 'none',
  ':hover': {
    backgroundColor: theme.palette.secondary.main,
  },
  [theme.breakpoints.down('sm')]: {
    height: '30px',
    fontSize: '10px',
    // padding: "6px 31px",
  },
};
