import {
  Button,
  InputAdornment,
  IconButton,
  InputLabel,
  Alert,
  Typography,
  InputBase,
} from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import { cn } from '@bem-react/classname'
import { motion } from 'framer-motion'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { VisibilityOff, Visibility } from '@mui/icons-material'

import {
  selectLoginError,
  selectSuccessMessage,
  selectLogin,
} from 'user/state/user.selectors'
import { loginDataValidation } from 'user/helpers/LoginDataCheck'
import { userActions } from 'user/state/user.reducer'
import { onlySpaces } from 'shared/helpers/dataValodation'
import './Login.scss'

const componentId = 'Login'
const bem = cn(componentId)

export const Login: React.FC = () => {
  const loginError = useSelector(selectLoginError)
  const successMessage = useSelector(selectSuccessMessage)
  const loginProcces = useSelector(selectLogin)
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
  }, [dispatch])

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
  }, [dispatch])

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
      email: event.target.value.trim().toLocaleLowerCase(),
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
      className="motion-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Grid container spacing={2} className={bem()}>
        <Typography variant="h5" className={bem('Title')}>
          Sign in
        </Typography>

        <form autoComplete="off" onSubmit={submitForm}>
          <Grid xs={12}>
            <Grid container spacing={3}>
              <Grid xs={12} className="Email">
                <InputLabel htmlFor="email-input" className={bem('InputLabel')}>
                  E-mail
                </InputLabel>

                <InputBase
                  id="email-input"
                  className={bem('Input', { error: state.emailError })}
                  type="email"
                  error={state.emailError}
                  onChange={hadnleEmailChange}
                />
              </Grid>

              <Grid xs={12} className={bem('Password')}>
                <InputLabel htmlFor="password-input" className={bem('InputLabel')}>
                  Password
                </InputLabel>

                <InputBase
                  id="password-input"
                  className={bem('Input', { error: state.passwordError })}
                  onChange={hadnlePasswordChange}
                  type={state.showPassword ? 'text' : 'password'}
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
              </Grid>

              <Grid xs={12} display="flex">
                <Button
                  className={bem('Button', { disabled: !state.canLog || loginProcces })}
                  data-testid={bem('Button')}
                  type="submit"
                  variant="contained"
                  disabled={!state.canLog || loginProcces}
                  sx={{ mt: 4 }}
                  onClick={handleLogin}
                >
                  Sign in
                </Button>
              </Grid>
            </Grid>
          </Grid>

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
        </form>
      </Grid>
    </motion.div>
  )
}
