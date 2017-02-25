import {isType} from 'redux-typescript-actions'
import xs, {Stream} from 'xstream'

import {Action} from './intent'

export interface State {
  inputValue: Object;
}

export type Reducer = (prev?: State) => State | undefined

export default function model(action$: Stream<Action>): Stream<Reducer> {
  const defaultReducer$ = xs.of(function initialReducer(prev?: State): State {
    return prev || {
      inputValue: '',
    }
  })

  const changeInput$ = action$
    .filter(ac => ac.type === 'CHANGE_INPUT')
    .map(ac => function changeInputReducer(prev?: State): State {
      return {
        ...prev,
        inputValue: '',
      }
    })

  return xs.merge(
    defaultReducer$,
    // changeInput$,
  )
}