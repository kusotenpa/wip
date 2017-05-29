import { h, Component } from 'preact'
import { css } from 'aphrodite'
import isEqual from 'lodash/isEqual'

import Canvas from './Canvas'
import s from './style'

export default class Preview extends Component {

  constructor() {
    super()

    this.setState({ isActive: false })
    this._onMidiMessage = ::this._onMidiMessage
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !isEqual(nextProps, this.props) || !isEqual(nextState, this.state)
  }

  componentDidMount() {
    const {
      emitter,
    } = this.props

    emitter.on('pad', this._onMidiMessage)
  }

  render() {
    const {
      sketch,
    } = this.props

    const {
      isActive,
    } = this.state

    return (
      <div className={css(s.canvas, isActive && s.active)}>
        <Canvas sketch={sketch} />
      </div>
    )
  }

  _onMidiMessage(data) {
    const {
      note,
    } = this.props

    const {
      padNum: midiNote,
      velocity,
      isUp,
    } = data

    if (note !== midiNote || isUp) return

    this.setState({ isActive: !!velocity })
  }
}
