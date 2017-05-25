import { TweenMax, TimelineLite } from 'gsap'
const THREE = require('three')

import BaseSketch from '../BaseSketch'
import NoiseMaterial from '../util/NoiseMaterial'

export default class Square extends BaseSketch {

  constructor(options) {
    super(options)
  }

  setup() {
    // this.addAxisHelper()
    // this.canRender = true
    this.camera.position.set(0, 0, 100)
    this.camera.lookAt(this.scene.position)
    this._createBoxes()

  }

  initGUI() {
    const _this = this
    const folder = this.gui.addFolder('Noise')
    const controls = this.controls = new function() {
      this.rx = _this.uniforms.rx.value
      this.ry = _this.uniforms.ry.value
      this.rz = _this.uniforms.rz.value
      this.gx = _this.uniforms.gx.value
      this.gy = _this.uniforms.gy.value
      this.gz = _this.uniforms.gz.value
      this.bx = _this.uniforms.bx.value
      this.by = _this.uniforms.by.value
      this.bz = _this.uniforms.bz.value
      this.brightness = 0.1
      this.isNegative = false
      this.isHalf = false
    }

    folder.add(controls, 'rx', 0.0, 200).onChange(v => this.uniforms.rx.value = v)
    folder.add(controls, 'ry', 0.0, 200).onChange(v => this.uniforms.ry.value = v)
    folder.add(controls, 'rz', 0.0, 200).onChange(v => this.uniforms.rz.value = v)
    folder.add(controls, 'gx', 0.0, 200).onChange(v => this.uniforms.gx.value = v)
    folder.add(controls, 'gy', 0.0, 200).onChange(v => this.uniforms.gy.value = v)
    folder.add(controls, 'gz', 0.0, 200).onChange(v => this.uniforms.gz.value = v)
    folder.add(controls, 'bx', 0.0, 200).onChange(v => this.uniforms.bx.value = v)
    folder.add(controls, 'by', 0.0, 200).onChange(v => this.uniforms.by.value = v)
    folder.add(controls, 'bz', 0.0, 200).onChange(v => this.uniforms.bz.value = v)
    folder.add(controls, 'brightness', -1, 1).step(0.1).onChange(v => this.uniforms.brightness.value = v)
    folder.add(controls, 'isNegative').onChange(v => this.uniforms.isNegative.value = v)
    folder.add(controls, 'isHalf').onChange(v => this.uniforms.isHalf.value = v)
    // folder.open()
  }

  _getNoiseBox() {
    const geo = new THREE.BoxGeometry(10, 10, 10)
    const noiseMat = new NoiseMaterial()
    const mat = new THREE.MultiMaterial([ noiseMat, noiseMat, noiseMat, noiseMat, noiseMat, noiseMat ])
    const mesh = new THREE.Mesh(geo, mat)
    noiseMat.uniforms.rx.value = 5
    noiseMat.uniforms.ry.value = 0
    noiseMat.uniforms.rz.value = 10
    noiseMat.uniforms.gx.value = 5
    noiseMat.uniforms.gy.value = 0
    noiseMat.uniforms.gz.value = 10
    noiseMat.uniforms.bx.value = 5
    noiseMat.uniforms.by.value = 0
    noiseMat.uniforms.bz.value = 10
    noiseMat.uniforms.brightness.value = -0.4
    noiseMat.uniforms.isHalf.value = true
    this.uniforms = noiseMat.uniforms
    return mesh
  }

  _createBoxes() {
    const mesh = this._getNoiseBox()
    const rowGroup = new THREE.Group()
    const group = this.group = new THREE.Group()
    const boxNum = 14
    const width = mesh.geometry.parameters.width

    for (let i = 0; i < boxNum; i++) {
      const box = mesh.clone()
      box.position.x = i * width
      rowGroup.add(box)
    }

    for (let i = 0; i < boxNum; i++) {
      const row = rowGroup.clone()
      row.position.y = i * width
      group.add(row)
    }

    group.position.x = -boxNum * width / 2 + width / 2
    group.position.y = -boxNum * width / 2 + width / 2
    this.scene.add(group)
  }

  _rotateX(box) {
    if (typeof box.canRotate === 'undefined') {
      box.canRotate = true
    } else if (!box.canRotate) {
      return
    }
    box.canRotate = false

    const rotation = box.rotation
    const { x: _x } = rotation
    const x = _x + Math.ceil(Math.random()) * Math.PI / 2
    TweenMax.to(rotation, .3, { x, onComplete: () => {
      box.canRotate = true
    } })
  }

  _rotateY(box) {
    if (typeof box.canRotate === 'undefined') {
      box.canRotate = true
    } else if (!box.canRotate) {
      return
    }
    box.canRotate = false

    const rotation = box.rotation
    const { y: _y } = rotation
    const y = _y + Math.ceil(Math.random()) * Math.PI / 2
    TweenMax.to(rotation, .3, { y, onComplete: () => {
      box.canRotate = true
    } })
  }

  _updateUniforms(time) {
    this.uniforms.time.value = time / 10000
  }

  render(time) {
    this._updateUniforms(time)
    if (Math.random() > 0.8) {
      if (Math.random() > 0.5) {
        this._rotateX(this.group.children[Math.floor(Math.random() * 14)].children[Math.floor(Math.random() * 14)])
      } else {
        this._rotateY(this.group.children[Math.floor(Math.random() * 14)].children[Math.floor(Math.random() * 14)])
      }
    }
    this.renderer.render(this.scene, this.camera)
  }

}
