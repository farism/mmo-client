import {div, input, li, ul, VNode} from '@cycle/dom'
import {MemoryStream, Stream} from 'xstream'
import xs from 'xstream'

import {Message} from '../../drivers/phoenix/PhoenixSource'
import {State} from './model'
import styles from './styles'

export default function view(
  state$: MemoryStream<State>,
  message$: Stream<Message[]>,
): Stream<VNode> {
  return xs.combine(state$, message$).map(([state, messages]) => {
    return div([
      div(`.pane ${styles.pane}`, {
        hook: {
          postpatch: (oldVnode: VNode, vnode: VNode) => {
            const el = vnode.elm as Element
            if (state.autoScroll) {
              el.scrollTop = el.scrollHeight - el.clientHeight
            }
          }
        }
      }, [
        ul([
          ...messages.map(message => li(message.payload.value)),
        ]),
      ]),
      div([
        input(`.input ${styles.input}`, {props: {value: state.inputValue}}),
      ]),
    ])
  })
}
