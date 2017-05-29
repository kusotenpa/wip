import { h, Component } from 'preact'
import isEqual from 'lodash/isEqual'
import { css } from 'aphrodite'

import s from './style'

const INITIAL_ROTATE = -40
const MAX_ROTATE = 270

export default class Knob extends Component {

  constructor() {
    super()

    this.setState({ velocity: 0 })
    this._onMidiMessage = ::this._onMidiMessage
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !isEqual(nextProps, this.props) || !isEqual(nextState, this.state)
  }

  componentDidMount() {
    const {
      emitter,
    } = this.props

    emitter.on('knob', this._onMidiMessage)
  }

  render() {
    const {
      velocity,
    } = this.state

    const rotate = INITIAL_ROTATE + velocity * MAX_ROTATE
    const knobStyle = {
      transform: `rotate(${rotate}deg)`,
    }

    return (
      <div className={css(s.knobBorder)}>
        <div className={css(s.knob)} style={knobStyle}>
          <div className={css(s.current)} />
        </div>
      </div>
    )
  }

  _onMidiMessage(data) {
    const {
      row,
      note,
    } = this.props

    const {
      padNum: midiNote,
      velocity,
      isKnob0,
      isKnob1,
    } = data

    if (note !== midiNote) return

    if ((row === 0 && isKnob0) || (row === 1 && isKnob1)) {
      this.setState({ velocity })
    }
  }
}
