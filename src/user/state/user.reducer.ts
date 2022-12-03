import { Action, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { LoginData } from 'user/helpers/LoginDataCheck'
import { RegistrationData } from 'user/helpers/RegistrationDataCheck'
import { User } from 'shared/models/User'

export type UserState = {
  user: User | null
  spinners: {
    login: boolean
    registration: boolean
    emailEdit: boolean
    userNameEdit: boolean
    passwordEdit: boolean
    userDelit: boolean
  }
}

export const initialUserState: UserState = {
  user: null,
  spinners: {
    login: false,
    registration: false,
    emailEdit: false,
    userNameEdit: false,
    passwordEdit: false,
    userDelit: false,
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
      state.spinners.login = true
    },

    loginSuccess: (state, action: PayloadAction<User>) => {
      state.user = action.payload
      state.spinners.login = false
    },
    loginError: (state, action: PayloadAction<string>) => {
      state.spinners.login = false
    },

    registration: (state, action: PayloadAction<RegistrationData>) => {
      state.spinners.registration = true
    },
    registrationSuccess: (state, action: PayloadAction<User>) => {
      state.user = action.payload
      state.spinners.registration = false
    },
    registrationError: (state, action: PayloadAction<string>) => {
      state.spinners.registration = false
    },
    fetchUserInfo: (state, action: Action) => {},

    setUserEmail: (state, action: PayloadAction<string>) => {
      state.spinners.emailEdit = true
    },

    setUserEmailSuccess: (state, action: PayloadAction<User>) => {
      state.user!.email = action.payload.email // TODO: fix this
      state.spinners.emailEdit = false
    },

    setUserEmailError: (state, action: PayloadAction<string>) => {
      state.spinners.emailEdit = false
    },

    setUserName: (state, action: PayloadAction<string>) => {
      state.spinners.userNameEdit = true
    },

    setUserNameSuccess: (state, action: PayloadAction<User>) => {
      state.user!.name = action.payload.name // TODO: fix this line
      state.spinners.userNameEdit = false
    },

    setUserNameError: (state, action: PayloadAction<string>) => {
      state.spinners.userNameEdit = false
    },

    setUserPassword: (state, action: PayloadAction<string>) => {
      state.spinners.passwordEdit = true
    },

    setUserPasswordSuccess: (state, action: PayloadAction<User>) => {
      state.user = action.payload
      state.spinners.passwordEdit = false
    },

    setUserPasswordError: (state, action: PayloadAction<string>) => {
      state.spinners.passwordEdit = false
    },

    deleteUser: (state, action: PayloadAction) => {
      state.spinners.userDelit = true
    },

    deleteUserSuccess: (state, action: PayloadAction) => {
      state.user = null
      state.spinners.userDelit = false
    },

    deleteUserError: (state, action: PayloadAction<string>) => {
      state.spinners.userDelit = false
    },
  },
})

export const userReducer = userSlice.reducer
export const userActions = userSlice.actions
