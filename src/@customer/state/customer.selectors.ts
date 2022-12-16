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

export const selectCustomer = createSelector(
  selectCustomerPage,
  (state) => state.customer,
)
