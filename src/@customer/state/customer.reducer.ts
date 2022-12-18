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
    processing: {
      customer: boolean
      customerError: string
      customerSuccess: string
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
    processing: {
      customer: false,
      customerError: '',
      customerSuccess: '',
    },
  },
}

const customerSlice = createSlice({
  name: 'customer',
  initialState: initialCustomerState,
  reducers: {
    loadCustomerData(state, action: Action) {
      state.customerPage.loaders.customer = true
      state.customerPage.processing.customerError = ''
      state.customerPage.processing.customerSuccess = ''
    },
    loadCustomerDataSuccess(state, action: PayloadAction<Customer | null>) {
      state.customerPage.customer = action.payload
      state.customerPage.loaders.customer = false
    },
    loadCustomerDataFail(state, action: PayloadAction<string>) {
      state.customerPage.loaders.customer = false
      state.customerPage.processing.customerError = action.payload
    },

    createCustomer(state, action: PayloadAction<Customer>) {
      state.customerPage.processing.customer = true
      state.customerPage.processing.customerError = ''
      state.customerPage.processing.customerSuccess = ''
    },
    createCustomerSuccess(state, action: PayloadAction<Customer>) {
      state.customerPage.customer = action.payload
      state.customerPage.processing.customer = false
      state.customerPage.processing.customerSuccess = 'Customer created successfully'
    },
    createCustomerFail(state, action: PayloadAction<string>) {
      state.customerPage.processing.customer = false
      state.customerPage.processing.customerError = action.payload
    },

    updateCustomer(state, action: PayloadAction<Customer>) {
      state.customerPage.processing.customer = true
      state.customerPage.processing.customerError = ''
      state.customerPage.processing.customerSuccess = ''
    },
    updateCustomerSuccess(state, action: PayloadAction<Customer>) {
      state.customerPage.customer = action.payload
      state.customerPage.processing.customer = false
      state.customerPage.processing.customerSuccess = 'Customer updated successfully'
    },
    updateCustomerFail(state, action: PayloadAction<string>) {
      state.customerPage.processing.customer = false
      state.customerPage.processing.customerError = action.payload
    },

    deleteCustomer(state, action: PayloadAction<string>) {
      state.customerPage.processing.customer = true
      state.customerPage.processing.customerError = ''
      state.customerPage.processing.customerSuccess = ''
    },
    deleteCustomerSuccess(state, action: Action) {
      state.customerPage.processing.customer = false
      state.customerPage.processing.customerSuccess = 'Customer deleted successfully'
    },
    deleteCustomerFail(state, action: PayloadAction<string>) {
      state.customerPage.processing.customer = false
      state.customerPage.processing.customerError = action.payload
    },
  },
})

export const customerReducer = customerSlice.reducer
export const customerActions = customerSlice.actions
