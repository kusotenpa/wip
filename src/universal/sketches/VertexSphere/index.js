const THREE = require('three')

import BaseSketch from '../BaseSketch'
import vs from './glsl/vs'
import fs from './glsl/fs'

const MAX_HZ = 8000

export default class VertexSphere extends BaseSketch {

  constructor(options) {
    super(options)
    // this.addAxisHelper()
  }

  setup() {
    this.canRender = true
    this._createSphere()
    this._createSphere2()
    this.scene.background = new THREE.Color(0x000e3b)
  }

  _createSphere() {
    const geo = this._geo = new THREE.IcosahedronBufferGeometry(30, 4)
    const length = geo.attributes.position.count
    const indices = [ ...Array(length).keys() ]

    geo.addAttribute('freq', new THREE.BufferAttribute(new Float32Array(length).fill(0), 1))
    geo.addAttribute('_index', new THREE.BufferAttribute(new Uint16Array(indices), 1))

    this._uniforms = {
      time: { value: 0 },
      vertexLength: { value: length },
    }

    const mat = new THREE.ShaderMaterial({
      vertexShader: vs,
      fragmentShader: fs,
      uniforms: this._uniforms,
      wireframe: true,
      transparent: true,
      side: THREE.DoubleSide,
      // blending: THREE.SubtractiveBlending,
      blending: THREE.AdditiveBlending,
    })

    const mesh = new THREE.Mesh(geo, mat)
    this.scene.add(mesh)
  }

  _createSphere2() {
    const geo = new THREE.SphereGeometry(10, 60, 60)
    const mat = new THREE.MeshBasicMaterial({
      color: 0x0d8b00,
    })
    const mesh = this._mesh2 = new THREE.Mesh(geo, mat)
    this.scene.add(mesh)
  }

  _updateUniforms(t) {
    this._uniforms.time.value = t
  }

  _updateAttributes() {
    this._geo.attributes.freq.needsUpdate = true
    this.analyser.update()
    const sampleRate = this.analyser.sampleRate
    const data = this.analyser.get()
    const { spectrums } = data
    const range = Math.floor(MAX_HZ * spectrums.length * 2 / sampleRate)

    const freqArray = this._geo.attributes.freq.array
    const increase = Math.ceil(freqArray.length / range)

    for (let i = 0; i < range; i++) {
      if (i === spectrums.length - 1) {
        freqArray.fill(spectrums[ i ], i * increase)
      } else {
        freqArray.fill(spectrums[ i ], i * increase, (i + 1) * increase)
      }
    }

    this._mesh2.scale.set(
      spectrums[ 0 ] / 255 + 1,
      spectrums[ 0 ] / 255 + 1,
      spectrums[ 0 ] / 255 + 1
    )

  }

  _updateCamera(time) {
    const t = time / 1000
    this.camera.lookAt({
      x: Math.cos(t * .7),
      y: 0,
      z: Math.sin(t * .5),
    })

    this.camera.position.set(
      Math.cos(t * .1) * 70 + 60,
      Math.sin(t * .5) * 40 + 70,
      Math.sin(t * .3) * 30 + 50,
    )
  }

  render(time) {
    this._updateUniforms(time)
    this._updateAttributes()
    this._updateCamera(time)
    this.renderer.render(this.scene, this.camera)
  }

}
