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

interface Message extends PresenceMeta {
  id: string;
}

interface PresenceMap {
  [id: string]: {
    metas: PresenceMeta[];
  };
}

interface Message {
  event: string;
  payload: Object;
  ref?: string;
  topic: string;
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
    this.connect()
  }

  public connect = () => {
    this.sock.connect()
  }

  public disconnect = () => {
    this.sock.connect()
  }

  public join = (topic: string) => {
    if (!this.chans[topic]) {
      this.chans[topic] = this.sock.channel(topic)
      this.chans[topic].join()
    }
  }

  public leave = (topic: string) => {
    if (this.chans[topic]) {
      this.chans[topic].leave()
    }
  }

  public socket$ = (): Stream<[Presence[], Message[]]> => {
    const presenceState$ = this.socket()
      .filter(message => message.event === 'presence_state')
      .fold((acc, message) => Presence.syncState(acc, message.payload), {})
      .map(presences => Presence.list(presences, listBy) as Presence[])
      .startWith([])

    const presenceDiff$ = this.socket()
      .filter(message => message.event === 'presence_diff')
      .fold((acc, message) => Presence.syncDiff(acc, message.payload), {})
      .map(presences => Presence.list(presences, listBy) as Presence[])
      .startWith([])

    const presences$ = xs.merge(presenceState$, presenceDiff$)

    const chat$ = this.socket()
      .filter(message => message.event === 'message')
      .fold((acc, message) => [...acc, message], [] as Message[])
      .startWith([])

    return xs.combine(presences$, chat$)
  }

  private socket = (): Stream<Message> => {
    return xs.create<Message>({
      start: listener => {
        this.sock.onMessage(message => {
          listener.next(message)
        })
      },
      stop: () => {},
    })
  }
}

export default function makePhoenixDriver(url: string, opts: Options) {
  return function phoenixDriver(outgoing$) {
    const source = new PhoenixSource(url, opts)

    outgoing$.addListener({
      next: (ac) => console.log(ac)
    })

    return source
  }
}
