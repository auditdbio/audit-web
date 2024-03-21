import { createTheme } from '@mui/material';
import { styled } from '@mui/system';

// export const buttonResponsiveStyles = {
//   large: {
//     padding: '16px 48px',
//     fontSize: '18px',
//     borderRadius: '8px',
//     lineHeight: '24px',
//     height: '58px',
//   },
//   medium: {
//     padding: '14px 32px',
//     fontSize: '16px',
//     borderRadius: '6px',
//     lineHeight: '20px',
//     height: '48px',
//   },
//   small: {
//     padding: '10px 24px',
//     fontSize: '14px',
//     borderRadius: '6px',
//     lineHeight: '18px',
//     height: '38px',
//   },
// };

const initialTheme = createTheme({
  shape: {
    borderRadius: 6,
  },
  palette: {
    primary: {
      main: '#FF9900',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#52176D',
    },
    default: {
      main: '#B9B9B9',
    },
    grey: {
      800: 'rgba(15, 100, 226, 0.08)',
    },
    light: {
      main: '#FFFFFF',
    },
    background: {
      default: '#FCFAF6',
    },
    action: {
      active: 'rgba(0, 0, 0, 0.54)',
      hover: 'rgba(0, 0, 0, 0.04)',
      selected: 'rgba(0, 0, 0, 0.08)',
      disabled: 'rgba(0, 0, 0, 0.26)',
      disabledBackground: 'rgba(0, 0, 0, 0.12)',
      focus: 'rgba(0, 0, 0, 0.12)',
    },
  },
  typography: {
    fontFamily: 'Montserrat !important',
  },
  breakpoints: {
    values: {
      zero: 0,
      xxs: 400,
      xs: 769,
      sm: 1024,
      md: 1290,
      lg: 1550,
      xl: 1920,
    },
  },
});

export const radiusOfComponents = '14px';

export const ContentWrapper = styled('div')({
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
});

const theme = createTheme(initialTheme, {
  ...initialTheme,
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          padding: '32px',
          boxShadow: '10px 10px 40px rgba(0, 0, 0, 0.05)',
          height: '100%',
          borderRadius: radiusOfComponents,
          overflow: 'unset',
          boxSizing: 'border-box',
          [initialTheme.breakpoints.down('md')]: {
            padding: initialTheme.spacing(3),
          },
        },
      },
    },
    MuiSvgIcon: {
      styleOverrides: {
        fontSizeSmall: {
          width: '20px',
          height: '20px',
        },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          color: initialTheme.palette.error.main,
          marginLeft: '14px',
          marginRight: '14px',
        },
      },
    },

    MuiAutocomplete: {
      styleOverrides: {
        popupIndicator: {
          color: initialTheme.palette.text.secondary,
        },
        input: {
          fontSize: '14px',
          fontWeight: '500',
        },
      },
    },
  },
  typography: {
    h1: {
      fontSize: '50px',
      [initialTheme.breakpoints.down('lg')]: {
        fontSize: '42px',
      },
      [initialTheme.breakpoints.down('md')]: {
        fontSize: '36px',
      },
      [initialTheme.breakpoints.down('sm')]: {
        fontSize: '30px',
      },
      [initialTheme.breakpoints.down('xs')]: {
        fontSize: '24px',
      },
    },
    body1: {
      fontSize: '20px',
      [initialTheme.breakpoints.down('lg')]: {
        fontSize: '18px',
      },
      [initialTheme.breakpoints.down('md')]: {
        fontSize: '16px',
      },
    },
    body2: {
      fontSize: '20px',
      [initialTheme.breakpoints.down('md')]: {
        fontSize: '15px',
      },
      [initialTheme.breakpoints.down('sm')]: {
        fontSize: '12px',
      },
    },
  },
});

export default theme;
