import { h, Component } from 'preact'
const THREE = require('three')

import Audio from '../../../../../sketches/lib/Audio'

const BASE_SIZE = 18.75

export default class Preview extends Component {

  width = 16 * BASE_SIZE
  height = 10 * BASE_SIZE
  isPreview = false
  animationId = null

  constructor() {
    super()
    this._onClick = ::this._onClick
  }

  shouldComponentUpdate() {
    return false
  }

  componentDidMount() {
    const {
      sketch: Sketch,
    } = this.props

    const options = {
      canResize: false,
      camera: { useOrbitControls: false },
      analyser: new Audio().analyser,
      renderer: new THREE.WebGLRenderer({ canvas: this._c, antialias: true }),
    }

    const sketch = new Sketch(options)

    sketch.updateAngle(this.width, this.height)
    sketch.render(0)

    this.setState({ sketch })
  }

  render() {
    return <canvas ref={c => this._c = c} onClick={this._onClick} />
  }

  _renderSketch(time) {
    this.state.sketch.render(time)
    this.animationId = requestAnimationFrame(::this._renderSketch)
  }

  _onClick() {
    if (this.isPreview) {
      cancelAnimationFrame(this.animationId)
    } else {
      this.animationId = requestAnimationFrame(::this._renderSketch)
    }
    this.isPreview = !this.isPreview
  }
}
