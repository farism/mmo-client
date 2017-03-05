import {Action, ActionCreator, AnyAction, isType} from 'typescript-fsa'
import {Stream} from 'xstream'

export default function checkActionType<P>(actionCreator: ActionCreator<P>){
  return (stream: Stream<AnyAction>): Stream<Action<P>> => {
    return stream
      .filter(ac => isType(ac, actionCreator))
      .map(ac => ac as Action<P>)
  }
}
