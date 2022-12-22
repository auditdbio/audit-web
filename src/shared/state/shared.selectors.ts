import { createSelector } from '@reduxjs/toolkit'
import { AppState } from 'app.store'

export const selectSharedSlice = (state: AppState) => state.shared

export const selectAuditors = createSelector(selectSharedSlice, (state) => state.auditors)

export const selectAuditorsLoading = createSelector(
  selectSharedSlice,
  (state) => state.auditorsLoading,
)

export const selectAuditorsError = createSelector(
  selectSharedSlice,
  (state) => state.auditorsError,
)

export const selectProjects = createSelector(selectSharedSlice, (state) => state.projects)

export const selectProjectsLoading = createSelector(
  selectSharedSlice,
  (state) => state.projectsLoading,
)

export const selectProjectsError = createSelector(
  selectSharedSlice,
  (state) => state.projectsError,
)
