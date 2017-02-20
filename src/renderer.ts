import {div, makeDOMDriver} from '@cycle/dom'
import {run} from '@cycle/xstream-run'
// import xs from 'xstream'

// import UI from './ui'

export default function main({DOM}) {
  const mouse$ = DOM
    .select('document')
    .events('mousemove')
    .map((ev) => ({x: ev.clientX, y: ev.clientY}))

  return {
    DOM: mouse$.map((position) =>
      div([
        `x: ${position.x}`,
        `y: ${position.y}`,
      ]),
    ),
  }
}

const sources = {
  DOM: makeDOMDriver('#app')
}

run(main, sources)
