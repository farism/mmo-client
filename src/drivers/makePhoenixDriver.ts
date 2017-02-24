import {Channel, Presence, Socket} from 'phoenix'
import xs, {MemoryStream, Stream} from 'xstream'

interface Options {
  params?: Object;
}

interface PresenceMeta {
  name: string;
  online_at: number;
  phx_ref: string;
}

interface Presence extends PresenceMeta {
  id: string;
}

interface PresenceMap {
  [id: string]: {
    metas: PresenceMeta[];
  };
}

interface SocketMessage {
  event: string;
  payload: Object;
  ref?: string;
  topic: string;
}

interface PresenceStateMessage extends SocketMessage {
  payload: PresenceMap;
}

interface PresenceDiffMessage extends SocketMessage {
  payload: {
    joins: PresenceMap;
    leaves: PresenceMap;
  };
}

function listBy(id: string, payload: { metas: PresenceMeta[] }): Presence {
  return {
    id,
    ...payload.metas[0],
  }
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

  public presences = (topic: string): MemoryStream<Presence[]> => {
    const state$ = this.channels(topic)
      .filter(message => message.event === 'presence_state')
      .fold((acc, message) => Presence.syncState(acc, message.payload), {})
      .map(presences => Presence.list(presences, listBy) as Presence[])

    const diff$ = this.channels(topic)
      .filter(message => message.event === 'presence_diff')
      .fold((acc, message) => Presence.syncDiff(acc, message.payload), {})
      .map(presences => Presence.list(presences, listBy) as Presence[])

    return xs.merge(state$, diff$) as MemoryStream<Presence[]>
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
