import { filter, map, Observable } from 'rxjs'
import { combineEpics, Epic } from 'redux-observable'
import { PayloadAction } from '@reduxjs/toolkit'

import { userActions } from 'user/state/user.reducer'
import { SharedState } from 'shared/state/shared.reducer'

type Actions = Observable<PayloadAction>
type States = Observable<SharedState>

export const saveUserAfterLogin: Epic = (action$: Actions, state$: States) =>
  action$.pipe(
    filter(userActions.loginSuccess.match),
    map(({ payload }) => userActions.setUser(payload)),
  )

export const saveUserAfterRegistration: Epic = (action$: Actions, state$: States) =>
  action$.pipe(
    filter(userActions.registrationSuccess.match),
    map(({ payload }) => userActions.setUser(payload)),
  )

export const sharedEpics = combineEpics(saveUserAfterLogin, saveUserAfterRegistration)
