import {div} from '@cycle/dom'
import xs from 'xstream'

import Root from './root'

export default function UI({DOM}) {
  const state$ = xs.from([]).startWith(0)

  return {
    DOM: state$.map((val) =>
      div([
        'ui',
        Root({state$}).DOM,
      ]),
    ),
  }
}
