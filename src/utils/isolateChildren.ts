import {VNode} from '@cycle/dom'
import isolate from '@cycle/isolate'
import xs, {Stream} from 'xstream'

interface ChildMap {
  [s: string]: (Child: any) => {}
}

export default function isolateChildren<T>(sources: T, children: ChildMap) {
  const sinks = Object.keys(children).reduce((acc, key) => {
    return {
      ...acc,
      [key]: isolate(children[key], key)(sources),
    }
  }, {} as { [s: string]: any })

  const vnodes$ = Object.keys(sinks).reduce((acc, key) => {
    return {
      ...acc,
      [key]: sinks[key].DOM as Stream<VNode>,
    }
  }, {})

  const reducers$ = Object.keys(sinks).reduce((acc, key) => {
    return xs.merge(acc, sinks[key].onion)
  }, xs.create())

  return {
    sinks,
    vnodes$,
    reducers$,
  }
}