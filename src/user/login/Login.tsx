import { motion } from 'framer-motion'
import React, { useEffect, useLayoutEffect, useRef } from 'react'
import {
  TextField,
  Box,
  Button,
  InputAdornment,
  IconButton,
  Input,
  FormControl,
  InputLabel,
  Alert,
} from '@mui/material'
import {
  MailOutline,
  VpnKey,
  VisibilityOff,
  Visibility,
  Login as LoginIcon,
} from '@mui/icons-material'
import { cn } from '@bem-react/classname'
import { useDispatch, useSelector } from 'react-redux'
import './Login.scss'

import { onlySpaces } from 'shared/helpers/dataValodation'
import { userActions } from 'user/state/user.reducer'
import { loginDataValidation } from 'user/helpers/LoginDataCheck'
import {
  selectLogin,
  selectLoginError,
  selectRegistrationSuccess,
  selectSuccessMessage,
} from 'user/state/user.selectors'

const componentId = 'Login'
const bem = cn(componentId)

export const Login: React.FC = () => {
  const loging = useSelector(selectLogin)
  const loginError = useSelector(selectLoginError)
  const registrationSuccess = useSelector(selectRegistrationSuccess)
  const successMessage = useSelector(selectSuccessMessage)
  const dispatch = useDispatch()

  useEffect(() => {
    if (loginError !== null) {
      setState((old) => ({
        ...old,
        loginError: true,
        errorMessage: loginError,
      }))
    }
  }, [loginError])

  useEffect(() => {
    dispatch(userActions.resetRegistrationSuccess())
    return () => {
      dispatch(userActions.resetSuccessMessage())
    }
  }, [])

  const [state, setState] = React.useState({
    loginError: false,
    emailError: false,
    passwordError: false,
    showPassword: false,
    canLog: false,
    errorMessage: '',
  })
  const [userData, setUserData] = React.useState({
    email: '',
    password: '',
  })

  useEffect(() => {
    dispatch(userActions.resetErrors())
  }, [])
  useEffect(() => {
    if (
      userData.email.length > 0 &&
      userData.password.length > 0 &&
      !onlySpaces(userData.email) &&
      !onlySpaces(userData.password)
    ) {
      setState((old) => ({ ...old, canLog: true }))
    } else {
      setState((old) => ({ ...old, canLog: false }))
    }
    setState((old) => ({ ...old, loginError: false }))
  }, [userData])

  const hidePassword = (): void => {
    setState((prevState) => ({
      ...prevState,
      showPassword: !prevState.showPassword,
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
  const hadnlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setUserData((prevState) => ({
      ...prevState,
      password: event.target.value.trim(),
    }))
    setState((prevState) => ({
      ...prevState,
      passwordError: false,
    }))
  }

  const handleLogin = (): void => {
    let resp = loginDataValidation(userData)

    if (resp.status) {
      dispatch(userActions.resetErrors())
      dispatch(userActions.login(userData))
    } else if (!resp.status && resp.emailError) {
      setState((old) => ({
        ...old,
        emailError: resp.emailError,
        errorMessage: resp.message,
      }))
    } else if (!resp.status && resp.passwordError) {
      setState((old) => ({
        ...old,
        passwordError: resp.passwordError,
        errorMessage: resp.message,
      }))
    } else {
      console.error('Something went wrong')
    }
  }

  const submitForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
  }

  return (
    <motion.div
      className={bem()}
      data-testid={bem()}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className={bem('Header')}>
        <LoginIcon sx={{ m: 'auto', pr: 1, fontSize: 30 }} />{' '}
        <div className={bem('HeadeText')}>Autorization</div>
      </div>

      <form autoComplete="off" onSubmit={submitForm}>
        <Box
          className={bem('Email')}
          data-testid={bem('Email')}
          sx={{ display: 'flex', alignItems: 'flex-end', mt: 1 }}
        >
          <MailOutline sx={{ color: 'action.active', mr: 1.5, my: 0.5 }} />
          <TextField
            id="standard-basic"
            label="E-mail"
            error={state.emailError}
            variant="standard"
            sx={{ width: '100%' }}
            onChange={hadnleEmailChange}
          />
        </Box>

        <Box
          className={bem('Password')}
          sx={{ display: 'flex', alignItems: 'flex-end', mt: 1 }}
        >
          <VpnKey sx={{ color: 'action.active', mr: 1.5, my: 0.5 }} />

          <FormControl sx={{ width: '100%' }} variant="standard">
            <InputLabel htmlFor="standard-adornment-password" error={state.passwordError}>
              Password
            </InputLabel>

            <Input
              id="standard-adornment-password"
              type={state.showPassword ? 'text' : 'password'}
              error={state.passwordError}
              onChange={hadnlePasswordChange}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    tabIndex={-1}
                    aria-label="toggle password visibility"
                    onClick={hidePassword}
                  >
                    {state.showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>
        </Box>

        <Button
          className={bem('Button')}
          data-testid={bem('Button')}
          type="submit"
          variant="contained"
          color={'primary'}
          disabled={!state.canLog || loging}
          sx={{ mt: 4 }}
          onClick={handleLogin}
        >
          Sign in
        </Button>
      </form>

      {state.emailError || state.passwordError || state.loginError ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Alert className={bem('Alert', { error: true })} severity="error">
            {state.errorMessage}
          </Alert>
        </motion.div>
      ) : null}

      {successMessage !== null ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Alert className={bem('Alert', { success: true })} severity="success">
            {successMessage}
          </Alert>
        </motion.div>
      ) : null}
    </motion.div>
  )
}
