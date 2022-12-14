import {
  Avatar,
  Button,
  IconButton,
  InputAdornment,
  InputBase,
  InputLabel,
  Tooltip,
  Typography,
} from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import { cn } from '@bem-react/classname'
import { User } from 'shared/models/User'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { CheckCircleOutline, ModeEdit } from '@mui/icons-material'

import { userActions } from 'user/state/user.reducer'
import { selectUser } from 'user/state/user.selectors'
import './Cabinet.scss'

const componentId = 'Cabinet'
const bem = cn(componentId)

export const Cabinet: React.FC = () => {
  const user = useSelector(selectUser) as User

  const [name, setName] = useState(user.name)
  const [changName, setChangeName] = useState<Boolean>(false)

  const dispatch = useDispatch()

  const editUsername = (): void => {
    setChangeName((prev) => !prev)

    if (changName && name !== user.name) {
      dispatch(userActions.setUserName(name))
    }
  }

  const handleDelete = (): void => {
    dispatch(userActions.userDelete())
  }

  const nameEditHandler = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setName(event.target.value)
  }

  return (
    <motion.div
      className={bem()}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Typography variant="h5" className={bem('Title')}>
        User page
      </Typography>
      <div className={bem('Body')}>
        <Grid container spacing={2}>
          <Grid xs={3} style={{ display: 'flex' }}>
            <div className={bem('AvatarContainer')}>
              <Avatar className={bem('Avatar')}>{user.name.substring(0, 1)}</Avatar>

              {/* <Typography
                className={bem('EditAvatar')}
                variant="caption"
                onClick={() => {
                  console.log('avatar change')
                }}
              >
                Edit
              </Typography> */}
            </div>
          </Grid>

          <Grid xs={9}>
            <Grid container spacing={2}>
              <Grid xs={12}>
                <InputLabel htmlFor="username-input" className="InputLable">
                  User name
                </InputLabel>

                <InputBase
                  id="username-input"
                  className={bem('Input')}
                  onChange={nameEditHandler}
                  defaultValue={user.name}
                  disabled={!changName}
                  endAdornment={
                    <InputAdornment position="end">
                      <Tooltip title={changName ? 'save' : 'edit'}>
                        <IconButton
                          tabIndex={-1}
                          aria-label="toggle password visibility"
                          onClick={editUsername}
                        >
                          {!changName ? <ModeEdit /> : <CheckCircleOutline />}
                        </IconButton>
                      </Tooltip>
                    </InputAdornment>
                  }
                />
              </Grid>
            </Grid>

            <Grid xs={12}>
              <InputLabel htmlFor="email-input" className="InputLable">
                E-mail
              </InputLabel>

              <InputBase
                id="email-input"
                className={bem('Input')}
                defaultValue={user.email}
                disabled
              />
            </Grid>
          </Grid>

          <Grid xs={6} style={{ display: 'flex' }}>
            <Button className={bem('Button', { password: true })} variant="contained">
              change password
            </Button>
          </Grid>

          <Grid xs={6} style={{ display: 'flex' }}>
            <Button
              className={bem('Button', { delete: true })}
              variant="contained"
              onClick={handleDelete}
            >
              delete account
            </Button>
          </Grid>
        </Grid>
      </div>
    </motion.div>
  )
}
