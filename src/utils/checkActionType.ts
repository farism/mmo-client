import {Stream} from 'xstream'

import {Action, ActionCreator, IAction, isType} from './actionCreatorFactory'

export default function checkActionType<P>(actionCreator: ActionCreator<P>){
  return (stream: Stream<IAction>): Stream<Action<P>> => {
    return stream
      .filter(ac => isType(ac, actionCreator))
      .map(ac => ac as Action<P>)
  }
}
