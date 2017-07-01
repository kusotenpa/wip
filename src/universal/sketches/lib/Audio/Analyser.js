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
    node.smoothingTimeConstant = 0.5
    this.times = new Uint8Array(node.fftSize)
    this.spectrums = new Uint8Array(node.frequencyBinCount)
    this.sampleRate = ctx.sampleRate
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
