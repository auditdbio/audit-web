import { createSelector } from '@reduxjs/toolkit'
import { AppState } from 'app.store'

export const selectUserSlice = (state: AppState) => state.user

export const selectLogin = createSelector(
  selectUserSlice,
  (state) => state.spinners.login,
)

export const selectRegistration = createSelector(
  selectUserSlice,
  (state) => state.spinners.registration,
)

export const selectUser = createSelector(selectUserSlice, (state) => state.user)
