import { combineEpics, Epic } from 'redux-observable'
import { PayloadAction } from '@reduxjs/toolkit'
import {
  withLatestFrom,
  Observable,
  catchError,
  switchMap,
  filter,
  from,
  map,
  of,
} from 'rxjs'

import {
  login,
  changeName,
  userDelete,
  registration,
  changePassword,
} from 'user/api/user.api'
import { User } from 'shared/models/User'
import { userActions, UserState } from 'user/state/user.reducer'

type Actions = Observable<PayloadAction>
type States = Observable<UserState>

const registerUser: Epic = (action$: Actions, state$: States) =>
  action$.pipe(
    filter(userActions.registration.match),
    switchMap(({ payload }) =>
      from(registration(payload)).pipe(
        map(() => userActions.registrationSuccess()),
        catchError((error) => of(userActions.registrationError(error.message))),
      ),
    ),
  )

const loginUser: Epic = (action$: Actions, state$: States) =>
  action$.pipe(
    filter(userActions.login.match),
    switchMap(({ payload }) =>
      from(login(payload)).pipe(
        map((user) => userActions.loginSuccess(user)),
        catchError((error) => of(userActions.loginError(error.message))),
      ),
    ),
  )

export const changeUserName: Epic = (action$: Actions, state$: States) =>
  action$.pipe(
    filter(userActions.setUserName.match),
    withLatestFrom(state$.pipe(map((state) => state.user as User))),
    switchMap(([{ payload }, user]) =>
      from(changeName(payload, user?.email)).pipe(
        map((user) => userActions.setUserNameSuccess(user)),
        catchError((error) => of(userActions.setUserNameError(error))),
      ),
    ),
  )

export const changeUserPassword: Epic = (action$: Actions, state$: States) =>
  action$.pipe(
    filter(userActions.setUserPassword.match),
    withLatestFrom(state$.pipe(map((state) => state.user as User))),
    switchMap(([{ payload }, user]) =>
      from(changePassword(payload, user?.email)).pipe(
        map((user) => userActions.setUserPasswordSuccess(user)),
        catchError((error) => of(userActions.setUserPasswordError(error))),
      ),
    ),
  )

export const deleteCurrentUser: Epic = (action$: Actions, state$: States) =>
  action$.pipe(
    filter(userActions.userDelete.match),
    withLatestFrom(state$.pipe(map((state) => state.user as User))),
    switchMap(([, user]) =>
      from(userDelete()).pipe(
        map(() => userActions.userDeleteSuccess()),
        catchError((error) => of(userActions.userDeleteError(error))),
      ),
    ),
  )

export const userEpics = combineEpics(
  registerUser,
  loginUser,
  changeUserName,
  changeUserPassword,
  deleteCurrentUser,
)
