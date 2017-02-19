import * as net from 'net'
import { Presence, Socket } from 'phoenix'
import * as React from 'react'
import * as dotenv from 'dotenv'
dotenv.config()

import UI from './ui'

// const socket = new Socket('ws://localhost:4000/socket', { params: { guardian_token: process.env.JWT } })
//
// socket.connect()
//
// let presences = {}
//
// const room = socket.channel('world:lobby')
//
// room.on('presence_state', (state) => {
//   presences = Presence.syncState(presences, state)
// })
//
// room.on('presence_diff', (diff) => {
//   presences = Presence.syncDiff(presences, diff)
// })
//
// room.join()

export default (props: any) => {
  return <UI />
}
