import xs, {Stream} from 'xstream'

import {IAction} from '../../utils/actionCreatorFactory'
import checkActionType from '../../utils/checkActionType'
import {changeInput, sendInput, setAutoScroll} from './intent'

export interface State {
  autoScroll: boolean;
  inputValue: string;
}

export type Reducer = (prev?: State) => State | undefined

export default function model(action$: Stream<IAction>): Stream<Reducer> {
  const defaultReducer$ = xs.of(function initialReducer(prev?: State): State {
    return prev || {
      autoScroll: true,
      inputValue: '',
    }
  })

  const setAutoScrollReducer$ = action$
    .compose(checkActionType(setAutoScroll))
    .map(ac => function autoScrollReducer(prev?: State): State {
      return {
        ...prev,
        autoScroll: ac.payload.autoScroll,
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
    setAutoScrollReducer$,
    changeInputReducer$,
    sendInputReducer$,
  )
}
