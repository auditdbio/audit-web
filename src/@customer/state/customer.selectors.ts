import { createSelector } from '@reduxjs/toolkit'
import { AppState } from 'app.store'

export const selectCustomerSlice = (state: AppState) => state.customer

export const selectCustomerPage = createSelector(
  selectCustomerSlice,
  (state) => state.customerPage,
)

export const selectLoadingCustomer = createSelector(
  selectCustomerPage,
  (state) => state.loaders.customer,
)

export const selectProcessingCustomer = createSelector(
  selectCustomerPage,
  (state) => state.processing.customer,
)

export const selectCustomerErrorMessage = createSelector(
  selectCustomerPage,
  (state) => state.processing.customerError,
)

export const selectCustomerSuccessMessage = createSelector(
  selectCustomerPage,
  (state) => state.processing.customerSuccess,
)

export const selectCustomer = createSelector(
  selectCustomerPage,
  (state) => state.customer,
)

export const selectCustomerProjects = createSelector(
  selectCustomerPage,
  (state) => state.projects,
)

export const selectLoadingCustomerProjects = createSelector(
  selectCustomerPage,
  (state) => state.loaders.projects,
)

export const selectCustomerAudits = createSelector(
  selectCustomerPage,
  (state) => state.audits,
)

export const selectLoadingCustomerAudits = createSelector(
  selectCustomerPage,
  (state) => state.loaders.audits,
)

export const selectProjectPage = createSelector(
  selectCustomerSlice,
  (state) => state.projectPage,
)

export const selectProject = createSelector(selectProjectPage, (state) => state.project)

export const selectLoadingProject = createSelector(
  selectProjectPage,
  (state) => state.loader,
)

export const selectProcessingProject = createSelector(
  selectProjectPage,
  (state) => state.processing.project,
)

export const selectCustomerIdForProject = createSelector(
  selectProjectPage,
  (state) => state.customerIdForProject,
)

export const selectIsNewProject = createSelector(
  selectProjectPage,
  (state) => state.isNewProject,
)

export const selectProjectErrorMessage = createSelector(
  selectProjectPage,
  (state) => state.processing.projectError,
)

export const selectProjectSuccessMessage = createSelector(
  selectProjectPage,
  (state) => state.processing.projectSuccess,
)
