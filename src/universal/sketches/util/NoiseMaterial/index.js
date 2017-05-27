const THREE = require('three')

import vs from './glsl/vs'
import fs from './glsl/fs'

export default class NoiseMaterial {
  constructor() {
    const uniforms = {
      time: { value: 0.0 },
      rx: { value: Math.random() * 10 },
      ry: { value: Math.random() * 10 },
      rz: { value: Math.random() * 10 },
      gx: { value: Math.random() * 10 },
      gy: { value: Math.random() * 10 },
      gz: { value: Math.random() * 10 },
      bx: { value: Math.random() * 10 },
      by: { value: Math.random() * 10 },
      bz: { value: Math.random() * 10 },
      brightness: { value: 0.0 },
      isNegative: { value: false },
      isHalf: { value: false },
      opacity: { value: 1. },
    }

    return new THREE.RawShaderMaterial({
      uniforms,
      vertexShader: vs,
      fragmentShader: fs,
      transparent: true,
    })
  }
}
