const THREE = require('three')

import BaseSketch from '../BaseSketch'
import vs from './glsl/vs'
import fs from './glsl/fs'

export default class LilneSphere extends BaseSketch {

  _isUp = false
  _activePads = []

  constructor(options) {
    super(options)
  }

  setup() {
    this.canRender = true
    this._createSphere()
  }

  // initGUI() {
  //   const _this = this
  //   const folder = this.gui.addFolder('LilneSphere')
  //   const controls = this.controls = new function() {
  //     this.targetVertex = _this.uniforms.targetVertex.value
  //     this.isAddX = _this.uniforms.isAddX.value
  //     this.isAddY = _this.uniforms.isAddY.value
  //     this.isAddZ = _this.uniforms.isAddZ.value
  //     this.isMultiX = _this.uniforms.isMultiX.value
  //     this.isMultiY = _this.uniforms.isMultiY.value
  //     this.isMultiZ = _this.uniforms.isMultiZ.value
  //     this.isDivX = _this.uniforms.isDivX.value
  //     this.isDivY = _this.uniforms.isDivY.value
  //     this.isDivZ = _this.uniforms.isDivZ.value
  //   }
  //
  //   folder.add(controls, 'targetVertex').onChange(v => this.uniforms.targetVertex.value = v)
  //   folder.add(controls, 'isAddX').onChange(v => this.uniforms.isAddX.value = v)
  //   folder.add(controls, 'isAddY').onChange(v => this.uniforms.isAddY.value = v)
  //   folder.add(controls, 'isAddZ').onChange(v => this.uniforms.isAddZ.value = v)
  //   folder.add(controls, 'isMultiX').onChange(v => this.uniforms.isMultiX.value = v)
  //   folder.add(controls, 'isMultiY').onChange(v => this.uniforms.isMultiY.value = v)
  //   folder.add(controls, 'isMultiZ').onChange(v => this.uniforms.isMultiZ.value = v)
  //   folder.add(controls, 'isDivX').onChange(v => this.uniforms.isDivX.value = v)
  //   folder.add(controls, 'isDivY').onChange(v => this.uniforms.isDivY.value = v)
  //   folder.add(controls, 'isDivZ').onChange(v => this.uniforms.isDivZ.value = v)
  //   folder.open()
  // }

  _createSphere() {
    const geo = new THREE.BufferGeometry()
    const vertices = []
    const positions = []
    const r = 50

    for (let x = 0; x < 2000; x++) {
      const rad1 = Math.acos(2 * Math.random() - 1)
      const rad2 = 2 * Math.PI * Math.random()
      const vector = new THREE.Vector3(
        r * Math.sin(rad1) * Math.cos(rad2),
        r * Math.sin(rad1) * Math.sin(rad2),
        r * Math.cos(rad1),
      )
      vector.amount = 0
      vertices.push(vector)
    }

    vertices.forEach(v => {
      vertices.forEach(_v => {
        if (v.distanceTo(_v) < 10 && v.amount < 10 && v !== _v) {
          positions.push(
            v.x, v.y, v.z,
            _v.x, _v.y, _v.z,
          )
          v.amount++
          _v.amount++
        }
      })
    })

    const vertexNumbers = [ ...Array(positions.length / 3).keys() ]

    geo.addAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3))
    geo.addAttribute('vertexNumber', new THREE.BufferAttribute(new Float32Array(vertexNumbers), 1))

    this.uniforms = {
      time: { value: 0 },
      opacity: { value: 1 },
      knob0: { value: this.knob0 },
      targetVertex: { value: 1 },
      isAddX: { value: false },
      isAddY: { value: false },
      isAddZ: { value: false },
      isMultiX: { value: false },
      isMultiY: { value: false },
      isMultiZ: { value: false },
      isDivX: { value: false },
      isDivY: { value: false },
      isDivZ: { value: false },
    }
    const mat = new THREE.RawShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: vs,
      fragmentShader: fs,
      blending: THREE.AdditiveBlending,
      transparent: true,
    })

    const mesh = this.mesh = new THREE.LineSegments(geo, mat)
    this.scene.add(mesh)
  }

  onReceiveMidi(type, data) {
    const action = type.replace('midi:', '')

    switch (action) {
    case 'arrow':
      this._onMidiArrow(data)
      break
    case 'pad':
      this._onMidiPad(data)
      break
    }
  }

  _onMidiArrow(data) {
    this._isUp = data.isUp
  }

  _onMidiPad(data) {
    if (!this._isUp) return
    const {
      padNum,
      velocity,
    } = data

    if (this._activePads.indexOf(padNum) === -1 && velocity) {
      this._activePads.push(padNum)
    } else {
      this._activePads = this._activePads.filter(pad => pad !== padNum)
    }
  }

  _updateUniforms(t) {
    this.uniforms.time.value = t
    this.uniforms.opacity.value = this.knob1
    this.uniforms.knob0.value = this.knob0
    this.uniforms.isAddX.value = true
    this.uniforms.isAddY.value = this._activePads.indexOf(0) !== -1
    this.uniforms.isAddZ.value = this._activePads.indexOf(1) !== -1
    this.uniforms.isMultiX.value = this._activePads.indexOf(2) !== -1
    this.uniforms.isMultiY.value = this._activePads.indexOf(3) !== -1
    this.uniforms.isMultiZ.value = this._activePads.indexOf(4) !== -1
    this.uniforms.isDivX.value = this._activePads.indexOf(5) !== -1
    this.uniforms.isDivY.value = this._activePads.indexOf(6) !== -1
    this.uniforms.isDivZ.value = this._activePads.indexOf(7) !== -1
  }

  _updateCamera(t) {
    this.camera.lookAt({
      x: Math.cos(t * .7),
      y: 0,
      z: Math.sin(t * .5),
    })

    this.camera.position.set(
      Math.cos(t * .2) * 30 + Math.sin(t * .4) + 50,
      Math.sin(t * .2) * 30 + Math.cos(t * .4) + 50,
      Math.sin(t * .2) * 30 + Math.cos(t * .4) + 50,
    )
  }

  render(time) {
    const t = time / 1000
    this._updateUniforms(t)
    this._updateCamera(t)
    this.renderer.render(this.scene, this.camera)
  }

}
