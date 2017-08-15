import { h, Component } from 'preact'
import io from 'socket.io-client'
import isEqual from 'lodash/isEqual'
import throttle from 'lodash/throttle'
import { css } from 'aphrodite'
import mitt from 'mitt'

import Midi from './partial/Midi'
import Knob from './partial/Knob'
import Screen from '../Screen'
import Preview from './partial/Preview'
import sketches from '../../sketches'
import s from './style'

const SCREEN_BASE_SIZE = 45
const KNOB_COUNT = new Array(8).fill()

export default class Controller extends Component {

  screenWidth = 16 * SCREEN_BASE_SIZE
  screenHeight = 10 * SCREEN_BASE_SIZE
  emitter = mitt()

  constructor() {
    super()
    this._throttleUpdate = throttle(this._throttleUpdate, 300)
    this.setState({ sketches })
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !isEqual(nextState, this.state)
  }

  componentDidMount() {
    this.socket = io('/controller', { transports: [ 'websocket' ] })
    this.midi = new Midi(::this.onMidiMessage)
  }

  render() {
    const previews = this._buildPreviews()
    const knobs0 = this._buildKnobs(0)
    const knobs1 = this._buildKnobs(1)

    return (
      <div className={css(s.controller)}>
        <div className={css(s.viewer)}>
          <Screen width={this.screenWidth} height={this.screenHeight} isController={true} />
          <div className={css(s.knobWrapper)}>
            <div className={css(s.knob0)}>{knobs0}</div>
            <div>{knobs1}</div>
          </div>
        </div>
        <div className={css(s.previewsWrapper)}>
          {previews}
        </div>
      </div>
    )
  }

  _buildPreviews() {
    return this.state.sketches.map((sketch, i) => {
      return <Preview key={`preview${i}`} sketch={sketch} note={i} emitter={this.emitter} />
    })
  }

  _buildKnobs(row) {
    return KNOB_COUNT.map((_, i) => {
      return <Knob key={`knob${row}${i}`} emitter={this.emitter} row={row} note={i} />
    })
  }

  onMidiMessage(data) {
    data.isPad
      ? this.update(data)
      : this._throttleUpdate(data)
  }

  update(data) {
    this.socket.emit('midi', data)
    this.emitter.emit('pad', data)
  }

  _throttleUpdate(data) {
    this.socket.emit('midi', data)
    this.emitter.emit('knob', data)
  }
}
