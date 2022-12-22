import { catchError, filter, from, map, of, switchMap } from 'rxjs'
import { combineEpics, Epic } from 'redux-observable'

import * as customerApi from '@customer/api/customer.api'
import * as projectApi from '@customer/api/project.api'
import { customerActions } from '@customer/state/customer.reducer'
import { userActions } from 'user/state/user.reducer'

const loadCustomer: Epic = (action$, state$) =>
  action$.pipe(
    filter(customerActions.loadCustomerData.match),
    switchMap(() =>
      from(customerApi.get()).pipe(
        map((customer) => customerActions.loadCustomerDataSuccess(customer)),
        catchError((error) => of(customerActions.loadCustomerDataFail(error.message))),
      ),
    ),
  )

const createCustomer: Epic = (action$, state$) =>
  action$.pipe(
    filter(customerActions.createCustomer.match),
    switchMap(({ payload }) =>
      from(customerApi.create(payload)).pipe(
        map((customer) => customerActions.createCustomerSuccess(customer)),
        catchError((error) => of(customerActions.createCustomerFail(error.message))),
      ),
    ),
  )

const updateCustomer: Epic = (action$, state$) =>
  action$.pipe(
    filter(customerActions.updateCustomer.match),
    switchMap(({ payload }) =>
      from(customerApi.update(payload)).pipe(
        map((customer) => customerActions.updateCustomerSuccess(customer)),
        catchError((error) => of(customerActions.updateCustomerFail(error.message))),
      ),
    ),
  )

const loadProject: Epic = (action$, state$) =>
  action$.pipe(
    filter(customerActions.loadProject.match),
    switchMap(({ payload }) =>
      from(projectApi.get(payload)).pipe(
        map((project) => customerActions.loadProjectSuccess(project)),
        catchError((error) => of(customerActions.loadProjectFail(error.message))),
      ),
    ),
  )

const loadCustomerProjects: Epic = (action$, state$) =>
  action$.pipe(
    filter(customerActions.loadCustomerProjects.match),
    switchMap(({ payload }) =>
      from(projectApi.getMy(payload)).pipe(
        map((projects) => customerActions.loadCustomerProjectsSuccess(projects)),
        catchError((error) =>
          of(customerActions.loadCustomerProjectsFail(error.message)),
        ),
      ),
    ),
  )

const createProject: Epic = (action$, state$) =>
  action$.pipe(
    filter(customerActions.createProject.match),
    switchMap(({ payload }) =>
      from(projectApi.create(payload)).pipe(
        map((project) => customerActions.createProjectSuccess(project)),
        catchError((error) => of(customerActions.createProjectFail(error.message))),
      ),
    ),
  )

const updateProject: Epic = (action$, state$) =>
  action$.pipe(
    filter(customerActions.updateProject.match),
    switchMap(({ payload }) =>
      from(projectApi.update(payload)).pipe(
        map((project) => customerActions.updateProjectSuccess(project)),
        catchError((error) => of(customerActions.updateProjectFail(error.message))),
      ),
    ),
  )

const resetCustomerState: Epic = (action$, state$) =>
  action$.pipe(
    filter(userActions.logout.match),
    map(() => customerActions.resetCustomerState()),
  )

export const customerEpics = combineEpics(
  loadCustomer,
  updateCustomer,
  createCustomer,
  loadProject,
  createProject,
  updateProject,
  loadCustomerProjects,
  resetCustomerState,
)
