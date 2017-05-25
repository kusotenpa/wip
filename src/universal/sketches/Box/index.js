import { TweenMax, TimelineLite } from 'gsap'
const THREE = require('three')

import util from '../util'
import GPGPURenderer from '../lib/GPGPURenderer'
import BaseSketch from '../BaseSketch'
import vsParticle from './glsl/particle/vs'
import fsParticle from './glsl/particle/fs'
import fsPosition from './glsl/position/fs'

const PARTICLES_SIDE = 300
const PARTICLE_NUM = PARTICLES_SIDE ** 2

export default class Square extends BaseSketch {

  constructor(options) {
    super(options)
  }

  setup() {
    this.addAxisHelper()
    // this.canRender = true
    this.camera.position.set(0, 0, 100)
    this.camera.lookAt(this.scene.position)
    this._initGPGPURenderer()
    this._createLight()
    this._createWireBox()
    this._createPointsSphere()
    this._createSphere()
  }

  initGUI() {
    const folder = this.gui.addFolder('Box')
    const controls = this.controls = new function() {
      this.wireColor = 0xffffff
      this.lightColor = 0xffffff
    }

    folder.addColor(controls, 'wireColor').onChange(value => {
      this.wireMesh.material.color.setHex(value)
    })
    folder.addColor(controls, 'lightColor')
    // folder.open()
  }

  _createLight() {
    // this.scene.add(new THREE.AmbientLight(0xffffff))
    // const light = this.light = new THREE.PointLight(0xffffff)
    // light.position.set(0, 0, 0)
    // this.scene.add(light)
  }

  _initGPGPURenderer() {
    const gpgpu = this.gpgpu = new GPGPURenderer(THREE, PARTICLES_SIDE, PARTICLES_SIDE, this.renderer)
    const texturePosition = gpgpu.getTexture()

    this._fillTextures(texturePosition)

    const positionVariable = this.positionVariable = gpgpu.addVariable({
      name: 'texturePosition',
      fs: fsPosition,
      texture: texturePosition,
    })

    positionVariable.material.uniforms = {
      resolution: { value: new THREE.Vector2(PARTICLES_SIDE, PARTICLES_SIDE) },
      time: { value: 0.0 },
      rand: { value: 0.0 },
    }

    gpgpu.setVariableDependencies(positionVariable, [ positionVariable ])
    gpgpu.init()
  }

  _fillTextures(texturePosition) {
    const posArray = texturePosition.image.data

    for (let i = 0, length = posArray.length; i < length; i += 4) {
      posArray[ i ] = Math.random() * PARTICLES_SIDE / 10 - PARTICLES_SIDE / 10 / 2
      posArray[ i + 1 ] = Math.random() * PARTICLES_SIDE / 10 - PARTICLES_SIDE / 10 / 2
      posArray[ i + 2 ] = Math.random() * PARTICLES_SIDE / 10 - PARTICLES_SIDE / 10 / 2
      posArray[ i + 3 ] = 0
    }
  }

  _createWireBox() {
    const boxSize = [ 200, 200, 100, 20, 20, 10 ]
    const wireGeo = new THREE.BoxGeometry(...boxSize)
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
    })
    const wireMesh = this.wireMesh = new THREE.Mesh(wireGeo, wireMat)
    wireMesh.rotation.set(Math.PI / 2, 0, 0)
    this.scene.add(wireMesh)
  }

  _createPointsSphere() {
    const geo = this.geo = new THREE.BufferGeometry()
    const positions = new Float32Array(PARTICLE_NUM * 3).fill(0)
    const uvs = util.getUVs(PARTICLE_NUM * 2, PARTICLES_SIDE)
    geo.addAttribute('position', new THREE.BufferAttribute(positions, 3).setDynamic(true))
    geo.addAttribute('uv', new THREE.BufferAttribute(uvs, 2))
    this.particleUniforms = {
      texturePosition: { value: null },
    }

    const mat = new THREE.RawShaderMaterial({
      uniforms: this.particleUniforms,
      vertexShader: vsParticle,
      fragmentShader: fsParticle,
      blending: THREE.AdditiveBlending,
      transparent: true,
      depthWrite: false,
      opacity: .8,
    })

    // const lineMat = this.lineMat = new THREE.LineBasicMaterial({
    //   blending: THREE.AdditiveBlending,
    //   transparent: true,
    //   depthWrite: false,
    //   opacity: .8,
    // })
    //
    // this.lineMesh = new THREE.LineSegments(geo, mat)

    // this.scene.add(this.lineMesh)
    this.scene.add(new THREE.Points(geo, mat))

  }

  _createSphere() {
    const geo = new THREE.SphereGeometry(30, 20, 20)
    const mat = new THREE.MeshBasicMaterial({
      wireframe: true,
    })
    const mesh = this.sphere = new THREE.Mesh(geo, mat)
    this.scene.add(mesh)
  }

  onReceiveTidal() {
    this._rotateBox()
  }

  _rotateBox() {
    const rotation = this.wireMesh.rotation
    const { z: _z } = rotation
    const value = Math.ceil(Math.random() * 2) * Math.PI / 2
    const z = Math.round(Math.random()) ? _z - value : _z + value
    TweenMax.to(rotation, 0.5, { z })
  }

  _updateUniforms(time) {
    this.particleUniforms.texturePosition.value = this.gpgpu.getCurrentRenderTarget(this.positionVariable).texture
    this.positionVariable.material.uniforms.time.value = time / 1000
    this.positionVariable.material.uniforms.rand.value = Math.random() * 100
  }

  render(time) {
    // this.cube.material.opacity = this.knob1
    this._updateUniforms(time)
    this.gpgpu.render()
    this.sphere.rotation.y = time / 100 * Math.PI / 180
    this.renderer.render(this.scene, this.camera)
  }

}
