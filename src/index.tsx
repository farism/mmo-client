import * as net from 'net'
import * as React from 'react'

import UI from './ui'

const client = net.connect({ port: 8124 }, () => {
  console.log('connected to server!')
  client.write('world!\r\n')
})

client.on('data', (data) => {
  console.log(data.toString())
  client.end()
})

client.on('end', () => {
  console.log('disconnected from server')
})

export default (props: any) => {
  return <UI />
}
