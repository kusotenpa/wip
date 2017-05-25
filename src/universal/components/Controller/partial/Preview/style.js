import { StyleSheet } from 'aphrodite'

export default StyleSheet.create({
  canvas: {
    position: 'relative',
    display: 'inline-block',
    fontSize: '0',
  },
  active: {
    ':after': {
      content: '""',
      display: 'block',
      position: 'absolute',
      width: '100%',
      height: '100%',
      borderTop: '5px solid #00ff55',
      top: '0',
      boxSizing: 'border-box',
    },
  },
})
