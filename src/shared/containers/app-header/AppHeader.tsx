import React, { useEffect } from 'react'
import { Box, Button, Link, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { cn } from '@bem-react/classname'
import Grid from '@mui/material/Unstable_Grid2'

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
      <Grid xs={0} md={5} display="flex">
        {user === null ? <HeaderLinks navigator={navigate} /> : null}
      </Grid>

      <Grid xs={7} md={4} display="flex">
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

    // <div className={bem()} data-testid={bem()}>
    //   <div className={bem('Logo')} onClick={() => navigate('/main')}>
    //     <h1 className={bem('Audit')}>Audit</h1>
    //     <h1 className={bem('DB')}>DB</h1>
    //   </div>
    //   {user === null ? (
    //     <motion.div
    //       className={bem('Panel')}
    //       initial={{ opacity: 0 }}
    //       animate={{ opacity: 1 }}
    //       exit={{ opacity: 0 }}
    //     >
    //       <Link underline="none" className={bem('Link')} data-testd={bem('Product')}>
    //         Product
    //       </Link>

    //       <Link underline="none" className={bem('Link')} data-testd={bem('AboutUs')}>
    //         About Us
    //       </Link>

    //       <Link
    //         underline="none"
    //         className={bem('Link')}
    //         data-testd={bem('Community')}
    //         href={SWAGGER}
    //         target="_blank"
    //       >
    //         API
    //       </Link>
    //     </motion.div>
    //   ) : (
    //     <UserNavigate navigator={navigate} />
    //   )}

    //   {user == null ? (
    //     <div className={bem('Links')} data-testd={bem('Links')}>
    //       <motion.div
    //         className="motion-container"
    //         initial={{ opacity: 0 }}
    //         animate={{ opacity: 1 }}
    //         exit={{ opacity: 0 }}
    //       >
    //         <Button
    //           variant="contained"
    //           color="warning"
    //           className={bem('Sign', { in: true })}
    //           data-testid={bem('SignIn')}
    //           onClick={() => navigate('/sign-in')}
    //         >
    //           Sign In
    //         </Button>

    //         <Button
    //           variant="outlined"
    //           className={bem('Sign', { up: true })}
    //           data-testid={bem('SignUp')}
    //           onClick={() => navigate('/sign-up')}
    //         >
    //           Sign Up
    //         </Button>
    //       </motion.div>
    //     </div>
    //   ) : (
    //     <UserControl user={user} />
    //   )}
    // </div>
  )
}
