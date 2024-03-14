import { styled } from '@mui/system';
import theme, { radiusOfComponents } from '../../styles/themes.js';

export const CustomCard = styled('div')({
  backgroundColor: theme.palette.background.default,
  width: '100%',
  borderRadius: radiusOfComponents,
  boxShadow:
    '0px 100px 80px rgba(0, 0, 0, 0.07), 0px 41.7776px 33.4221px ' +
    'rgba(0, 0, 0, 0.0503198), 0px 22.3363px 17.869px ' +
    'rgba(0, 0, 0, 0.0417275), 0px 12.5216px 10.0172px ' +
    'rgba(0, 0, 0, 0.035), 0px 6.6501px 5.32008px ' +
    'rgba(0, 0, 0, 0.0282725), 0px 2.76726px ' +
    '2.21381px rgba(0, 0, 0, 0.0196802)',
  border: '2px solid #D9D9D9',
  minHeight: '500px',
  maxWidth: '1300px',
  [theme.breakpoints.down('sm')]: {
    minHeight: 'unset',
  },
});
