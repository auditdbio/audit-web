import { catchError, filter, from, map, of, switchMap } from 'rxjs'
import { combineEpics, Epic } from 'redux-observable'

import * as api from '@customer/api/customer.api'
import { customerActions } from '@customer/state/customer.reducer'

const loadCustomer: Epic = (action$, state$) =>
  action$.pipe(
    filter(customerActions.loadCustomerData.match),
    switchMap(() =>
      from(api.get()).pipe(
        map((customer) => customerActions.loadCustomerDataSuccess(customer)),
        catchError((error) => of(customerActions.loadCustomerDataFail(error.message))),
      ),
    ),
  )

const createCustomer: Epic = (action$, state$) =>
  action$.pipe(
    filter(customerActions.createCustomer.match),
    switchMap(({ payload }) =>
      from(api.create(payload)).pipe(
        map((customer) => customerActions.createCustomerSuccess(customer)),
        catchError((error) => of(customerActions.createCustomerFail(error.message))),
      ),
    ),
  )

const updateCustomer: Epic = (action$, state$) =>
  action$.pipe(
    filter(customerActions.updateCustomer.match),
    switchMap(({ payload }) =>
      from(api.update(payload)).pipe(
        map((customer) => customerActions.updateCustomerSuccess(customer)),
        catchError((error) => of(customerActions.updateCustomerFail(error.message))),
      ),
    ),
  )

export const customerEpics = combineEpics(loadCustomer, updateCustomer, createCustomer)
