const KNOB = 176
const PAD_DOWN = 144
const PAD_UP = 128
const ARROW = 176
const KNOB0_NOTES = [ 21, 22, 23, 24, 25, 26, 27, 28 ]
const KNOB1_NOTES = [ 41, 42, 43, 44, 45, 46, 47, 48 ]
const PAD_NOTES = [ 9, 10, 11, 12, 25, 26, 27, 28 ]
const ARROW_NOTES = [ 114, 115, 116, 117 ]
const GREEN = 60
const RED = 15
const YELLOW = 62
const OFF = 0
const MAX_VELOCITY = 127

export default class Midi {

  _outputs = []
  _activePads = []
  _activePadsUp = []
  _isUp = false
  _cb = null

  constructor(cb) {
    this._cb = cb || function() {}

    navigator
      .requestMIDIAccess()
      .then(midi => this._onMIDISuccess(midi))
      .catch(this._errorCallback)
  }

  _errorCallback(err) {
    /* eslint-disable no-console */
    console.error(err)
    /* eslint-enable no-console */
  }

  _onMIDISuccess(midi) {
    /* eslint-disable no-console */
    console.log('Success to get MIDI access')
    /* eslint-enable no-console */

    const inputs = []
    const outputs = this._outputs

    // inputデバイスの配列を作成
    const inputIterator = midi.inputs.values()
    for (const value of inputIterator) {
      inputs.push(value)
    }

    // outputデバイスの配列を作成
    const outputIterator = midi.outputs.values()
    for (const value of outputIterator) {
      outputs.push(value)
    }

    if (inputs.length === 0 || outputs.length === 0) return

    inputs[ 0 ].onmidimessage = e => this._onMidimessage(e)
  }

  _onMidimessage(e) {
    const midi = this._outputs[ 0 ]
    const type = e.data[ 0 ]
    const num = e.data[ 1 ]
    let velocity = e.data[ 2 ]
    let isKnob0 = false
    let isKnob1 = false
    let padNum
    const isKnob = KNOB === type && (KNOB0_NOTES.indexOf(num) !== -1 || KNOB1_NOTES.indexOf(num) !== -1)
    const isPad = (PAD_DOWN === type || PAD_UP === type) && PAD_NOTES.indexOf(num) !== -1
    const isArrow = ARROW === type && ARROW_NOTES.indexOf(num) !== -1

    // パッドを離した時は無視する
    if (!isKnob && velocity === 0) return

    if (isKnob) {
      const knob0Note = KNOB0_NOTES.indexOf(num)
      const knob1Note = KNOB1_NOTES.indexOf(num)
      isKnob0 = knob0Note > -1
      isKnob1 = !isKnob0
      padNum = Math.max(knob0Note, knob1Note)

    } else if (isPad) {
      const color = this._isUp ? YELLOW : GREEN
      let activePads = this._isUp ? this._activePadsUp : this._activePads
      const isActive = activePads.indexOf(num) > -1
      padNum = PAD_NOTES.indexOf(num)

      if (isActive) {
        midi.send([ type, num, OFF ])
        velocity = 0
        activePads = activePads.filter(pad => pad !== num)
        if (this._isUp) {
          this._activePadsUp = activePads
        } else {
          this._activePads = activePads
        }

      } else {
        midi.send([ type, num, color ])
        activePads.push(num)
      }

    } else if (isArrow) {
      if (ARROW_NOTES[ 0 ] === num) {
        if (this._isUp) {
          midi.send([ type, num, OFF ])
          this._activePadsUp.forEach(number => midi.send([ PAD_DOWN, number, OFF ]))
          this._activePads.forEach(number => midi.send([ PAD_DOWN, number, GREEN ]))

        } else {
          midi.send([ type, num, RED ])
          this._activePads.forEach(number => midi.send([ PAD_DOWN, number, OFF ]))
          this._activePadsUp.forEach(number => midi.send([ PAD_DOWN, number, YELLOW ]))

        }

        this._isUp = !this._isUp
      }
    }

    // 0 ~ 1
    velocity = velocity / MAX_VELOCITY

    const data = {
      isKnob0,
      isKnob1,
      isPad,
      isArrow,
      isUp: this._isUp,
      padNum,
      velocity,
    }

    this._cb(data)
  }
}
