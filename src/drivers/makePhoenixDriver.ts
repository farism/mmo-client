import {Socket} from 'phoenix'
import xs from 'xstream'

interface Options {}

export default function makePhoenixDriver(url: string, opts: Options) {
  const socket = new Socket(url, opts)
  socket.connect()

  return function phoenixDriver(outgoing$) {
    outgoing$.addListener({
      next: (payload) => {
        console.log('sending:', payload)
        // socket.push(payload)
      },
      error: () => {},
      complete: () => {},
    })

    return xs.create({
      start: (listener) => {
        console.log(socket)
        socket.onMessage((payload) => {
          console.log('received:', payload)
          listener.next(payload)
        })
      },
      stop: () => {},
    })
  }
}
