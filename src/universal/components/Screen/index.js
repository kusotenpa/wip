import { h, Component } from 'preact'
import io from 'socket.io-client'
import mitt from 'mitt'
import { css } from 'aphrodite'
const THREE = require('three')

import sketches from '../../sketches'
import s from './style'
import config from '../../config'

const MAX_BPM = 200

export default class Screen extends Component {

  _sketches = null

  emitter = mitt()

  constructor() {
    super()
    this._fullScreen = this._fullScreen.bind(this)
  }

  shouldComponentUpdate() {
    return false
  }

  componentDidMount() {
    const {
      isController = false,
    } = this.props

    !isController && config.useGui && this._initDatGUI()
    this._initSocket()
    this._initRenderer()
    this._initSketches()
    isController && this.updateAngle()
    !isController && this._setEvents()
    requestAnimationFrame(::this._renderSketch)
  }

  _initDatGUI() {
    const dat = require('dat-gui')
    this.gui = new dat.GUI()
    this.gui.domElement.style.float = 'left'
  }

  _initSocket() {
    const socket = io('/', { transports: [ 'websocket' ] })
    socket.on('tidal', data => this._onReceiveTidal(data))
    socket.on('midi', data => this._onReceiveMidi(data))
  }

  _initRenderer() {
    const {
      width = window.innerWidth,
      height = window.innerHeight,
    } = this.props
    const renderer = this.renderer = new THREE.WebGLRenderer({
      canvas: this._c,
      antialias: true,
    })
    renderer.setPixelRatio(1)
    renderer.autoClear = false
    renderer.setSize(width, height)
  }

  _initSketches() {
    const {
      isController = false,
    } = this.props

    const options = {
      canResize: !isController,
      gui: this.gui,
      emitter: this.emitter,
      camera: {
        useOrbitControls: !isController,
      },
      renderer: this.renderer,
    }
    this._sketches = sketches.map(Sketch => new Sketch(options))
  }

  render() {
    return (
      <div>
        <div onClick={this._fullScreen} className={css(s.fullscreen)}>fullscreen</div>
        <canvas ref={c => this._c = c} />
      </div>
    )
  }

  _renderSketch(time) {
    this.renderer.clear()
    this._sketches.forEach(sketch => sketch.canRender ? sketch.render(time) : null)
    requestAnimationFrame(::this._renderSketch)
  }

  _onReceiveTidal(data) {
    const {
      message: name,
    } = data

    this.emitter.emit('tidal', { name })
  }

  _onReceiveMidi(data) {
    const {
      padNum,
      velocity,
      isPad,
      isKnob0,
      isKnob1,
      isArrow,
      isUp,
    } = data
    const target = this._sketches[ padNum ]

    if (isPad) {
      if (isUp) {
        this.emitter.emit('midi:pad', { padNum, velocity })
      } else if (target) {
        target.canRender = !!velocity
      }
    } else if (isKnob0) {
      if (target) {
        target.knob0 = velocity
      } else if (!target && padNum === 7) {
        this._sketches.forEach(sketch => sketch.bpm = velocity * MAX_BPM)
      }
    } else if (isKnob1 && target) {
      target.knob1 = velocity
    } else if (isArrow) {
      this.emitter.emit('midi:arrow', { isUp })
    }
  }

  _setEvents() {
    window.addEventListener('resize', () => this._onWindowResize())
  }

  _onWindowResize() {
    this.renderer.setSize(window.innerWidth, window.innerHeight)
  }

  _fullScreen() {
    this._c.webkitRequestFullScreen()
  }

  updateAngle() {
    const {
      width = window.innerWidth,
      height = window.innerHeight,
    } = this.props

    this._sketches.forEach(sketch => sketch.updateAngle(width, height))
  }
}
