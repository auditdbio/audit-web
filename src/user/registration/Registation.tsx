import {
  MailOutline,
  PersonAdd,
  Visibility,
  VisibilityOff,
  VpnKey,
  Person,
} from '@mui/icons-material'
import {
  Alert,
  Box,
  Button,
  FormControl,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material'
import { motion } from 'framer-motion'
import React, { useEffect } from 'react'
import { cn } from '@bem-react/classname'
import { useDispatch, useSelector } from 'react-redux'

import { RegistrationData, userDataValidation } from 'user/helpers/RegistrationDataCheck'
import { onlySpaces } from 'shared/helpers/dataValodation'
import { userActions } from 'user/state/user.reducer'
import './Registration.scss'
import { selectRegistration } from 'user/state/user.selectors'
import { UserRole } from 'shared/models/User'

const componentId = 'Registration'
const bem = cn(componentId)

export const Registation: React.FC = () => {
  const registrating = useSelector(selectRegistration)
  const [alignment, setAlignment] = React.useState('undefined')

  const dispatch = useDispatch()
  const [state, setState] = React.useState({
    userNameError: false,
    emailError: false,
    passwordError1: false,
    passwordError2: false,
    showPassword1: false,
    showPassword2: false,
    passwordConfirm: false,
    canLog: false,
    errorMessage: '',
  })

  const [userData, setUserData] = React.useState<RegistrationData>({
    role: undefined,
    userName: '',
    email: '',
    password: '',
  })
  const [password2, setPassword2] = React.useState('')

  useEffect(() => {
    if (
      !onlySpaces(userData.userName) &&
      userData.userName.length > 0 &&
      !onlySpaces(userData.email) &&
      userData.email.length > 0 &&
      !onlySpaces(userData.password) &&
      userData.password.length > 0 &&
      !onlySpaces(password2) &&
      password2.length > 0
    ) {
      setState((old) => ({ ...old, canLog: true }))
    } else {
      setState((old) => ({ ...old, canLog: false }))
    }

    setState((old) => ({
      ...old,
      errorMessage: '',
    }))
  }, [userData.userName, userData.email, userData.password, password2])

  const hidePassword1 = (): void => {
    setState((prevState) => ({
      ...prevState,
      showPassword1: !prevState.showPassword1,
    }))
  }
  const hidePassword2 = (): void => {
    setState((prevState) => ({
      ...prevState,
      showPassword2: !prevState.showPassword2,
    }))
  }

  const handleUserNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserData((prevState) => ({ ...prevState, userName: event.target.value.trim() }))
    setState((prevState) => ({
      ...prevState,
      userNameError: false,
    }))
  }
  const hadnleEmailChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setUserData((prevState) => ({
      ...prevState,
      email: event.target.value.trim(),
    }))
    setState((prevState) => ({
      ...prevState,
      emailError: false,
    }))
  }
  const hadnlePasswordChange1 = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setUserData((prevState) => ({
      ...prevState,
      password: event.target.value.trim(),
    }))
    setState((prevState) => ({
      ...prevState,
      passwordError1: false,
      passwordError2: false,
    }))
  }
  const hadnlePasswordChange2 = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setPassword2(event.target.value.trim())
    setState((prevState) => ({
      ...prevState,
      passwordError2: false,
    }))
  }

  const handleLogin = (): void => {
    if (userData.password !== password2) {
      setState((prevState) => ({
        ...prevState,
        passwordError2: true,
        errorMessage: 'Passwords do not match',
      }))
    } else if (userData.userName.toLowerCase() === userData.email) {
      setState((prevState) => ({
        ...prevState,
        userNameError: true,
        errorMessage: 'User name can not be the same as e-mail',
      }))
    } else {
      let resp = userDataValidation(userData)

      if (resp.status) {
        dispatch(userActions.registration(userData))
      } else if (!resp.status && resp.emailError) {
        console.log(resp.message)
        setState((old) => ({
          ...old,
          emailError: resp.emailError,
          errorMessage: resp.message,
        }))
      } else if (!resp.status && resp.passwordError) {
        console.log(resp.message)
        setState((old) => ({
          ...old,
          passwordError: resp.passwordError,
          errorMessage: resp.message,
        }))
      } else if (!resp.status && resp.userNameError) {
        console.log(resp.message)
        setState((old) => ({
          ...old,
          userNameError: resp.userNameError,
          errorMessage: resp.message,
        }))
      } else {
        console.log('Something went wrong')
      }
    }
  }

  const handleChange = (event: React.MouseEvent<HTMLElement>, newAlignment: string) => {
    setAlignment(newAlignment)
    if (newAlignment !== 'undefined') {
      setUserData((prevState) => ({
        ...prevState,
        role: newAlignment as UserRole,
      }))
    }
  }

  const submitForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    console.log('submit')
  }

  return (
    <motion.div
      className={bem()}
      data-tesid={bem()}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className={bem('Container')}>
        <div className={bem('Container-Header')}>
          <PersonAdd sx={{ m: 'auto', pr: 1, fontSize: 30 }} />{' '}
          <div className={bem('Container-Header-text')}>Create your account</div>
        </div>
        <form autoComplete="off" onSubmit={submitForm}>
          <Typography
            className={bem('Roles-head')}
            variant="caption"
            display="block"
            gutterBottom
          >
            Choose who you want to be
          </Typography>

          <div className={bem('RolesContainer')}>
            <ToggleButtonGroup
              color="primary"
              value={alignment}
              exclusive
              onChange={handleChange}
              aria-label="Platform"
            >
              <ToggleButton
                className={bem('Roles')}
                data-testid={bem('Roles-null')}
                value="undefined"
              >
                I dont know
              </ToggleButton>
              <ToggleButton
                className={bem('Roles')}
                data-testid={bem('Roles-auditor')}
                value="auditor"
              >
                Auditor
              </ToggleButton>
              <ToggleButton
                className={bem('Roles')}
                data-testid={bem('Roles-project')}
                value="project"
              >
                Project
              </ToggleButton>
            </ToggleButtonGroup>
          </div>

          <Box
            className={bem('Container-userName')}
            data-testid={bem('Container-userName')}
            sx={{ display: 'flex', alignItems: 'flex-end', mt: 1 }}
          >
            <Person sx={{ color: 'action.active', mr: 1.5, my: 0.5 }} />
            <TextField
              id="standard-basic"
              label="Your user name"
              error={state.userNameError}
              variant="standard"
              sx={{ width: '100%' }}
              onChange={handleUserNameChange}
            />
          </Box>

          <Box
            className={bem('Container-email')}
            data-testid={bem('Container-email')}
            sx={{ display: 'flex', alignItems: 'flex-end', mt: 1 }}
          >
            <MailOutline sx={{ color: 'action.active', mr: 1.5, my: 0.5 }} />
            <TextField
              id="standard-basic"
              label="Your e-mail"
              error={state.emailError}
              variant="standard"
              sx={{ width: '100%' }}
              onChange={hadnleEmailChange}
            />
          </Box>

          <Box
            className={bem('Container-password')}
            data-testid={bem('Container-password')}
            sx={{ display: 'flex', alignItems: 'flex-end', mt: 1 }}
          >
            <VpnKey sx={{ color: 'action.active', mr: 1.5, my: 0.5 }} />
            <FormControl sx={{ width: '100%' }} variant="standard">
              <InputLabel
                htmlFor="standard-adornment-password"
                error={state.passwordError1}
              >
                Your password
              </InputLabel>
              <Input
                id="standard-adornment-password"
                type={state.showPassword1 ? 'text' : 'password'}
                error={state.passwordError1}
                onChange={hadnlePasswordChange1}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      tabIndex={-1}
                      aria-label="toggle password visibility"
                      onClick={hidePassword1}
                    >
                      {state.showPassword1 ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
          </Box>

          <Box
            className={bem('Container-password')}
            data-testid={bem('Container-password2')}
            sx={{ display: 'flex', alignItems: 'flex-end', mt: 1 }}
          >
            <VpnKey sx={{ color: 'action.active', mr: 1.5, my: 0.5 }} />
            <FormControl sx={{ width: '100%' }} variant="standard">
              <InputLabel
                htmlFor="standard-adornment-password"
                error={state.passwordError2}
              >
                Repeat password
              </InputLabel>
              <Input
                id="standard-adornment-password"
                type={state.showPassword2 ? 'text' : 'password'}
                error={state.passwordError2}
                onChange={hadnlePasswordChange2}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      tabIndex={-1}
                      aria-label="toggle password visibility"
                      onClick={hidePassword2}
                    >
                      {state.showPassword2 ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
          </Box>

          <Button
            className={bem('Container-button')}
            data-testid={bem('Container-button')}
            type="submit"
            variant="contained"
            color={'primary'}
            disabled={!state.canLog || registrating}
            sx={{ mt: 4 }}
            onClick={handleLogin}
          >
            Registrate
          </Button>
        </form>

        {state.userNameError ||
        state.emailError ||
        state.passwordError2 ||
        state.passwordError1 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Alert className={bem('Container-Error')} severity="error">
              {state.errorMessage}
            </Alert>
          </motion.div>
        ) : null}
      </div>
    </motion.div>
  )
}
