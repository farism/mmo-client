import {Channel, Presence, Socket} from 'phoenix'
import xs, {MemoryStream, Stream} from 'xstream'

interface Options {
  params?: Object;
}

interface SocketMessage {
  event: string;
  payload: Object;
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

function syncPresence(event: string, prev: Object, next: Object): PresenceMap {
  if (event === 'presence_state') {
    return Presence.syncState(prev, next)
  } else if (event === 'presence_diff') {
    return Presence.syncDiff(prev, next)
  }

  return {}
}

export class PhoenixSource {
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
      .fold((acc, message): SocketMessage[] => [...acc, message], [])
  }

  public presences = (topic: string): MemoryStream<PresenceMap[]> => {
    return this.channels(topic)
      .filter(({event}) => event === 'presence_state' || event === 'presence_diff')
      .fold((acc, {event, payload}): PresenceMap => syncPresence(event, acc, payload), {})
      .map(presences => Presence.list(presences, (id, {metas: [first]}) => ({...first, id})))
  }
}

export default function makePhoenixDriver(url: string, opts: Options) {
  return function phoenixDriver(outgoing$) {
    const source = new PhoenixSource(url, opts)

    outgoing$.addListener({
      next: ac => console.log(ac),
      error: err => {},
      complete: () => {},
    })

    return source
  }
}
