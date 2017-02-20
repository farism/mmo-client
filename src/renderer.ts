import {makeDOMDriver} from '@cycle/dom'
import {run} from '@cycle/xstream-run'

import UI from './ui'

export default function Renderer({DOM}) {
  return {
    DOM: UI({DOM}).DOM,
  }
}

const sources = {
  DOM: makeDOMDriver('#app'),
}

run(Renderer, sources)
