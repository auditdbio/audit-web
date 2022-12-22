import { Action, createSlice, PayloadAction } from '@reduxjs/toolkit'

import { Project } from 'shared/models/project'
import { Customer } from 'shared/models/customer'

export type CustomerState = {
  customerPage: {
    audits: any[]
    projects: Project[]
    customer: Customer | null

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

  projectPage: {
    isNewProject: boolean
    customerIdForProject: string
    project: Project | null
    loader: boolean
    processing: {
      project: boolean
      projectError: string
      projectSuccess: string
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
  projectPage: {
    isNewProject: false,
    customerIdForProject: '',
    project: null,
    loader: false,
    processing: {
      project: false,
      projectError: '',
      projectSuccess: '',
    },
  },
}

const customerSlice = createSlice({
  name: 'customer',
  initialState: initialCustomerState,
  reducers: {
    // #region Customer Page
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

    loadCustomerProjects(state, action: PayloadAction<string>) {
      state.customerPage.loaders.projects = true
    },
    loadCustomerProjectsSuccess(state, action: PayloadAction<Project[]>) {
      state.customerPage.projects = action.payload
      state.customerPage.loaders.projects = false
    },
    loadCustomerProjectsFail(state, action: PayloadAction<string>) {
      state.customerPage.loaders.projects = false
    },

    loadCustomerAudits(state, action: PayloadAction<string>) {
      state.customerPage.loaders.audits = true
    },
    loadCustomerAuditsSuccess(state, action: PayloadAction<any[]>) {
      state.customerPage.audits = action.payload
      state.customerPage.loaders.audits = false
    },
    loadCustomerAuditsFail(state, action: PayloadAction<string>) {
      state.customerPage.loaders.audits = false
    },

    addProject(state, action: Action) {},
    editProject(state, action: PayloadAction<Project>) {},
    removeProject(state, action: PayloadAction<string>) {},

    // #endregion

    // #region Project Page
    loadProject(state, action: PayloadAction<string>) {
      state.projectPage.loader = true
      state.projectPage.processing.projectError = ''
      state.projectPage.processing.projectSuccess = ''
    },
    loadProjectSuccess(state, action: PayloadAction<Project | null>) {
      state.projectPage.project = action.payload
      state.projectPage.loader = false
    },
    loadProjectFail(state, action: PayloadAction<string>) {
      state.projectPage.loader = false
      state.projectPage.processing.projectError = action.payload
    },

    createProject(state, action: PayloadAction<Project>) {
      state.projectPage.processing.project = true
      state.projectPage.processing.projectError = ''
      state.projectPage.processing.projectSuccess = ''
    },
    createProjectSuccess(state, action: PayloadAction<Project>) {
      state.projectPage.project = action.payload
      state.projectPage.processing.project = false
      state.projectPage.processing.projectSuccess = 'Project created successfully'
    },
    createProjectFail(state, action: PayloadAction<string>) {
      state.projectPage.processing.project = false
      state.projectPage.processing.projectError = action.payload
    },

    updateProject(state, action: PayloadAction<Project>) {
      state.projectPage.processing.project = true
      state.projectPage.processing.projectError = ''
      state.projectPage.processing.projectSuccess = ''
    },
    updateProjectSuccess(state, action: PayloadAction<Project>) {
      state.projectPage.project = action.payload
      state.projectPage.processing.project = false
      state.projectPage.processing.projectSuccess = 'Project updated successfully'
    },
    updateProjectFail(state, action: PayloadAction<string>) {
      state.projectPage.processing.project = false
      state.projectPage.processing.projectError = action.payload
    },

    deleteProject(state, action: PayloadAction<string>) {
      state.projectPage.processing.project = true
      state.projectPage.processing.projectError = ''
      state.projectPage.processing.projectSuccess = ''
    },

    setCustomerIdForProject(state, action: PayloadAction<[string, boolean]>) {
      state.projectPage.customerIdForProject = action.payload[0]
      state.projectPage.isNewProject = action.payload[1]
    },
    // #endregion
  },
})

export const customerReducer = customerSlice.reducer
export const customerActions = customerSlice.actions
