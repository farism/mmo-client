import xs from 'xstream'

import defaultReducer from '../../utils/defaultReducer'
// import {State as ChatState} from '../chat/model'

export interface State {
  // chat: ChatState;
}

export type Reducer = (prev?: State) => State | undefined

export default function model(action$: State) {
  const defaultReducer$ = defaultReducer<State>({})

  return xs.merge(
    defaultReducer$,
  )
}
