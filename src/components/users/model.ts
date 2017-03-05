import {AnyAction} from 'typescript-fsa'
import xs, {Stream} from 'xstream'

import checkActionType from '../../utils/checkActionType'
import {changeInput, sendInput} from './intent'

export interface State {
  inputValue: string;
}

export type Reducer = (prev?: State) => State | undefined

export default function model(action$: Stream<AnyAction>): Stream<Reducer> {
  const defaultReducer$ = xs.of(function initialReducer(prev?: State): State {
    return prev || {
      inputValue: '',
    }
  })

  const changeInputReducer$ = action$
    .compose(checkActionType(changeInput))
    .map(ac => function changeInputReducer(prev?: State): State {
      return {
        ...prev,
        inputValue: ac.payload.value,
      }
    })

  const sendInputReducer$ = action$
    .compose(checkActionType(sendInput))
    .map(ac => function sendInputReducer(prev?: State): State {
      return {
        ...prev,
        inputValue: '',
      }
    })

  return xs.merge(
    defaultReducer$,
    changeInputReducer$,
    sendInputReducer$,
  )
}
