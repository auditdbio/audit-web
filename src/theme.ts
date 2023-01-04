import { createTheme } from '@mui/material'

const COLOR_PRIMARY = '#ff9900'
const COLOR_SECCONDARY = '#52176d'

export const theme = createTheme({
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          fontFamily: '"Montserrat", sans-serif',
          fontWeight: 'bold',
          borderRadius: '9px',
          boxShadow: '0 0',
        },
      },
    },

    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontFamily: 'Montserrat',
        },
      },
    },

    MuiDialog: {
      styleOverrides: {
        root: {
          minWidth: '350px',
        },
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: {
          fontFamily: '"Montserrat", sans-serif',
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '20px',
          margin: '0 10px',
        },
      },
    },

    MuiCardContent: {
      styleOverrides: {
        root: {
          display: 'flex',
          flexDirection: 'column',
        },
      },
    },
  },
})
