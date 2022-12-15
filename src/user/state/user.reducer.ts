import { Action, createSlice, PayloadAction } from '@reduxjs/toolkit'

import { RegistrationData } from 'user/helpers/RegistrationDataCheck'
import { LoginData } from 'user/helpers/LoginDataCheck'
import { AccountType, mockedUser, User } from 'shared/models/User'

export type UserState = {
  user: User | null
  progress: {
    login: boolean
    registration: boolean
    changName: boolean
    changPassword: boolean
    userDelete: boolean
  }
  loginError: string | null
  registrationError: string | null
  registrationSuccess: boolean
  registrationSuccessMessage: string | null
  accountTypePreferences: AccountType
}

export const initialUserState: UserState = {
  user: null, //mockedUser
  progress: {
    login: false,
    registration: false,
    changName: false,
    changPassword: false,
    userDelete: false,
  },
  loginError: null,
  registrationError: null,
  registrationSuccess: false,
  registrationSuccessMessage: null,
  accountTypePreferences: 'client',
}

export const userSlice = createSlice({
  name: 'user',
  initialState: initialUserState,
  reducers: {
    resetErrors: (state, action: Action) => {
      state.loginError = null
      state.registrationError = null
    },

    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload
    },

    logout: (state, action: PayloadAction) => {
      state.user = null
    },

    login: (state, action: PayloadAction<LoginData>) => {
      state.progress.login = true
      state.loginError = null
    },

    loginSuccess: (state, action: PayloadAction<User>) => {
      state.user = action.payload
      state.progress.login = false
    },
    loginError: (state, action: PayloadAction<string>) => {
      state.progress.login = false
      state.loginError = action.payload
    },

    registration: (state, action: PayloadAction<RegistrationData>) => {
      state.progress.registration = true
    },
    registrationSuccess: (state, action: Action) => {
      state.progress.registration = false
      state.registrationSuccess = true
    },
    resetRegistrationSuccess: (state, action: Action) => {
      state.registrationSuccess = false
    },
    setSuccessMessage: (state, action: Action) => {
      state.registrationSuccessMessage =
        'Congrats, you have successfully registered! Now log in to your account.'
    },
    resetSuccessMessage: (state, action: Action) => {
      state.registrationSuccessMessage = null
    },
    registrationError: (state, action: PayloadAction<string>) => {
      state.progress.registration = false
      state.registrationError = action.payload
    },

    restoreUserInfo: (state, action: Action) => {},
    restoreUserInfoSuccess: (state, action: PayloadAction<User>) => {
      state.user = action.payload
    },
    restoreUserInfoError: (state, action: PayloadAction<string>) => {
      state.user = null
    },

    setUserName: (state, action: PayloadAction<string>) => {
      state.progress.changName = true
    },

    setUserNameSuccess: (state, action: PayloadAction<User>) => {
      state.user!.name = action.payload.name
      state.progress.changName = false
    },

    setUserNameError: (state, action: PayloadAction<string>) => {
      state.progress.changName = false
    },

    setUserPassword: (state, action: PayloadAction<string>) => {
      state.progress.changPassword = true
    },

    setUserPasswordSuccess: (state, action: PayloadAction<User>) => {
      state.user = action.payload
      state.progress.changPassword = false
    },

    setUserPasswordError: (state, action: PayloadAction<string>) => {
      state.progress.changPassword = false
    },

    userDelete: (state, action: PayloadAction) => {
      state.progress.userDelete = true
    },

    userDeleteSuccess: (state, action: PayloadAction) => {
      state.user = null
      state.progress.userDelete = false
    },

    userDeleteError: (state, action: PayloadAction<string>) => {
      state.progress.userDelete = false
    },

    setAccountTypePreferences: (state, action: PayloadAction<AccountType>) => {
      state.accountTypePreferences = action.payload
    },
  },
})

export const userReducer = userSlice.reducer
export const userActions = userSlice.actions
