const THREE = require('three')

import BaseSketch from '../BaseSketch'
import vs from './glsl/vs'
import fs from './glsl/fs'

export default class Square extends BaseSketch {

  constructor(options) {
    super(options)
  }

  setup() {
    // this.addAxisHelper()
    // this.canRender = true
    this.camera.position.set(0, 0, 200)
    this.camera.lookAt(this.scene.position)
    this._createMetaBall()
  }

  initGUI() {
    const _this = this
    const folder = this.gui.addFolder('MetaBall')
    const controls = this.controls = new function() {
      this.x = _this.uniforms.x.value
      this.y = _this.uniforms.y.value
      this.z = _this.uniforms.z.value
      this.isHalf = _this.uniforms.isHalf.value
      this.isNegative = _this.uniforms.isNegative.value
    }

    folder.add(controls, 'x', 0.0, 200).onChange(v => this.uniforms.x.value = v)
    folder.add(controls, 'y', 0.0, 200).onChange(v => this.uniforms.y.value = v)
    folder.add(controls, 'z', 0.0, 200).onChange(v => this.uniforms.z.value = v)
    folder.add(controls, 'isHalf', 0.0, 200).onChange(v => this.uniforms.isHalf.value = v)
    folder.add(controls, 'isNegative', 0.0, 200).onChange(v => this.uniforms.isNegative.value = v)
    // folder.open()
  }

  _createMetaBall() {
    const sphere = this.sphere = new THREE.SphereBufferGeometry(100, 100, 100)
    const uniforms = this.uniforms = {
      time: { value: 0 },
      x: { value: 0.0 },
      xxx: { value: 1.0 },
      y: { value: 150.0 },
      z: { value: 1.0 },
      isHalf: { value: true },
      isNegative: { value: false },
    }
    const smallUniforms = this.smallUniforms = {
      time: { value: 0 },
      x: { value: 0.0 },
      xxx: { value: 2.0 },
      y: { value: 150.0 },
      z: { value: 10.0 },
      isHalf: { value: true },
      isNegative: { value: false },
    }
    const mat1 = new THREE.RawShaderMaterial({
      uniforms: uniforms,
      vertexShader: vs,
      fragmentShader: fs,
    })
    const mat2 = new THREE.RawShaderMaterial({
      uniforms: smallUniforms,
      vertexShader: vs,
      fragmentShader: fs,
    })
    const mat3 = new THREE.RawShaderMaterial({
      uniforms: smallUniforms,
      vertexShader: vs,
      fragmentShader: fs,
    })

    const mesh = this.mesh = new THREE.Mesh(sphere, mat1)
    mesh.position.y += 2
    this.scene.add(mesh)

    const smallMesh = new THREE.Mesh(sphere, mat2)
    this.smalls = []
    for (let i = 0; i < 50; i++) {
      const copy = smallMesh.clone()
      copy.position
        .set(Math.random() - .5, Math.random() - .5, Math.random() - .5)
        .normalize()
        .multiplyScalar(120)
      copy.scale.set(.2, .2, .2)
      this.scene.add(copy)
      this.smalls.push(copy)
    }

    const bgMesh = new THREE.Mesh(sphere, mat3)
    bgMesh.material.wireframe = true
    bgMesh.scale.set(7, 7, 7)
    this.scene.add(bgMesh)
  }

  _updateUniforms(time) {
    this.uniforms.time.value = time / 1000
    this.smallUniforms.time.value = time / 1000
    this.smallUniforms.isHalf.value = Math.random() > .5
  }

  _updateCamera(time) {
    const t = time / 1000
    this.camera.lookAt({
      x: Math.cos(t) * Math.random() * 10,
      y: Math.sin(t) * Math.random() * 10,
      z: Math.sin(t) * Math.random() * 10,
    })
    if (Math.random() > .95) {
      this.camera.position.set(
        Math.cos(t * .8) * 350,
        Math.sin(t * .8) * 300 + 180,
        Math.sin(t * .8) * 350,
      )
    }
  }

  _changePosition() {
    this.smalls.forEach(mesh => {
      mesh.position
        .set(Math.random() - .5, Math.random() - .5, Math.random() - .5)
        .normalize()
        .multiplyScalar(120)
    })
  }

  render(time) {
    this._updateUniforms(time)
    this._updateCamera(time)
    Math.random() > .9 && this._changePosition()
    this.mesh.rotation.y += 0.02
    this.mesh.position.y += Math.sin(time / 1000) / 3

    this.renderer.render(this.scene, this.camera)
  }

}
