import Badge from '@mui/material/Badge';
import { styled } from '@mui/material/styles';

export const CustomBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    border: `2px solid ${theme.palette.background.paper}`,
    padding: '0 4px',
    background: 'orange',
  },
}));
