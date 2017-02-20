// import xstreamAdapter from '@cycle/xstream-adapter'
// import {Socket} from 'phoenix'
// import fromEvent from 'xstream/extra/fromEvent'
// import xs from 'xstream'
//
// export default function makePhoenixDriver(url, opts) {
//
//   return function mouseDriver(sinks, streamAdapter) {
//     // const presences$ = xs.create({
//     //   start: function(listener) {
//     //     const socket = new Socket(url, opts)
//     //
//     //     socket.on('presence_update')
//     //   }
//     //   stop: function() {
//     //
//     //   }
//     // })
//
//     return {
//       presences() {
//         return presences$
//           .map((ev) => ({}))
//           .startWith([])
//       },
//     }
//   }
// }
