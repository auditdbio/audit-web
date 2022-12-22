import { AccountType, UserRole } from 'shared/models/user'
import { inputValidator, validateEmail } from 'shared/helpers/dataValodation'

export type RegistrationData = {
  role?: UserRole
  name: string
  email: string
  requestedAccountType: AccountType
  password: string
}
export type RegistrationDataStatus = {
  status: boolean
  userNameError: boolean
  emailError: boolean
  passwordError: boolean
  message: string
}

export const userDataValidation = (user: RegistrationData): RegistrationDataStatus => {
  const response = {
    status: false,
    userNameError: false,
    emailError: false,
    passwordError: false,
    message: 'User data is not valid',
  }
  const emailCheck = inputValidator(user.email)
  const passwordCheck = inputValidator(user.password)
  const userNameCheck = inputValidator(user.name)

  if (!emailCheck.status) {
    response.message = emailCheck.message
    response.emailError = true
  } else if (!passwordCheck.status) {
    response.message = passwordCheck.message
    response.passwordError = true
  } else if (!userNameCheck.status) {
    response.message = userNameCheck.message
    response.userNameError = true
  } else if (user.name.length < 3) {
    response.message = 'User name must be at least 3 characters long'
    response.userNameError = true
  } else if (user.name.length > 30) {
    response.message = 'User name cant be longer 30 characters'
    response.userNameError = true
  } else if (user.password.includes(' ')) {
    response.message = 'You cant use spaces in password'
    response.passwordError = true
  } else if (user.password.length < 6) {
    response.message = 'Password must be at least 6 characters'
    response.passwordError = true
  } else if (user.password.length > 30) {
    response.message = 'Password cant be longer 30 characters'
    response.passwordError = true
  } else if (!validateEmail(user.email)) {
    response.message = 'Email is not valid'
    response.emailError = true
  } else {
    response.status = true
    response.message = 'User data is valid'
  }
  return response
}
