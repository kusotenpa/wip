const THREE = require('three')

import BaseSketch from '../BaseSketch'
import vs from './glsl/vs'
import fs from './glsl/fs'

export default class LilneSphere extends BaseSketch {

  constructor(options) {
    super(options)
  }

  setup() {
    this.canRender = true
    this._createSphere()
  }

  initGUI() {
    const _this = this
    const folder = this.gui.addFolder('LilneSphere')
    const controls = this.controls = new function() {
      this.targetVertex = _this.uniforms.targetVertex.value
      this.isAddX = _this.uniforms.isAddX.value
      this.isAddY = _this.uniforms.isAddY.value
      this.isAddZ = _this.uniforms.isAddZ.value
      this.isMultiX = _this.uniforms.isMultiX.value
      this.isMultiY = _this.uniforms.isMultiY.value
      this.isMultiZ = _this.uniforms.isMultiZ.value
      this.isDivX = _this.uniforms.isDivX.value
      this.isDivY = _this.uniforms.isDivY.value
      this.isDivZ = _this.uniforms.isDivZ.value
    }

    folder.add(controls, 'targetVertex').onChange(v => this.uniforms.targetVertex.value = v)
    folder.add(controls, 'isAddX').onChange(v => this.uniforms.isAddX.value = v)
    folder.add(controls, 'isAddY').onChange(v => this.uniforms.isAddY.value = v)
    folder.add(controls, 'isAddZ').onChange(v => this.uniforms.isAddZ.value = v)
    folder.add(controls, 'isMultiX').onChange(v => this.uniforms.isMultiX.value = v)
    folder.add(controls, 'isMultiY').onChange(v => this.uniforms.isMultiY.value = v)
    folder.add(controls, 'isMultiZ').onChange(v => this.uniforms.isMultiZ.value = v)
    folder.add(controls, 'isDivX').onChange(v => this.uniforms.isDivX.value = v)
    folder.add(controls, 'isDivY').onChange(v => this.uniforms.isDivY.value = v)
    folder.add(controls, 'isDivZ').onChange(v => this.uniforms.isDivZ.value = v)
    folder.open()
  }

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

    const mesh = new THREE.LineSegments(geo, mat)
    this.scene.add(mesh)
  }

  render(time) {
    const t = time / 1000
    this.uniforms.time.value = t / 10
    // this.camera.lookAt({
    //   x: Math.cos(t), // * Math.random() * 10,
    //   y: 0, // * Math.random() * 10,
    //   z: Math.sin(t), // * Math.random() * 10,
    // })
    // this.camera.position.set(
    //   Math.cos(t * .3) * 100 + Math.random(),
    //   Math.sin(t * .3) * 100 + Math.random(),
    //   Math.sin(t * .3) * 100,
    // )

    this.renderer.render(this.scene, this.camera)
  }

}
