const THREE = require('three')

import BaseSketch from '../BaseSketch'
import vs from './glsl/vs'
import fs from './glsl/fs'

const SIZE = [ 50, 50, 50 ]
export default class Sphere extends BaseSketch {

  constructor(options) {
    super(options)
  }

  setup() {
    this.canRender = true
    this._createSphere()
  }

  _createSphere() {
    // const geo = this.geo =
    const geo = this.geo = new THREE.BufferGeometry()
    this._createGeometry(geo)
    this.uniforms = {
      PI: { value: Math.PI },
      time: { value: 0.0 },
    }
    const mat = new THREE.RawShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: vs,
      fragmentShader: fs,
      blending: THREE.AdditiveBlending,
      transparent: true,
      depthWrite: false,
      // wireframe: true,
    })

    mat.side = THREE.DoubleSide

    const plane = this.plane = new THREE.Mesh(geo, mat)
    this.scene.add(plane)
  }

  _createGeometry(geo) {
    const sphereGeometry = new THREE.SphereGeometry(...SIZE)
    // const sphereGeometry = new THREE.TetrahedronGeometry(50, 6)
    const vertices = []
    const indices = []
    const centroids = []

    sphereGeometry.faces.forEach((vertex, i) => {
      const face = sphereGeometry.faces[ i ]
      const a = sphereGeometry.vertices[ face.a ].clone()
      const b = sphereGeometry.vertices[ face.b ].clone()
      const c = sphereGeometry.vertices[ face.c ].clone()
      const centroid = this._getCentroid(sphereGeometry, face)

      vertices.push(
        a.x, a.y, a.z,
        b.x, b.y, b.z,
        c.x, c.y, c.z
      )
      indices.push(i * 3, i * 3 + 1, i * 3 + 2)
      centroids.push(...centroid, ...centroid, ...centroid)
    })

    geo.addAttribute('position', new THREE.BufferAttribute(new Float32Array(vertices), 3))
    geo.addAttribute('centroid', new THREE.BufferAttribute(new Float32Array(centroids), 3))
    geo.setIndex(new THREE.BufferAttribute(new Uint16Array(indices), 1))
    geo.computeVertexNormals()
  }

  _getCentroid(geo, face) {
    const a = geo.vertices[ face.a ]
    const b = geo.vertices[ face.b ]
    const c = geo.vertices[ face.c ]

    return [
      (a.x + b.x + c.x) / 3,
      (a.y + b.y + c.y) / 3,
      (a.z + b.z + c.z) / 3,
    ]
  }

  render(t, opacity) {
    t = t / 1000
    this.uniforms.time.value = t
    this.camera.lookAt({
      x: Math.cos(t), // * Math.random() * 10,
      y: 0, // * Math.random() * 10,
      z: Math.sin(t), // * Math.random() * 10,
    })
    this.camera.position.set(
      Math.cos(t * .3) * 100,
      0,
      Math.sin(t * .3) * 100,
    )

    this.renderer.render(this.scene, this.camera)
  }

}
