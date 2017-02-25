import {div, DOMSource, input, li, makeDOMDriver, ul, VNode} from '@cycle/dom'
import isolate from '@cycle/isolate'
import {run} from '@cycle/xstream-run'
import onionify from 'cycle-onionify'
import * as dotenv from 'dotenv'
import xs, {Stream} from 'xstream'
dotenv.config()

import UI from './components/ui'
import makePhoenixDriver, {PhoenixSource} from './drivers/makePhoenixDriver'

interface RendererSource {
  DOM: DOMSource;
  phoenix: PhoenixSource;
  onion: any;
}

interface RendererSink {
  DOM?: Stream<VNode>;
  phoenix?: any;
  onion?: any;
}

interface Action {
  type: string;
  payload: Object;
}

function Renderer(sources: RendererSource): RendererSink {
  // const socket$ = sources.phoenix.socket$()
  const state$ = sources.onion.state$
  const ui = isolate(UI, 'ui')(sources)

  const reducer$ = xs.merge(
    xs.of(() => ({})),
    ui.onion,
  )

  return {
    // phoenix: outgoing$,
    onion: reducer$,
    DOM: xs.combine(state$, ui.DOM).map(([state, UIVNode]) => {
      return div('.renderer', [
        'renderer',
        UIVNode,
      ])
    }),
  }
}

const sources = {
  DOM: makeDOMDriver('#app'),
  phoenix: makePhoenixDriver('ws://localhost:4000/socket', {params: {guardian_token: process.env.JWT}}),
}

run(onionify(Renderer), sources)
