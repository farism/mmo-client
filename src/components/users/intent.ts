import {DOMSource} from '@cycle/dom'
import actionCreatorFactory, {AnyAction} from 'typescript-fsa'
import xs, {Stream} from 'xstream'

const actionCreator = actionCreatorFactory('chat')

interface ChangeInput {value: string}
export const changeInput = actionCreator<ChangeInput>('CHANGE_INPUT')

interface SendInput {value: string}
export const sendInput = actionCreator<SendInput>('SEND_INPUT')

export default function intent(DOM: DOMSource): Stream<AnyAction> {
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
