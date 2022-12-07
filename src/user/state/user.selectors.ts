import { createSelector } from '@reduxjs/toolkit'
import { AppState } from 'app.store'

export const selectUserSlice = (state: AppState) => state.user

export const selectLogin = createSelector(
  selectUserSlice,
  (state) => state.progress.login,
)

export const selectRegistration = createSelector(
  selectUserSlice,
  (state) => state.progress.registration,
)

export const selectLoginError = createSelector(
  selectUserSlice,
  (state) => state.loginError,
)

export const selectRegistrationError = createSelector(
  selectUserSlice,
  (state) => state.registrationError,
)

export const selectUser = createSelector(selectUserSlice, (state) => state.user)
