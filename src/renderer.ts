import {makeDOMDriver} from '@cycle/dom'
import {run} from '@cycle/run'
import onionify from 'cycle-onionify'
import * as dotenv from 'dotenv'
dotenv.config()

import App from './components/app'
import {makePhoenixDriver} from './drivers/phoenix'

const sources = {
  DOM: makeDOMDriver('#app'),
  phoenix: makePhoenixDriver('ws://localhost:4000/socket', {
    params: {guardian_token: process.env.JWT},
  }),
}

run(onionify(App), sources)
