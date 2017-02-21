import {Channel, Socket} from 'phoenix'
import xs, {Stream} from 'xstream'

interface Options {
  params?: {}
}

interface SocketMessage {
  event: string;
  payload: {};
  ref?: string;
  topic: string;
}

class PhoenixSource {
  private channels: {[key: string]: Channel}
  private socket: Socket

  constructor(url: string, opts: Options) {
    this.channels = {}
    this.socket = new Socket(url, opts)
    this.socket.connect()
  }

  public socket$ = (): Stream<SocketMessage> => {
    return xs.create<SocketMessage>({
      start: listener => {
        this.socket.onMessage(message => {
          listener.next(message)
        })
      },
      stop: () => {},
    })
  }

  public channel$ = (topic: string): Stream<SocketMessage> => {
    if (!this.channels[topic]) {
      this.channels[topic] = this.socket.channel(topic)
      this.channels[topic].join()
    }

    return this.socket$().filter(message => message.topic === topic)
  }

  public message$ = (topic: string): Stream<SocketMessage> => {
    return this.channel$(topic)
      .filter(message => message.event === 'message')
  }

  public presence$ = (topic: string): Stream<SocketMessage> => {
    return this.channel$(topic)
      .filter(message => message.event === 'presence_state' || message.event === 'presence_diff')
  }
}

export default function makePhoenixDriver(url: string, opts: Options) {
  return function phoenixDriver(outgoing$) {
    return new PhoenixSource(url, opts)
  }
}
