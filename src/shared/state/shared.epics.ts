import { catchError, filter, from, map, Observable, of, switchMap } from 'rxjs'
import { PayloadAction } from '@reduxjs/toolkit'
import { combineEpics, Epic } from 'redux-observable'

import * as projectsApi from '@customer/api/project.api'
import * as auditorsApi from '@auditor/api/auditor.api'
import { sharedActions, SharedState } from 'shared/state/shared.reducer'

type Actions = Observable<PayloadAction>
type States = Observable<SharedState>

const loadAuditors: Epic = (action$: Actions, state$: States) =>
  action$.pipe(
    filter(sharedActions.loadAuditors.match),
    switchMap(() =>
      from(auditorsApi.getAll()).pipe(
        map((auditors) => sharedActions.loadAuditorsSuccess(auditors)),
        catchError((error) => of(sharedActions.loadAuditorsError(error.message))),
      ),
    ),
  )

const loadProjects: Epic = (action$: Actions, state$: States) =>
  action$.pipe(
    filter(sharedActions.loadProjects.match),
    switchMap(() =>
      from(projectsApi.getAll()).pipe(
        map((projects) => sharedActions.loadProjectsSuccess(projects)),
        catchError((error) => of(sharedActions.loadProjectsError(error.message))),
      ),
    ),
  )

export const sharedEpics = combineEpics(loadAuditors, loadProjects)
