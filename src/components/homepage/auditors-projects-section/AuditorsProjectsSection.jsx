import { Box, Divider } from '@mui/material';
import AuditorSection from './AuditorSection';
import ProjectSection from './ProjectSection';

const AuditorsProjectsSection = () => {
  return (
    <Box sx={wrapperStyle} component="section">
      <Box sx={AuditorsProjectsSectionStyle}>
        <AuditorSection />
        <Divider orientation="vertical" flexItem sx={divider} light />
        <ProjectSection />
      </Box>
    </Box>
  );
};

export const sliceCards = (sm, xs) => {
  if (xs) return [0, 4];
  if (sm) return [0, 3];
  return [0, 4];
};

const wrapperStyle = {
  backgroundColor: '#52176D',
  width: '100%',
  paddingY: '3rem',
};

const AuditorsProjectsSectionStyle = theme => ({
  width: '100%',
  maxWidth: '1512px',
  backgroundColor: theme.palette.secondary.main,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  gap: '3rem',
  color: 'white',
  marginX: 'auto',
  [theme.breakpoints.down('lg')]: {
    paddingX: '5%',
    gap: '1rem',
  },
});

const divider = {
  backgroundColor: 'white',
  color: 'white',
};

export default AuditorsProjectsSection;
