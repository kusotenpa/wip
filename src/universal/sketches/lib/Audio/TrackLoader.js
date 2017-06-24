let ctx

export default class TrackLoader {

  constructor() {
    ctx = require('./ctx')
  }

  async load(sources, cb) {
    await Promise.all(sources.map(async src => {
      const buffer = await this._fetch(src)
      cb(buffer)
    }))
  }

  async _fetch(url) {
    /* eslint-disable no-console */
    const res = await fetch(url).catch(err => console.error(err))
    const buffer = await res.arrayBuffer()
    return ctx.decodeAudioData(buffer).catch(err => console.error(err))
    /* eslint-enable no-console */
  }
}
