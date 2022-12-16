import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { combineEpics, createEpicMiddleware } from 'redux-observable'
import { configureStore } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'

import { userEpics } from 'user/state/user.epic'
import { sharedEpics } from 'shared/state/shared.epics'
import { auditorsEpics } from 'auditors/state/auditors.epics'
import { customerEpics } from '@customer/state/customer.epics'
import { userReducer, UserState } from 'user/state/user.reducer'
import { sharedReducer, SharedState } from 'shared/state/shared.reducer'
import { auditorsReducer, AuditorsState } from 'auditors/state/auditors.reducer'
import { customerReducer, CustomerState } from '@customer/state/customer.reducer'

export type AppState = {
  user: UserState
  shared: SharedState
  customer: CustomerState
  auditors: AuditorsState
}

const epicMiddleware = createEpicMiddleware()
const epics = combineEpics(userEpics, sharedEpics, customerEpics, auditorsEpics)

export const createRootReducer = () =>
  combineReducers({
    user: userReducer,
    shared: sharedReducer,
    customer: customerReducer,
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
