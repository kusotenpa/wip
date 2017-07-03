let ctx

export default class TrackLoader {

  _tracks = []

  constructor() {
    ctx = require('./ctx')
  }

  async load(tracks, cb) {
    let loadedCount = 0
    this._tracks = tracks
    while (await this._condition(loadedCount)) {
      const buffer = await this._fetch(this._tracks[ loadedCount ])
      cb(buffer)
      loadedCount++
    }
  }

  _condition(loadedCount) {
    return new Promise(done => done(loadedCount < this._tracks.length))
  }

  async _fetch(url) {
    /* eslint-disable no-console */
    const res = await fetch(url).catch(err => console.error(err))
    const buffer = await res.arrayBuffer()
    return ctx.decodeAudioData(buffer).catch(err => console.error(err))
    /* eslint-enable no-console */
  }
}
