import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { combineEpics, createEpicMiddleware } from 'redux-observable'
import { configureStore } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'

import { userEpics } from 'user/state/user.epic'
import { sharedEpics } from 'shared/state/shared.epics'
import { auditorsEpics } from 'auditors/state/auditors.epics'
import { projectsEpics } from 'projects/state/projects.epics'
import { userReducer, UserState } from 'user/state/user.reducer'
import { sharedReducer, SharedState } from 'shared/state/shared.reducer'
import { auditorsReducer, AuditorsState } from 'auditors/state/auditors.reducer'
import { projectsReducer, ProjectsState } from 'projects/state/projects.reducer'

export type AppState = {
  user: UserState
  shared: SharedState
  projects: ProjectsState
  auditors: AuditorsState
}

const epicMiddleware = createEpicMiddleware()
const epics = combineEpics(userEpics, sharedEpics, projectsEpics, auditorsEpics)

export const createRootReducer = () =>
  combineReducers({
    user: userReducer,
    shared: sharedReducer,
    projects: projectsReducer,
    auditors: auditorsReducer,
  })

export const store = configureStore({
  reducer: createRootReducer(),
  middleware: [epicMiddleware],
})

export type AppDispatch = typeof store.dispatch
// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector

epicMiddleware.run(epics)
