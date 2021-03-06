const THREE = require('three')
const OrbitControls = require('three-orbit-controls')(THREE)

import config from '../../config'

export default class BaseSketch {

  width = null
  height = null
  camera = null
  controls = null
  renderer = null
  emitter = null
  scene = null
  gui = null
  analyser = null
  canRender = false
  knob0 = 1
  knob1 = 1
  bpm = 120

  constructor(options = {}) {
    const {
      canResize = true,
      gui,
      emitter,
      analyser,
      renderer = {},
      camera = {},
    } = options

    this.width = window.innerWidth
    this.height = window.innerHeight
    this.gui = gui
    this.emitter = emitter
    this.analyser = analyser
    this.__initRenderer(renderer)
    this.__initScene()
    this.__initCamera(camera)
    gui && config.useGui && this.initGUI()
    canResize && this.__setEvents()
  }

  __initRenderer(renderer) {
    this.renderer = renderer
  }

  __initScene() {
    this.scene = new THREE.Scene()
  }

  __initCamera(options) {
    const {
      fov = 45,
      aspect = this.width / this.height,
      near = 0.01,
      far = 10000,
      x = 100,
      y = 100,
      z = 100,
      useOrthographic = false,
      useOrbitControls = true,
    } = options

    const camera = this.camera = useOrthographic
      ? new THREE.OrthographicCamera()
      : new THREE.PerspectiveCamera()

    camera.fov = fov
    camera.aspect = aspect
    camera.near = near
    camera.far = far
    camera.position.set(x, y, z)
    camera.lookAt(this.scene.position)
    camera.updateProjectionMatrix()

    if (useOrbitControls && config.useOrbitControls) {
      this.controls = new OrbitControls(camera, this.renderer.domElement)
      this.controls.enableZoom = true
    }
  }

  __setEvents() {
    window.addEventListener('resize', () => {
      this.updateAngle()
      this.onWindowResize()
    })
    if (this.emitter) {
      this.emitter.on('*', (type, arg) => {
        type.indexOf('tidal') !== -1 ? this.onReceiveTidal(arg) : null
        type.indexOf('midi:') !== -1 ? this.onReceiveMidi(type, arg) : null
      })
    }
  }

  updateAngle(_w, _h) {
    const w = this.width = _w || window.innerWidth
    const h = this.height = _h || window.innerHeight
    this.camera.aspect = w / h
    this.camera.updateProjectionMatrix()
  }

  addAxisHelper() {
    if (!config.useAxisHelper) return

    this.scene.add(new THREE.AxisHelper(1000))
  }

  initGUI() {}

  setup() {}

  onReceiveTidal() {}

  onReceiveMidi() {}

  onWindowResize() {}

}
