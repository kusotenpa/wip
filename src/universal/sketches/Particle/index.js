const THREE = require('three')

import util from '../util'
import GPGPURenderer from '../lib/GPGPURenderer'
import BaseSketch from '../BaseSketch'
import vsParticle from './glsl/particle/vs'
import fsParticle from './glsl/particle/fs'
import fsPosition from './glsl/position/fs'
import fsVelocity from './glsl/velocity/fs'

const WIDTH = 1000
const PARTICLE_NUM = WIDTH ** 2

export default class Particle extends BaseSketch {

  constructor(options) {
    super(options)
  }

  setup() {
    // this.addAxisHelper()
    // this.canRender = true
    this.camera.position.set(0, 0, 900)
    this.camera.lookAt(this.scene.position)
    this._initGPGPURenderer()
    this._initParticle()
  }

  // initGUI() {
  //   const _this = this
  //   const folder = this.gui.addFolder('Noise')
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
  //   folder.open()
  // }

  _initGPGPURenderer() {
    const gpgpu = this.gpgpu = new GPGPURenderer(THREE, WIDTH, WIDTH, this.renderer)
    const texturePosition = gpgpu.getTexture()
    const textureVelocity = gpgpu.getTexture()

    this._fillTextures(texturePosition, textureVelocity)

    const positionVariable = this.positionVariable = gpgpu.addVariable({
      name: 'texturePosition',
      fs: fsPosition,
      texture: texturePosition,
    })

    positionVariable.material.uniforms = {
      resolution: { value: new THREE.Vector2(WIDTH, WIDTH) },
      time: { value: 0.0 },
      velocity: { value: 1.0 },
      targetPoint: { value: new THREE.Vector2(-1, -1) },
    }

    const velocityVariable = this.velocityVariable = gpgpu.addVariable({
      name: 'textureVelocity',
      fs: fsVelocity,
      texture: textureVelocity,
    })

    gpgpu.setVariableDependencies(positionVariable, [ positionVariable, velocityVariable ])
    gpgpu.setVariableDependencies(velocityVariable, [ positionVariable, velocityVariable ])
    gpgpu.init()
  }

  _fillTextures(texturePosition, textureVelocity) {
    const posArray = texturePosition.image.data
    const velArray = textureVelocity.image.data

    for (let i = 0, length = posArray.length; i < length; i += 4) {
      posArray[ i ] = Math.random() * WIDTH - WIDTH / 2
      posArray[ i + 1 ] = Math.random() * WIDTH - WIDTH / 2
      posArray[ i + 2 ] = 0
      posArray[ i + 3 ] = 0

      velArray[ i ] = Math.random() * 2 - 1
      velArray[ i + 1 ] = Math.random() * 2 - 1
      velArray[ i + 2 ] = Math.random() * 2 - 1
      velArray[ i + 3 ] = Math.random() * 2 - 1
    }
  }

  _initParticle() {
    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(PARTICLE_NUM * 3).fill(0)
    const uvs = util.getUVs(PARTICLE_NUM * 2, WIDTH)

    geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.addAttribute('uv', new THREE.BufferAttribute(uvs, 2))

    this.particleUniforms = {
      texturePosition: { value: null },
      time: { value: null },
      opacity: { value: 1 },
      cameraConstant: { value: this._getCameraConstant(this.camera) },
    }

    const material = new THREE.ShaderMaterial({
      uniforms: this.particleUniforms,
      vertexShader: vsParticle,
      fragmentShader: fsParticle,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
    material.extensions.drawBuffers = true
    const particles = new THREE.Points(geometry, material)
    particles.matrixAutoUpdate = false
    particles.updateMatrix()

    this.scene.add(particles)
  }

  _getCameraConstant(camera) {
    return this.height / (Math.tan(THREE.Math.DEG2RAD * 0.5 * camera.fov) / camera.zoom)
  }

  _updateUniforms(time) {
    const value = this.knob0 + 0.1
    const targetRange = 500
    const positionUniforms = this.positionVariable.material.uniforms
    // positionUniforms.time.value = time / 1000
    positionUniforms.velocity.value = Math.random() * (100.0 * value - 40 * value)
    positionUniforms.targetPoint.value = new THREE.Vector2(
      Math.random() * targetRange * 2 - targetRange,
      Math.random() * targetRange * 2 - targetRange
    )
    this.particleUniforms.texturePosition.value = this.gpgpu.getCurrentRenderTarget(this.positionVariable).texture
    this.particleUniforms.opacity.value = this.knob1
  }

  render(time) {
    this._updateUniforms(time)
    this.gpgpu.render()
    this.renderer.render(this.scene, this.camera)
  }

}
