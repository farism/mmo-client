import {Channel, Presence, Socket} from 'phoenix'
import xs, {Stream} from 'xstream'

export interface Message {
  event: string;
  payload: Object;
  ref?: string;
  topic: string;
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

function listBy(id: string, payload: { metas: PresenceMeta[] }): Presence {
  return {
    id,
    ...payload.metas[0],
  }
}

export default class PhoenixSource {
  private chans: {[key: string]: Channel}
  private socket: Socket
  private socket$: Stream<Message>

  constructor(socket: Socket) {
    this.chans = {}
    this.socket = socket
    this.socket$ = xs.create<Message>({
      start: listener => {
        this.socket.onMessage((message: Message) => {
          listener.next(message)
        })
      },
      stop: () => {},
    })

    this.socket.onOpen(() => {
      this.join('world:lobby')
    })

    this.connect()
  }

  public connect = () => {
    this.socket.connect()
  }

  public disconnect = () => {
    this.socket.disconnect()
  }

  public join = (topic: string) => {
    if (!this.chans[topic]) {
      this.chans[topic] = this.socket.channel(topic)
      this.chans[topic].join()
    }
  }

  public leave = (topic: string) => {
    if (this.chans[topic]) {
      this.chans[topic].leave()
    }
  }

  public push = (message: Message) => {
    this.socket.push(message)
  }

  public message$ = (): Stream<Message[]> => {
    return this.socket$
      .filter(message => message.event === 'message')
      .fold((acc, message) => [...acc, message], [] as Message[])
      .startWith([])
  }

  public presence$ = (): Stream<Presence[]> => {
    const presenceState$ = this.socket$
      .filter(message => message.event === 'presence_state')
      .fold((acc, message) => Presence.syncState(acc, message.payload), {})
      .map(presences => Presence.list(presences, listBy) as Presence[])
      .startWith([])

    const presenceDiff$ = this.socket$
      .filter(message => message.event === 'presence_diff')
      .fold((acc, message) => Presence.syncDiff(acc, message.payload), {})
      .map(presences => Presence.list(presences, listBy) as Presence[])
      .startWith([])

    return xs.merge(presenceState$, presenceDiff$)
  }
}
