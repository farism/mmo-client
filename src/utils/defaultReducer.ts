import xs from 'xstream'

export default function defaultReducer<T>(initialState: T) {
  return xs.of(function defaultReducer(state: T): T {
    if (typeof state === 'undefined') {
      return initialState as T
    } else {
      return state
    }
  })
}
