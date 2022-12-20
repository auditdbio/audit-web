// import { Observable } from 'rxjs'
import { combineEpics } from 'redux-observable'
// import { PayloadAction } from '@reduxjs/toolkit'

// import { SharedState } from 'shared/state/shared.reducer'

// type Actions = Observable<PayloadAction>
// type States = Observable<SharedState>

export const sharedEpics = combineEpics()
