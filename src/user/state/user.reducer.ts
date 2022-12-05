import { Action, createSlice, PayloadAction } from '@reduxjs/toolkit'

import { RegistrationData } from 'user/helpers/RegistrationDataCheck'
import { LoginData } from 'user/helpers/LoginDataCheck'
import { User } from 'shared/models/User'

export type UserState = {
  user: User | null
  progress: {
    login: boolean
    registration: boolean
    changName: boolean
    changPassword: boolean
    userDelete: boolean
  }
}

export const initialUserState: UserState = {
  user: null,
  progress: {
    login: false,
    registration: false,
    changName: false,
    changPassword: false,
    userDelete: false,
  },
}

export const userSlice = createSlice({
  name: 'user',
  initialState: initialUserState,
  reducers: {
    resetAuth: (state, action: PayloadAction<string>) => initialUserState,

    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload
    },

    clearUser: (state, action: PayloadAction) => {
      state.user = null
    },

    login: (state, action: PayloadAction<LoginData>) => {
      state.progress.login = true
    },

    loginSuccess: (state, action: PayloadAction<User>) => {
      state.user = action.payload
      state.progress.login = false
    },
    loginError: (state, action: PayloadAction<string>) => {
      state.progress.login = false
    },

    registration: (state, action: PayloadAction<RegistrationData>) => {
      state.progress.registration = true
    },
    registrationSuccess: (state, action: PayloadAction<User>) => {
      state.user = action.payload
      state.progress.registration = false
    },
    registrationError: (state, action: PayloadAction<string>) => {
      state.progress.registration = false
    },
    fetchUserInfo: (state, action: Action) => {},

    setUserName: (state, action: PayloadAction<string>) => {
      state.progress.changName = true
    },

    setUserNameSuccess: (state, action: PayloadAction<User>) => {
      state.user!.name = action.payload.name // TODO: fix this line
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
  },
})

export const userReducer = userSlice.reducer
export const userActions = userSlice.actions
