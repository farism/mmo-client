import {DOMSource} from '@cycle/dom'
import xs, {Stream} from 'xstream'

import actionCreatorFactory, {IAction} from '../../utils/actionCreatorFactory'

const actionCreator = actionCreatorFactory('chat')

interface ChangeInput {value: string}
export const changeInput = actionCreator<ChangeInput>('CHANGE_INPUT')

interface SendInput {value: string}
export const sendInput = actionCreator<SendInput>('SEND_INPUT')

export default function intent(DOM: DOMSource): Stream<IAction> {
  const changeInput$ = DOM
    .select('.input')
    .events('input')
    .map(ev => changeInput({ value: (ev.target as HTMLInputElement).value }))

  const sendInput$ = DOM
    .select('.input')
    .events('keydown')
    .filter((ev: KeyboardEvent) => ev.keyCode === 13)
    .map(ev => sendInput({ value: (ev.target as HTMLInputElement).value }))

  return xs.merge(
    changeInput$,
    sendInput$,
  )
}
