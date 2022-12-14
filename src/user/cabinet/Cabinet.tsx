import { cn } from '@bem-react/classname'
import { Avatar, InputBase, TextField } from '@mui/material'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { User } from 'shared/models/User'
import { userActions } from 'user/state/user.reducer'
import { selectUser } from 'user/state/user.selectors'
import './Cabinet.scss'
import Grid from '@mui/material/Unstable_Grid2'
import { Edit } from '@mui/icons-material'

const componentId = 'Cabinet'
const bem = cn(componentId)

export const Cabinet: React.FC = () => {
  const user = useSelector(selectUser) as User

  const [name, setName] = useState(user.name)
  const [changName, setChangeName] = useState<Boolean>(false)

  const dispatch = useDispatch()

  const handleEditUsername = (): void => {
    setChangeName((prev) => !prev)
    if (changName) {
      dispatch(userActions.setUserName(name))
    }
  }

  const handleDelete = (): void => {
    dispatch(userActions.userDelete())
  }

  const changeName = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setName(event.target.value)
  }

  return (
    <div className={bem()}>
      <p className={bem('Title')}>User page</p>
      <div className={bem('Body')}>
        <Grid container spacing={2}>
          <Grid className={bem('AvatarContainer')} xs={3}>
            <Avatar className={bem('Avatar')}>{user.name.substring(0, 1)}</Avatar>
          </Grid>

          <Grid xs={9}>
            <Grid container spacing={2}>
              <Grid xs={12}>
                <TextField
                  className={bem('Input')}
                  disabled
                  id="outlined-disabled"
                  label="User name"
                  defaultValue={user.name}
                />
              </Grid>
            </Grid>
            <Grid xs={12}>
              <TextField
                className={bem('Input')}
                disabled
                id="outlined-disabled"
                label="E-mail"
                defaultValue={'user.emailsdfsdfsdfsdfsdfsd'}
              />
            </Grid>
          </Grid>
          {/* <Grid xs={12}>
            <InputBase disabled />
          </Grid> */}
        </Grid>
      </div>
    </div>
  )
}
