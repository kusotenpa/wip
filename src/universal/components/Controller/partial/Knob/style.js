import { StyleSheet } from 'aphrodite'

const knobSize = 50
const knobBorderSize = knobSize * 1.2
const knobBorderHeight = knobSize / 3.3
const currentWidth = knobSize / 2
const currentHieght = knobSize / 10
const currentTop = (knobSize / 2) - (currentHieght / 2)

export default StyleSheet.create({
  knobBorder: {
    width: `${knobBorderSize}px`,
    height: `${knobBorderSize}px`,
    margin: '0 13px',
    borderRadius: '50%',
    border: '1px solid #333',
    position: 'relative',
    display: 'inline-block',
    ':before': {
      content: '""',
      display: 'block',
      width: `${knobBorderSize}px`,
      height: `${knobBorderHeight}px`,
      position: 'absolute',
      bottom: '-2px',
      background: '#1a1a1a',
    },
  },
  knob: {
    width: `${knobSize}px`,
    height: `${knobSize}px`,
    borderRadius: '50%',
    background: '#0d0d0d',
    position: 'relative',
    margin: '5px auto 0',
    overflow: 'hidden',
  },
  current: {
    width: `${currentWidth}px`,
    height: `${currentHieght}px`,
    background: '#333',
    position: 'absolute',
    top: `${currentTop}px`,
  },
})
