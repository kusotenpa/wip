let ctx

export default class Analyser {

  node = null
  times = null
  spectrums = null
  sampleRate = null

  constructor(options) {
    ctx = require('./ctx')
    const {
      fftSize = 2048,
    } = options || {}
    const node = this.node = ctx.createAnalyser()

    node.fftSize = fftSize
    this.setSmoothingTimeConstant(.5)
    this.times = new Uint8Array(node.fftSize)
    this.spectrums = new Uint8Array(node.frequencyBinCount)
    this.sampleRate = ctx.sampleRate
  }

  update() {
    this.node.getByteTimeDomainData(this.times)
    this.node.getByteFrequencyData(this.spectrums)
  }

  setSmoothingTimeConstant(value) {
    this.node.smoothingTimeConstant = value
  }

  get() {
    return {
      times: this.times,
      spectrums: this.spectrums,
    }
  }
}
