import {div, input, VNode} from '@cycle/dom'
import {MemoryStream} from 'xstream'

import {State} from './model'

export default function view(state$: MemoryStream<State>): MemoryStream<VNode> {
  return state$.map(state => {
    return div('.chat', [
      'chat',
      input('.input', {attrs: {type: 'text'}, props: {value: state.inputValue}}),
    ])
  })
}
