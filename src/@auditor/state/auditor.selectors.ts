import { createSelector } from '@reduxjs/toolkit'
import { AppState } from 'app.store'

export const selectAuditorSlice = (state: AppState) => state.auditor

export const selectAuditorPage = createSelector(
  selectAuditorSlice,
  (state) => state.auditorPage,
)

export const selectLoadingAuditor = createSelector(
  selectAuditorPage,
  (state) => state.loaders.auditor,
)

export const selectProcessingAuditor = createSelector(
  selectAuditorPage,
  (state) => state.processing.auditor,
)

export const selectAuditorErrorMessage = createSelector(
  selectAuditorPage,
  (state) => state.processing.auditorError,
)

export const selectAuditorSuccessMessage = createSelector(
  selectAuditorPage,
  (state) => state.processing.auditorSuccess,
)

export const selectAuditor = createSelector(selectAuditorPage, (state) => state.auditor)
