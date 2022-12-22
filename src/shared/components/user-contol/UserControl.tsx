import React from 'react'
import { cn } from '@bem-react/classname'
import { motion } from 'framer-motion'
import { Avatar, IconButton, Menu, MenuItem, Tooltip, Typography } from '@mui/material'

import { useDispatch } from 'react-redux'
import { userActions } from 'user/state/user.reducer'
import { User } from 'shared/models/user'
import './UserControl.scss'
import { useNavigate } from 'react-router-dom'

const componentId = 'UserControl'
const bem = cn(componentId)

export const UserControl: React.FC<{ user: User }> = ({ user }) => {
  const dispatch = useDispatch()
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const navigate = useNavigate()

  const handleClose = () => {
    setAnchorEl(null)
  }
  const handleIconClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleLogout = () => {
    dispatch(userActions.logout())
  }

  return (
    <motion.div
      className={bem()}
      data-testid={bem()}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Typography
        className={bem('UserName')}
        data-testid={bem('UserName')}
        variant="h6"
        color="inherit"
        component="div"
      >
        {user.name}
      </Typography>

      <Tooltip title="Account">
        <IconButton
          className={bem('IconButton')}
          data-testid={bem('IconButton')}
          onClick={handleIconClick}
          size="small"
        >
          <Avatar>{user.name.substring(0, 1)}</Avatar>
        </IconButton>
      </Tooltip>

      <Menu
        className={bem('Menu')}
        data-testid={bem('Menu')}
        id="account-menu"
        onClose={handleClose}
        open={!!anchorEl}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
      >
        <MenuItem
          className={bem('Auditor')}
          data-testid={bem('Auditor')}
          onClick={() => {
            navigate('/auditor-page')
            handleClose()
          }}
        >
          Auditor
        </MenuItem>

        <MenuItem
          className={bem('Customer')}
          data-testid={bem('Customer')}
          onClick={() => {
            navigate('/customer-page')
            handleClose()
          }}
        >
          Customer
        </MenuItem>

        <MenuItem
          className={bem('MyAccount')}
          data-testid={bem('MyAccount')}
          onClick={() => {
            navigate('/profile')
            handleClose()
          }}
        >
          User profile
        </MenuItem>

        <MenuItem
          className={bem('Logout')}
          data-testid={bem('Logout')}
          onClick={handleLogout}
        >
          Logout
        </MenuItem>
      </Menu>
    </motion.div>
  )
}
