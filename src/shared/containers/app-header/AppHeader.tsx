import Grid from '@mui/material/Unstable_Grid2'
import React, { useEffect, useRef } from 'react'
import { cn } from '@bem-react/classname'
import { motion } from 'framer-motion'
import { Box, Button } from '@mui/material'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { selectUser } from 'user/state/user.selectors'
import { UserControl } from 'shared/components/user-contol/UserControl'
import { HeaderLinks } from 'shared/components/header-links/HeaderLinks'
import { UserNavigate } from 'shared/components/user-navigate/UserNavigate'
import './AppHeader.scss'

const componentId = 'AppHeader'
const bem = cn(componentId)

export const AppHeader: React.FC = () => {
  const user = useSelector(selectUser)
  const navigate = useNavigate()

  return (
    <Grid container spacing={2} className={bem()} data-testid={bem()}>
      <Grid xs={3} display="flex">
        <Box className={bem('Logo')} onClick={() => navigate('/main')}>
          <form className={bem('Audit')}>Audit</form>
          <form className={bem('DB')}>DB</form>
        </Box>
      </Grid>
      <Grid xs={0} md={4.5} display="flex">
        {user === null ? <HeaderLinks navigator={navigate} /> : null}
      </Grid>

      <Grid xs={8.5} md={4.5} display="flex">
        {user === null ? (
          <motion.div
            className={bem('Buttons')}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Button
              variant="contained"
              color="warning"
              className={bem('Sign', { in: true })}
              data-testid={bem('SignIn')}
              onClick={() => navigate('/sign-in')}
            >
              Sign In
            </Button>

            <Button
              variant="outlined"
              className={bem('Sign', { up: true })}
              data-testid={bem('SignUp')}
              onClick={() => navigate('/sign-up')}
            >
              Sign Up
            </Button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={bem('UserPanel')}
          >
            <UserNavigate navigator={navigate} />
            <UserControl user={user} />
          </motion.div>
        )}
      </Grid>
    </Grid>
  )
}
