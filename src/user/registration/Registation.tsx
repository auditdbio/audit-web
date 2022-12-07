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
import { useDispatch, useSelector } from 'react-redux'
import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@bem-react/classname'

import './Registration.scss'
import { AccountType, UserRole } from 'shared/models/User'
import { userActions } from 'user/state/user.reducer'
import { onlySpaces } from 'shared/helpers/dataValodation'
import { selectRegistration, selectRegistrationError } from 'user/state/user.selectors'
import { RegistrationData, userDataValidation } from 'user/helpers/RegistrationDataCheck'

const componentId = 'Registration'
const bem = cn(componentId)

export const Registation: React.FC = () => {
  const registrating = useSelector(selectRegistration)
  const [alignment, setAlignment] = React.useState<AccountType>('client')

  const registerError = useSelector(selectRegistrationError)
  useEffect(() => {
    if (registerError !== null) {
      setState((old) => ({
        ...old,
        registationError: true,
        errorMessage: registerError,
      }))
    }
  }, [registerError])

  const dispatch = useDispatch()
  const [state, setState] = React.useState({
    registationError: false,
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
    requestedAccountType: alignment,
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
      setState((old) => ({ ...old, canLog: true }))
    } else {
      setState((old) => ({ ...old, canLog: false }))
    }

    setState((old) => ({
      ...old,
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
      } else if (!resp.status && resp.userNameError) {
        setState((old) => ({
          ...old,
          userNameError: resp.userNameError,
          errorMessage: resp.message,
        }))
      } else {
        console.error('Something went wrong')
      }
    }
  }

  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    accountType: AccountType,
  ) => {
    setAlignment(accountType)
    setUserData((prevState) => ({
      ...prevState,
      requestedAccountType: accountType,
    }))
  }

  const submitForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    console.log('submit')
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={bem()}
    >
      <div className={bem('Header')}>
        <PersonAdd sx={{ m: 'auto', pr: 1, fontSize: 30 }} />{' '}
        <div className={bem('Header-text')}>Create your account</div>
      </div>
      <form className={bem('Form')} autoComplete="off" onSubmit={submitForm}>
        <Typography
          className={bem('RolesTitle')}
          variant="caption"
          display="block"
          gutterBottom
        >
          Choose who you want to be
        </Typography>

        <div className={bem('Roles')}>
          <ToggleButtonGroup
            color="primary"
            value={alignment}
            exclusive
            onChange={handleChange}
            aria-label="Platform"
          >
            <ToggleButton
              className={bem('Role')}
              data-testid={bem('Role', ['Auditor'])}
              value="auditor"
            >
              auditor
            </ToggleButton>
            <ToggleButton
              className={bem('Role')}
              data-testid={bem('Role', ['Project'])}
              value="client"
            >
              client
            </ToggleButton>
          </ToggleButtonGroup>
        </div>

        <Box
          className={bem('UserName')}
          data-testid={bem('UserName')}
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
          className={bem('Email')}
          data-testid={bem('Email')}
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
          className={bem('Password')}
          data-testid={bem('Password')}
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
          className={bem('Password')}
          data-testid={bem('password2')}
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
          className={bem('Button')}
          data-testid={bem('Button')}
          type="submit"
          variant="contained"
          color={'primary'}
          disabled={!state.canLog || registrating}
          sx={{ mt: 4 }}
          onClick={handleLogin}
        >
          Sign up
        </Button>
      </form>

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
    </motion.div>
  )
}
