import { PayloadAction } from '@reduxjs/toolkit'
import {
  emailChange,
  login,
  nameChange,
  passwordChange,
  registration,
  userDelit,
} from 'user/api/user.api'
import { combineEpics, Epic } from 'redux-observable'
import {
  catchError,
  filter,
  from,
  map,
  of,
  switchMap,
  Observable,
  withLatestFrom,
} from 'rxjs'
import { userActions, UserState } from './user.reducer'
import { User } from 'shared/models/User'

type Actions = Observable<PayloadAction>
type States = Observable<UserState>

const registerUser: Epic = (action$: Actions, state$: States) =>
  action$.pipe(
    filter(userActions.registration.match),
    switchMap(({ payload }) =>
      from(registration(payload)).pipe(
        map((user) => userActions.registrationSuccess(user)),
        catchError((error) => of(userActions.registrationError(error))),
      ),
    ),
  )

const loginUser: Epic = (action$: Actions, state$: States) =>
  action$.pipe(
    filter(userActions.login.match),
    switchMap(({ payload }) =>
      from(login(payload)).pipe(
        map((user) => userActions.loginSuccess(user)),
        catchError((error) => of(userActions.loginError(error))),
      ),
    ),
  )

export const changeUserEmail: Epic = (action$: Actions, state$: States) =>
  action$.pipe(
    filter(userActions.setUserEmail.match),
    withLatestFrom(state$.pipe(map((state) => state.user as User))),
    switchMap(([{ payload }, user]) =>
      from(emailChange(payload, user?._id)).pipe(
        map((user) => userActions.setUserEmailSuccess(user)),
        catchError((error) => of(userActions.setUserEmailError(error))),
      ),
    ),
  )

export const changeUserName: Epic = (action$: Actions, state$: States) =>
  action$.pipe(
    filter(userActions.setUserName.match),
    withLatestFrom(state$.pipe(map((state) => state.user as User))),
    switchMap(([{ payload }, user]) =>
      from(nameChange(payload, user?._id)).pipe(
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
      from(passwordChange(payload, user?._id)).pipe(
        map((user) => userActions.setUserPasswordSuccess(user)),
        catchError((error) => of(userActions.setUserPasswordError(error))),
      ),
    ),
  )

export const deleteUser: Epic = (action$: Actions, state$: States) =>
  action$.pipe(
    filter(userActions.deleteUser.match),
    withLatestFrom(state$.pipe(map((state) => state.user as User))),
    switchMap(([, user]) =>
      from(userDelit(user?._id)).pipe(
        map(() => userActions.deleteUserSuccess()),
        catchError((error) => of(userActions.deleteUserError(error))),
      ),
    ),
  )

export const userEpics = combineEpics(
  registerUser,
  loginUser,
  changeUserEmail,
  changeUserName,
  changeUserPassword,
  deleteUser,
)
