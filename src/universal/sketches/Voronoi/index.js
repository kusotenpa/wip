const THREE = require('three')

import BaseSketch from '../BaseSketch'
import vs from './glsl/vs'
import fs from './glsl/fs'

export default class Voronoi extends BaseSketch {

  constructor(options) {
    super(options)
  }

  setup() {
    this.addAxisHelper()
    // this.canRender = true
    this.camera.position.set(0, 0, 100)
    this.camera.lookAt(this.scene.position)
    this._createTexture()
  }

  _createTexture() {
    const uniforms = this.uniforms = {
      time: { value: 0 },
      resolution: { value: new THREE.Vector2(this.width, this.height) },
    }
    const geo = new THREE.PlaneBufferGeometry(2, 2)
    const mat = new THREE.RawShaderMaterial({
      uniforms,
      vertexShader: vs,
      fragmentShader: fs,
      transparent: true,
    })
    const mesh = new THREE.Mesh(geo, mat)
    this.scene.add(mesh)
  }

  _updateUniforms(time) {
    this.uniforms.time.value = time / 1000
  }

  onWindowResize() {
    this.uniforms.resolution.value.set(this.width, this.height)
  }

  render(time) {
    this._updateUniforms(time)
    this.renderer.render(this.scene, this.camera)
  }

}
