import {isType} from 'redux-typescript-actions'
import xs from 'xstream'

import * as Intent from './intent'

function defaultReducer$(initialState = {}) {
  return xs.of(function defaultReducer(state) {
    if (typeof state === 'undefined') {
      return initialState
    } else {
      return state
    }
  })
}

export default function model(action$) {
  return xs.merge(
    defaultReducer$(),
  )
}