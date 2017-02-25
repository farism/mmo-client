import {div, input} from '@cycle/dom'

export default function view(state$) {
  return state$.map(state =>
    div([
      'chat',
      input('.input', {attrs: {type: 'text'}}),
    ]),
  )
}
