import { filter, map, Observable } from 'rxjs'
import { combineEpics, Epic } from 'redux-observable'
import { PayloadAction } from '@reduxjs/toolkit'

import { userActions } from 'user/state/user.reducer'
import { SharedState } from 'shared/state/shared.reducer'

type Actions = Observable<PayloadAction>
type States = Observable<SharedState>

export const sharedEpics = combineEpics()
