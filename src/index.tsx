import { SnackbarProvider } from 'notistack'
import { AnimatePresence } from 'framer-motion'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { Slide, ThemeProvider } from '@mui/material'
import ReactDOM from 'react-dom/client'
import React from 'react'

import 'index.css'
import App from 'App'
import { store } from 'app.store'
import { AppHeader } from 'shared/containers/app-header/AppHeader'
import { theme } from 'theme'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <ThemeProvider theme={theme}>
    <Provider store={store}>
      <SnackbarProvider
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        TransitionComponent={Slide}
        maxSnack={3}
      >
        <BrowserRouter>
          <AppHeader />

          <AnimatePresence>
            <App />
          </AnimatePresence>
        </BrowserRouter>
      </SnackbarProvider>
    </Provider>
  </ThemeProvider>,
)
