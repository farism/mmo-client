import {Channel, Presence, Socket} from 'phoenix'
import xs, {MemoryStream, Stream} from 'xstream'

interface Options {
  params?: object;
}

interface SocketMessage {
  event: string;
  payload: object;
  ref?: string;
  topic: string;
}

interface PresenceUserMeta {
  name: string;
  online_at: number;
  phx_ref: string;
}

interface PresenceUser {
  metas: PresenceUserMeta[];
}

interface PresenceMap {
  [key: string]: PresenceUser;
}

class PhoenixSource {
  private chans: {[key: string]: Channel}
  private sock: Socket

  constructor(url: string, opts: Options) {
    this.chans = {}
    this.sock = new Socket(url, opts)
    this.sock.connect()
  }

  public socket = (): Stream<SocketMessage> => {
    return xs.create<SocketMessage>({
      start: listener => {
        this.sock.onMessage(message => {
          listener.next(message)
        })
      },
      stop: () => {},
    })
  }

  public channels = (topic: string): Stream<SocketMessage> => {
    if (!this.chans[topic]) {
      this.chans[topic] = this.sock.channel(topic)
      this.chans[topic].join()
    }

    return this.socket().filter(message => message.topic === topic)
  }

  public messages = (topic: string): MemoryStream<SocketMessage[]> => {
    return this.channels(topic)
      .filter(message => message.event === 'message')
      .fold((acc, message): SocketMessage[] => [...acc, message].slice(), [])
  }

  public presences = (topic: string): MemoryStream<PresenceMap> => {
    return this.channels(topic)
      .filter(message => message.event === 'presence_diff')
      .fold((acc, message): PresenceMap => Presence.syncDiff(acc, message.payload), {})
      .map(presences => Presence.list(presences, (id, {metas: [first]}) => ({...first, id})))
  }
}

export default function makePhoenixDriver(url: string, opts: Options) {
  return function phoenixDriver(outgoing$) {
    outgoing$.addListener({
      next: payload => {
        console.log(payload)
      },
      error: () => {},
      complete: () => {},
    })

    return new PhoenixSource(url, opts)
  }
}
