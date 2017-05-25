const THREE = require('three')

import BaseSketch from '../BaseSketch'

export default class Square extends BaseSketch {

  constructor(options) {
    super(options)
  }

  setup() {
    for (let i = 0; i < 10; i++) {
      const ar = [ 2, 3, 4 ]
      const a = Math.floor(Math.random() * 3)
      const geo = new THREE.SphereGeometry(1, ar[a], ar[a])
      const mat = new THREE.MeshPhongMaterial({
        transparent: true,
        wireframe: false,
        shading: THREE.FlatShading,
      })
      const rock = this.rock = new THREE.Mesh(geo, mat)
      rock.position.set(Math.random() - .5, Math.random() - .5, Math.random() - .5).normalize()
      rock.position.multiplyScalar(50)
      rock.scale.x = rock.scale.y = rock.scale.z = Math.random() * 20
      rock.scale.y = 10
      rock.rotation.set(Math.random() * 2, Math.random() * 2, Math.random() * 2)
      this.scene.add(rock)
    }

    this.scene.add(new THREE.AmbientLight(0x222222))
    const light = new THREE.DirectionalLight(0xffffff)
    light.position.set(1, 1, 1)
    this.scene.add(light)
  }

  // onReceiveTidal(name) {
  //   this.rock.geometry.dynamic = true
  //   this.rock.position.multiplyScalar(Math.random() * 400)
  //   this.rock.scale.x = this.rock.scale.y = this.rock.scale.z = Math.random() * 50
  // }

  render(time) {
    time /= 1000
    this.rock.geometry.dynamic = true
    // this.rock.rotation.y = Math.sin(time)
    this.rock.material.opacity = this.knob1
    this.renderer.render(this.scene, this.camera)
  }

}
