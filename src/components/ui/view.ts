import {div} from '@cycle/dom'

export default function view(state$) {
  return state$.map(state => {
    return div('.ui', [
      'UI',
      // Chat(state).DOM,
    ])
  })
}
