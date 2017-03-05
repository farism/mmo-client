import {DOMSource} from '@cycle/dom'
import actionCreatorFactory, {AnyAction} from 'typescript-fsa'
import xs, {Stream} from 'xstream'

const actionCreator = actionCreatorFactory('chat')

interface SetAutoScroll {autoScroll: boolean}
export const setAutoScroll = actionCreator<SetAutoScroll>('SET_AUTO_SCROLL')

interface ChangeInput {value: string}
export const changeInput = actionCreator<ChangeInput>('CHANGE_INPUT')

interface SendInput {value: string}
export const sendInput = actionCreator<SendInput>('SEND_INPUT')

function isScrollAtBottom(ev: Event) {
  const elementHeight = ev.srcElement.clientHeight
  const contentHeight = ev.srcElement.scrollHeight
  const scrollPosition = ev.srcElement.scrollTop

  return contentHeight - elementHeight === scrollPosition
}

export default function intent(DOM: DOMSource): Stream<AnyAction> {
  const scroll$ = DOM
    .select('.pane')
    .events('scroll')
    .map(ev => setAutoScroll({autoScroll: isScrollAtBottom(ev)}))

  const changeInput$ = DOM
    .select('.input')
    .events('input')
    .map(ev => changeInput({value: (ev.target as HTMLInputElement).value}))

  const sendInput$ = DOM
    .select('.input')
    .events('keydown')
    .filter((ev: KeyboardEvent) => ev.keyCode === 13)
    .map(ev => sendInput({value: (ev.target as HTMLInputElement).value}))

  return xs.merge(
    scroll$,
    changeInput$,
    sendInput$,
  )
}
