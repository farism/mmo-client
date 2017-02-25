import {DOMSource} from '@cycle/dom'
import xs, {Stream} from 'xstream'

export interface ChangeInputAction {
  type: 'CHANGE_INPUT';
  payload: string;
};

export type Action = ChangeInputAction

export default function intent(DOM: DOMSource): Stream<Action> {
  const changeInput$ = DOM
    .select('.input')
    .events('input')
    .map(ev => ({
      type: 'CHANGE_INPUT',
      payload: ev.target.value,
    } as ChangeInputAction))

  return xs.merge(
    changeInput$,
  )
}