let ctx

export default class Analyser {

  node = null
  times = null
  spectrums = null

  constructor(options) {
    ctx = require('./ctx')
    const {
      fftSize = 256,
    } = options || {}
    const node = this.node = ctx.createAnalyser()

    node.fftSize = fftSize
    node.smoothingTimeConstant = 0.5
    this.times = new Uint8Array(node.fftSize)
    this.spectrums = new Uint8Array(node.frequencyBinCount)
  }

  update() {
    this.node.getByteTimeDomainData(this.times)
    this.node.getByteFrequencyData(this.spectrums)
  }

  get() {
    return {
      times: this.times,
      spectrums: this.spectrums,
    }
  }
}
