import {Socket} from 'phoenix'
import {Stream} from 'xstream'

import PhoenixSource, {Message} from './PhoenixSource'

interface Options {
  params?: Object;
}

export function makePhoenixDriver(url: string, opts: Options) {
  const socket = new Socket(url, opts)
  const source = new PhoenixSource(socket)

  return function phoenixDriver(outgoing$: Stream<Message>) {
    outgoing$.addListener({
      next: (message: Message) => {
        source.push(message)
      }
    })

    return source
  }
}
