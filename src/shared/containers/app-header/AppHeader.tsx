import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Link } from '@mui/material'
import { cn } from '@bem-react/classname'

import { UserControl } from 'shared/components/user-contol/UserControl'
import { selectUser } from 'user/state/user.selectors'
import { AppState } from 'app.store'
import './AppHeader.scss'

const componentId = 'AppHeader'
const bem = cn(componentId)

export const AppHeader: React.FC = () => {
  const user = useSelector(selectUser)
  const navigate = useNavigate()

  return (
    <div className={bem()} data-testid={bem()}>
      <h1
        className={bem('Logo')}
        data-testid={bem('Logo')}
        onClick={() => navigate('/main')}
      >
        Audit
      </h1>

      <div className={bem('Panel')}>
        <Link underline="none" className={bem('Link')} data-testd={bem('Product')}>
          Product
        </Link>

        <Link underline="none" className={bem('Link')} data-testd={bem('AboutUs')}>
          About Us
        </Link>

        <Link
          underline="none"
          className={bem('Link')}
          data-testd={bem('Community')}
          onClick={() => navigate('/cabinet')}
        >
          Community
        </Link>
      </div>

      {user == null ? (
        <div className={bem('Links')} data-testd={bem('Links')}>
          <motion.div
            className="motion-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Link
              underline="none"
              className={bem('Link')}
              data-testid={bem('SignIn')}
              onClick={() => navigate('/sign-in')}
            >
              Sign In
            </Link>

            <Link
              underline="none"
              className={bem('Link')}
              data-testid={bem('SignUp')}
              onClick={() => navigate('/sign-up')}
            >
              Sign Up
            </Link>
          </motion.div>
        </div>
      ) : (
        <UserControl user={user} />
      )}
    </div>
  )
}
