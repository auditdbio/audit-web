import { Action, createSlice, PayloadAction } from '@reduxjs/toolkit'

import { Auditor } from 'shared/models/auditor'
import { Project } from 'shared/models/project'
import { AccountType, User } from 'shared/models/user'

export type SharedState = {
  user: User | null
  activeUserType: AccountType | null
  auditors: Auditor[]
  auditorsLoading: boolean
  auditorsError: string | null
  projects: Project[]
  projectsLoading: boolean
  projectsError: string | null
}

export const initialSharedState: SharedState = {
  user: null,
  activeUserType: null,
  auditors: [],
  auditorsLoading: false,
  auditorsError: null,
  projects: [],
  projectsLoading: false,
  projectsError: null,
}

export const sharedSlice = createSlice({
  name: 'shared',
  initialState: initialSharedState,
  reducers: {
    resetState: (state, action: PayloadAction<string>) => initialSharedState,
    setUserPreferences: (state, action: PayloadAction<AccountType>) => {},
    loadAuditors: (state, action: Action) => {
      state.auditorsLoading = true
      state.auditorsError = null
    },
    loadAuditorsSuccess: (state, action: PayloadAction<Auditor[]>) => {
      state.auditorsLoading = false
      state.auditors = action.payload
    },
    loadAuditorsError: (state, action: PayloadAction<string>) => {
      state.auditorsLoading = false
      state.auditorsError = action.payload
    },

    loadProjects: (state, action: Action) => {
      state.projectsLoading = true
      state.projectsError = null
    },
    loadProjectsSuccess: (state, action: PayloadAction<Project[]>) => {
      state.projectsLoading = false
      state.projects = action.payload
    },
    loadProjectsError: (state, action: PayloadAction<string>) => {
      state.projectsLoading = false
      state.projectsError = action.payload
    },

    setActiveUserType: (state, action: PayloadAction<AccountType>) => {
      state.activeUserType = action.payload
    },
  },
})

export const sharedReducer = sharedSlice.reducer
export const sharedActions = sharedSlice.actions
