import xs from 'xstream'

import * as Intent from './intent'

export interface State {
  // chat: ChatState;
}

export type Reducer = (prev?: State) => State | undefined

function defaultReducer$(initialState = {}) {
  return xs.of(function defaultReducer(state: State) {
    if (typeof state === 'undefined') {
      return initialState
    } else {
      return state
    }
  })
}

export default function model(action$: State) {
  return xs.merge(
    defaultReducer$(),
  )
}