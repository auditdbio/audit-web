import { createTheme } from '@mui/material'

const COLOR_PRIMARY = '#ff9900'
const COLOR_SECCONDARY = '#52176d'

export const theme = createTheme({
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          fontFamily: '"Montserrat", sans-serif',
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
          borderRadius: '20px',
        },
      },
    },

    MuiInputLabel: {},

    // MuiInput: {
    //   styleOverrides: {
    //     root: {
    //       color: WHITE,
    //       ':after': {
    //         borderBottomColor: INPUT_UNDERLINE_COLOR,
    //       },
    //       ':not(.Mui-disabled):after': {
    //         borderBottomColor: INPUT_UNDERLINE_COLOR,
    //       },
    //       ':hover:not(.Mui-disabled):after': {
    //         borderBottomColor: INPUT_UNDERLINE_COLOR,
    //       },
    //       ':not(.Mui-disabled):before': {
    //         borderBottomColor: INPUT_UNDERLINE_COLOR,
    //       },
    //       ':hover:not(.Mui-disabled):before': {
    //         borderBottomColor: INPUT_UNDERLINE_COLOR,
    //       },
    //     },
    //     colorSecondary: {
    //       color: WHITE,
    //     },
    //   },
    // },
  },
})
