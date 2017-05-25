const THREE = require('three')

import BaseSketch from '../BaseSketch'
import vs from './glsl/vs'
import fs from './glsl/fs'

export default class Square extends BaseSketch {

  constructor(options) {
    super(options)
  }

  setup() {
    this.addAxisHelper()
    // this.canRender = true
    this.camera.position.set(0, 0, 100)
    this.camera.lookAt(this.scene.position)
    this._loadTexture(::this._createTexture)
  }

  _loadTexture(cb) {
    const loader = new THREE.TextureLoader()
    const texture = loader.load('./stat/textures/0.jpg', () => {
      cb(texture)
    })
  }

  _createTexture(texture) {
    const uniforms = this.uniforms = {
      resolution: {
        type: 'v2',
        value: new THREE.Vector2(this.width, this.height),
      },
      imageResolution: {
        type:'v2',
        value: new THREE.Vector2(texture.image.width, texture.image.height),
      },
      texture: {
        type: 't',
        value: texture,
      },
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

  onWindowResize() {
    this.uniforms.resolution.value.set(this.width, this.height)
  }

  render(time) {
    this.renderer.render(this.scene, this.camera)
  }

}
