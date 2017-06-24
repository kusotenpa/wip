import { StyleSheet } from 'aphrodite'

export default StyleSheet.create({
  fullscreen: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    padding: '5px',
    opacity: 0,
    color: '#fff',
    border: '1px solid',
    ':hover': {
      opacity: 1,
      cursor: 'pointer',
    },
  },
  play: {
    position: 'absolute',
    right: '10px',
    bottom: '10px',
    padding: '5px',
    opacity: 0,
    color: '#fff',
    border: '1px solid',
    ':hover': {
      opacity: 1,
      cursor: 'pointer',
    },
  },
})
