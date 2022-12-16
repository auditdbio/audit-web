import { Action, createSlice, PayloadAction } from '@reduxjs/toolkit'

import { Project } from '@customer/models/project'
import { Customer } from '@customer/models/customer'

export type CustomerState = {
  customerPage: {
    audits: any[]
    customer: Customer | null
    projects: Project[]
    loaders: {
      audits: boolean
      projects: boolean
      customer: boolean
    }
  }
}

const initialCustomerState: CustomerState = {
  customerPage: {
    audits: [],
    customer: null,
    projects: [],
    loaders: {
      audits: false,
      customer: false,
      projects: false,
    },
  },
}

const customerSlice = createSlice({
  name: 'customer',
  initialState: initialCustomerState,
  reducers: {
    loadCustomerData(state, action: Action) {
      state.customerPage.loaders.customer = true
    },
    loadCustomerDataSuccess(state, action: PayloadAction<Customer>) {
      state.customerPage.customer = action.payload
      state.customerPage.loaders.customer = false
    },
    loadCustomerDataFail(state, action: Action) {
      state.customerPage.loaders.customer = false
    },

    createCustomer(state, action: PayloadAction<Customer>) {},
    createCustomerSuccess(state, action: PayloadAction<Customer>) {},
    createCustomerFail(state, action: PayloadAction<string>) {},

    updateCustomer(state, action: PayloadAction<Customer>) {},
    updateCustomerSuccess(state, action: PayloadAction<Customer>) {},
    updateCustomerFail(state, action: PayloadAction<string>) {},
  },
})

export const customerReducer = customerSlice.reducer
export const customerActions = customerSlice.actions
