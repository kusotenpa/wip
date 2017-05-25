import { StyleSheet } from 'aphrodite'

import { color } from './../style'

export default StyleSheet.create({
  controller: {
    width: '1920px',
    background: color.bg.main,
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'row',
  },
  viewer: {
    width: '720px',
  },
  previewsWrapper: {
    fontSize: '0',
  },
  knobWrapper: {
    display: 'inline-block',
    margin: '0 auto',
    backgroundColor: '#1a1a1a',
    borderRadius: '15px',
    border: '1px solid',
    padding: '10px 5px 5px',
  },
  knob0: {
    margin: '0 0 13px',
  },
})
