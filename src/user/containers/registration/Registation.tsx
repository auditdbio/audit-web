import { Visibility, VisibilityOff } from '@mui/icons-material'
import {
  Alert,
  Button,
  IconButton,
  InputAdornment,
  InputBase,
  InputLabel,
  Typography,
} from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { cn } from '@bem-react/classname'
import Grid from '@mui/material/Unstable_Grid2'

import './Registration.scss'

import { RegistrationData, userDataValidation } from 'user/helpers/RegistrationDataCheck'
import { userActions } from 'user/state/user.reducer'
import { AccountType } from 'shared/models/user'
import { onlySpaces } from 'shared/helpers/dataValodation'
import {
  selectAccountTypePreferences,
  selectRegistrationSuccess,
  selectRegistrationError,
  selectRegistration,
} from 'user/state/user.selectors'

const componentId = 'Registration'
const bem = cn(componentId)

export const Registation: React.FC = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const registering = useSelector(selectRegistration)
  const preferedAccountType = useSelector(selectAccountTypePreferences)
  const [currentAccountType, setCurrentAccountType] =
    useState<AccountType>(preferedAccountType)

  const [switchSelection, setSwitchSelection] = React.useState({
    auditor: false,
    customer: false,
  })

  useEffect(() => {
    switch (currentAccountType) {
      case 'auditor':
        setSwitchSelection({ auditor: true, customer: false })
        break
      case 'customer':
        setSwitchSelection({ auditor: false, customer: true })
        break
    }
    setUserData((state) => ({ ...state, requestedAccountType: currentAccountType }))
  }, [currentAccountType])

  const registerError = useSelector(selectRegistrationError)
  useEffect(() => {
    if (registerError !== null) {
      setState((state) => ({
        ...state,
        registationError: true,
        errorMessage: registerError,
      }))
    }
  }, [registerError])

  let registrationSuccess = useSelector(selectRegistrationSuccess)
  useEffect(() => {
    if (registrationSuccess) {
      navigate('/sign-in')
      dispatch(userActions.setSuccessMessage())
    }
  }, [registrationSuccess, navigate, dispatch])

  const [state, setState] = React.useState({
    registationError: false,
    userNameError: false,
    emailError: false,
    passwordError1: false,
    passwordError2: false,
    showPassword1: false,
    showPassword2: false,
    passwordConfirm: false,
    noErrors: false,
    errorMessage: '',
  })

  const [userData, setUserData] = React.useState<RegistrationData>({
    requestedAccountType: 'customer',
    name: '',
    email: '',
    password: '',
  })
  const [password2, setPassword2] = React.useState('')

  useEffect(() => {
    if (
      !onlySpaces(userData.name) &&
      userData.name.length > 0 &&
      !onlySpaces(userData.email) &&
      userData.email.length > 0 &&
      !onlySpaces(userData.password) &&
      userData.password.length > 0 &&
      !onlySpaces(password2) &&
      password2.length > 0
    ) {
      setState((state) => ({ ...state, noErrors: true }))
    } else {
      setState((state) => ({ ...state, noErrors: false }))
    }

    setState((state) => ({
      ...state,
      errorMessage: '',
      registationError: false,
    }))
  }, [userData.name, userData.email, userData.password, password2])

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
    setUserData((prevState) => ({ ...prevState, name: event.target.value.trim() }))
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

  const handleSwitchChange = (event: React.MouseEvent<HTMLDivElement>): void => {
    if ((event.target as HTMLInputElement).id === 'auditor') {
      setCurrentAccountType('auditor')
    } else if ((event.target as HTMLInputElement).id === 'customer') {
      setCurrentAccountType('customer')
    }
  }

  const handleLogin = (): void => {
    if (userData.password !== password2) {
      setState((prevState) => ({
        ...prevState,
        passwordError2: true,
        errorMessage: 'Passwords do not match',
      }))
    } else if (userData.name.toLowerCase() === userData.email) {
      setState((prevState) => ({
        ...prevState,
        userNameError: true,
        errorMessage: 'User name can not be the same as e-mail',
      }))
    } else {
      let resp = userDataValidation(userData)

      if (resp.status) {
        dispatch(userActions.resetErrors())
        dispatch(userActions.registration(userData))
      } else if (!resp.status && resp.emailError) {
        setState((state) => ({
          ...state,
          emailError: resp.emailError,
          errorMessage: resp.message,
        }))
      } else if (!resp.status && resp.passwordError) {
        setState((state) => ({
          ...state,
          passwordError: resp.passwordError,
          errorMessage: resp.message,
        }))
      } else if (!resp.status && resp.userNameError) {
        setState((state) => ({
          ...state,
          userNameError: resp.userNameError,
          errorMessage: resp.message,
        }))
      } else {
        console.error('Something went wrong')
      }
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="motion-container"
    >
      <Grid container spacing={0} className={bem()}>
        <Typography variant="h5" className={bem('Title')}>
          Sign in
        </Typography>

        <form className={bem('Form')} autoComplete="off">
          <Grid xs={12}>
            <Grid container spacing={2.5}>
              <Grid xs={12}>
                <Grid container spacing={0}>
                  <Grid
                    xs={12}
                    display={'flex'}
                    flexDirection={'column'}
                    alignItems={'center'}
                  >
                    <Typography
                      className={bem('RolesTitle')}
                      variant="caption"
                      display="block"
                      gutterBottom
                    >
                      Choose who you want to be
                    </Typography>
                  </Grid>

                  <Grid xs={12}>
                    <Grid container spacing={0} className={bem('Switch')}>
                      <Grid xs={6}>
                        <div
                          id="auditor"
                          className={bem('Switches', {
                            auditor: true,
                            disable: !switchSelection.auditor,
                          })}
                          onClick={handleSwitchChange}
                        >
                          Auditor
                        </div>
                      </Grid>
                      <Grid xs={6}>
                        <div
                          id="customer"
                          className={bem('Switches', {
                            customer: true,
                            disable: !switchSelection.customer,
                          })}
                          onClick={handleSwitchChange}
                        >
                          Customer
                        </div>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>

              <Grid xs={12}>
                <InputLabel htmlFor="name-input" className={bem('InputLabel')}>
                  Your user name
                </InputLabel>

                <InputBase
                  id="name-input"
                  data-testid={bem('userName')}
                  className={bem('Input', { error: state.userNameError })}
                  error={state.userNameError}
                  onChange={handleUserNameChange}
                />
              </Grid>

              <Grid xs={12}>
                <InputLabel htmlFor="email-input" className={bem('InputLabel')}>
                  Your e-mail
                </InputLabel>

                <InputBase
                  id="email-input"
                  data-testid={bem('Email')}
                  className={bem('Input', { error: state.emailError })}
                  onChange={hadnleEmailChange}
                />
              </Grid>

              <Grid xs={12}>
                <InputLabel htmlFor="password-input" className={bem('InputLabel')}>
                  Your password
                </InputLabel>

                <InputBase
                  id="password-input"
                  data-testid={bem('Password')}
                  className={bem('Input', { error: state.passwordError1 })}
                  type={state.showPassword1 ? 'text' : 'password'}
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
              </Grid>

              <Grid xs={12}>
                <InputLabel htmlFor="password2-input" className={bem('InputLabel')}>
                  Repeat password
                </InputLabel>

                <InputBase
                  id="password2-input"
                  data-testid={bem('password2')}
                  className={bem('Input', { error: state.passwordError2 })}
                  type={state.showPassword2 ? 'text' : 'password'}
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
              </Grid>

              <Grid xs={12} display={'flex'}>
                <Button
                  className={bem('Button', { disabled: !state.noErrors || registering })}
                  data-testid={bem('Button')}
                  type="submit"
                  variant="contained"
                  disabled={!state.noErrors || registering}
                  sx={{ mt: 4 }}
                  onClick={handleLogin}
                >
                  Sign up
                </Button>
              </Grid>
            </Grid>
          </Grid>

          {state.userNameError ||
          state.emailError ||
          state.passwordError2 ||
          state.passwordError1 ||
          state.registationError ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Alert className={bem('Error')} severity="error">
                {state.errorMessage}
              </Alert>
            </motion.div>
          ) : null}
        </form>
      </Grid>
    </motion.div>
  )
}
