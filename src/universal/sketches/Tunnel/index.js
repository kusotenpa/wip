const THREE = require('three')

import BaseSketch from '../BaseSketch'
import NoiseMaterial from '../util/NoiseMaterial'

export default class Square extends BaseSketch {

  percentage = 0

  constructor(options) {
    super(options)
  }

  setup() {
    // this.addAxisHelper()
    // this.canRender = true
    this._createTunnel()
  }

  // initGUI() {
  //   const _this = this
  //   const folder = this.gui.addFolder('Tunnel')
  //   const controls = this.controls = new function() {
  //     this.rx = _this.uniforms.rx.value
  //     this.ry = _this.uniforms.ry.value
  //     this.rz = _this.uniforms.rz.value
  //     this.gx = _this.uniforms.gx.value
  //     this.gy = _this.uniforms.gy.value
  //     this.gz = _this.uniforms.gz.value
  //     this.bx = _this.uniforms.bx.value
  //     this.by = _this.uniforms.by.value
  //     this.bz = _this.uniforms.bz.value
  //     this.brightness = 0.1
  //     this.isNegative = false
  //     this.isHalf = false
  //   }
  //
  //   folder.add(controls, 'rx', 0.0, 200).onChange(v => this.uniforms.rx.value = v)
  //   folder.add(controls, 'ry', 0.0, 200).onChange(v => this.uniforms.ry.value = v)
  //   folder.add(controls, 'rz', 0.0, 200).onChange(v => this.uniforms.rz.value = v)
  //   folder.add(controls, 'gx', 0.0, 200).onChange(v => this.uniforms.gx.value = v)
  //   folder.add(controls, 'gy', 0.0, 200).onChange(v => this.uniforms.gy.value = v)
  //   folder.add(controls, 'gz', 0.0, 200).onChange(v => this.uniforms.gz.value = v)
  //   folder.add(controls, 'bx', 0.0, 200).onChange(v => this.uniforms.bx.value = v)
  //   folder.add(controls, 'by', 0.0, 200).onChange(v => this.uniforms.by.value = v)
  //   folder.add(controls, 'bz', 0.0, 200).onChange(v => this.uniforms.bz.value = v)
  //   folder.add(controls, 'brightness', -1, 1).step(0.1).onChange(v => this.uniforms.brightness.value = v)
  //   folder.add(controls, 'isNegative').onChange(v => this.uniforms.isNegative.value = v)
  //   folder.add(controls, 'isHalf').onChange(v => this.uniforms.isHalf.value = v)
  //   // folder.open()
  // }

  _createTunnel() {
    const points = [
      [ 135.3, 252.6 ],
      [ 174.7, 138.3 ],
      [ 330.9, 94.9 ],
      [ 497.9, 26.6 ],
      [ 620, 29.8 ],
      [ 770.3, 47.6 ],
      [ 820.5, 108.5 ],
      [ 928, 108.5 ],
      [ 947.6, 257.4 ],
      [ 877.5, 310.8 ],
      [ 831.4, 408.5 ],
      [ 672.5, 467.8 ],
      [ 621.4, 510.8 ],
      [ 468, 535.2 ],
      [ 345.4, 543.4 ],
      [ 277.5, 527.1 ],
      [ 122.8, 537 ],
      [ 46.7, 547 ],
      [ 28.2, 460.6 ],
      [ 74.3, 367.8 ],
      [ 129.5, 271 ],
    ]

    points.forEach((p, i) => {
      const x = p[ 0 ]
      const y = (Math.random() * -0.5) * 20
      const z = p[ 1 ]
      points[ i ] = new THREE.Vector3(x, y, z)
    })

    const path = this.path = new THREE.CatmullRomCurve3(points)
    const geo = this.geo = new THREE.TubeGeometry(path, 1000, 10, 3, true)
    const mat = this.mat = new NoiseMaterial()
    mat.side = THREE.BackSide

    const x = 300
    const y = 0
    const z = 150
    mat.uniforms.rx.value = x
    mat.uniforms.ry.value = y
    mat.uniforms.rz.value = z
    mat.uniforms.gx.value = x
    mat.uniforms.gy.value = y
    mat.uniforms.gz.value = z
    mat.uniforms.bx.value = x
    mat.uniforms.by.value = y
    mat.uniforms.bz.value = z
    mat.uniforms.brightness.value = -.4
    mat.uniforms.isHalf.value = true
    mat.uniforms.opacity.value = this.knob1
    this.uniforms = mat.uniforms
    const mesh = new THREE.Mesh(geo, mat)
    this.scene.add(mesh)
  }

  _updateUniforms(time) {
    const value = this.knob0
    this.uniforms.time.value = time / 10000
    this.uniforms.rz.value = value * 150
    this.uniforms.gz.value = value * 150
    this.uniforms.bz.value = value * 150
    this.uniforms.opacity.value = this.knob1
  }

  _updateCamera() {
    this.percentage += 0.001
    const p1 = this.path.getPointAt(this.percentage % 1)
    const p2 = this.path.getPointAt((this.percentage + 0.02) % 1)
    this.camera.position.set(p1.x, p1.y, p1.z)
    this.camera.lookAt(p2)
  }

  _flash() {
    if (Math.random() > .99) {
      this.mat.wireframe = true
      this.uniforms.isNegative.value = true
      this.scene.background = new THREE.Color(0xffffff)
    } else {
      this.mat.wireframe = false
      this.uniforms.isNegative.value = false
      this.scene.background = new THREE.Color(0x000000)
    }
  }

  render(time) {
    this._updateUniforms(time)
    this._updateCamera()
    this._flash()
    this.renderer.render(this.scene, this.camera)
  }

}
