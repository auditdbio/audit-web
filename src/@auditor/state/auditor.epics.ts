import { catchError, filter, from, map, of, switchMap } from 'rxjs'
import { combineEpics, Epic } from 'redux-observable'

import * as api from '@auditor/api/auditor.api'
import { auditorActions } from '@auditor/state/auditor.reducer'

const loadAuditor: Epic = (action$, state$) =>
  action$.pipe(
    filter(auditorActions.loadAuditorData.match),
    switchMap(() =>
      from(api.get()).pipe(
        map((auditor) => auditorActions.loadAuditorDataSuccess(auditor)),
        catchError((error) => of(auditorActions.loadAuditorDataFail(error.message))),
      ),
    ),
  )

const createAuditor: Epic = (action$, state$) =>
  action$.pipe(
    filter(auditorActions.createAuditor.match),
    switchMap(({ payload }) =>
      from(api.create(payload)).pipe(
        map((auditor) => auditorActions.createAuditorSuccess(auditor)),
        catchError((error) => of(auditorActions.createAuditorFail(error.message))),
      ),
    ),
  )

const updateAuditor: Epic = (action$, state$) =>
  action$.pipe(
    filter(auditorActions.updateAuditor.match),
    switchMap(({ payload }) =>
      from(api.update(payload)).pipe(
        map((auditor) => auditorActions.updateAuditorSuccess(auditor)),
        catchError((error) => of(auditorActions.updateAuditorFail(error.message))),
      ),
    ),
  )

export const auditorEpics = combineEpics(loadAuditor, updateAuditor, createAuditor)
