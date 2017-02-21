import xs from 'xstream'

// import intent from './intent'
// import model from './model'
import view from './view'

export default function Chat(sources) {
  return {
    DOM: view(sources).DOM,
  }
}
