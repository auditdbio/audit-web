import { Action, createSlice, PayloadAction } from '@reduxjs/toolkit'

import { Auditor } from 'shared/models/auditor'

export type AuditorState = {
  auditorPage: {
    audits: []
    auditor: Auditor | null
    loaders: {
      audits: boolean
      auditor: boolean
    }
    processing: {
      auditor: boolean
      auditorError: string
      auditorSuccess: string
    }
  }
}

const initialAuditorState: AuditorState = {
  auditorPage: {
    audits: [],
    auditor: null,
    loaders: {
      audits: false,
      auditor: false,
    },
    processing: {
      auditor: false,
      auditorError: '',
      auditorSuccess: '',
    },
  },
}

export const auditorSlice = createSlice({
  name: 'auditor',
  initialState: initialAuditorState,
  reducers: {
    loadAuditorData(state, action: PayloadAction) {
      state.auditorPage.loaders.auditor = true
      state.auditorPage.processing.auditorError = ''
      state.auditorPage.processing.auditorSuccess = ''
    },
    loadAuditorDataSuccess(state, action: PayloadAction<Auditor | null>) {
      state.auditorPage.auditor = action.payload
      state.auditorPage.loaders.auditor = false
    },
    loadAuditorDataFail(state, action: PayloadAction<string>) {
      state.auditorPage.loaders.auditor = false
      state.auditorPage.processing.auditorError = action.payload
    },

    createAuditor(state, action: PayloadAction<Auditor>) {
      state.auditorPage.processing.auditor = true
      state.auditorPage.processing.auditorError = ''
      state.auditorPage.processing.auditorSuccess = ''
    },
    createAuditorSuccess(state, action: PayloadAction<Auditor>) {
      state.auditorPage.auditor = action.payload
      state.auditorPage.processing.auditor = false
      state.auditorPage.processing.auditorSuccess = 'Auditor created successfully'
    },
    createAuditorFail(state, action: PayloadAction<string>) {
      state.auditorPage.processing.auditor = false
      state.auditorPage.processing.auditorError = action.payload
    },

    updateAuditor(state, action: PayloadAction<Auditor>) {
      state.auditorPage.processing.auditor = true
      state.auditorPage.processing.auditorError = ''
      state.auditorPage.processing.auditorSuccess = ''
    },
    updateAuditorSuccess(state, action: PayloadAction<Auditor>) {
      state.auditorPage.auditor = action.payload
      state.auditorPage.processing.auditor = false
      state.auditorPage.processing.auditorSuccess = 'Auditor updated successfully'
    },
    updateAuditorFail(state, action: PayloadAction<string>) {
      state.auditorPage.processing.auditor = false
      state.auditorPage.processing.auditorError = action.payload
    },

    deleteAuditor(state, action: PayloadAction<string>) {
      state.auditorPage.processing.auditor = true
      state.auditorPage.processing.auditorError = ''
      state.auditorPage.processing.auditorSuccess = ''
    },
    deleteAuditorSuccess(state, action: Action) {
      state.auditorPage.processing.auditor = false
      state.auditorPage.auditor = null
      state.auditorPage.processing.auditorSuccess = 'Auditor deleted successfully'
    },
    deleteAuditorFail(state, action: PayloadAction<string>) {
      state.auditorPage.processing.auditor = false
      state.auditorPage.processing.auditorError = action.payload
    },
  },
})

export const auditorReducer = auditorSlice.reducer
export const auditorActions = auditorSlice.actions
