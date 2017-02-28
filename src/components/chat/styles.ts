import {style} from 'typestyle'

export const pane = style({
  border: '1px solid black',
  height: '100px',
  overflowY: 'scroll',
})

export const input = style({
  border: '1px solid black',
  width: '100%',
})

export default {
  pane,
  input,
}
