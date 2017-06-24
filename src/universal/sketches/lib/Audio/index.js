import TrackLoader from './TrackLoader'
import Analyser from './Analyser'

let ctx

export default class Audio {

  _trackLoader = null
  _tracks = []
  _current = 0
  _watchId = null
  _fadeTime = 3 // seconds
  _playbackStartTime = 0 // seconds
  _nowPlaying = false
  analyser = null

  constructor() {
    ctx = require('./ctx')
    this._trackLoader = new TrackLoader()
    this.analyser = new Analyser()
  }

  async set(sources) {
    await this._trackLoader.load(sources, ::this._setTracks)
  }

  _setTracks(buffer) {
    this._tracks.push({
      buffer,
      src: null,
    })
  }

  play(num = this._current) {
    const { _tracks, _watchId, analyser } = this
    const { buffer } = _tracks[ num ]
    const src = ctx.createBufferSource()
    const gainNode = ctx.createGain()
    const currentTime = ctx.currentTime

    src.buffer = buffer
    this._updateSrc(src)
    src.connect(analyser.node)
    src.connect(gainNode)
    gainNode.connect(ctx.destination)
    this._playbackStartTime = currentTime
    this._nowPlaying = true
    this._setGainVolume(gainNode, buffer)
    !_watchId && this._watch()
    src.start()
  }

  _setGainVolume(gainNode, buffer) {
    const { _fadeTime } = this
    const currentTime = ctx.currentTime
    const { duration } = buffer
    gainNode.gain.setValueAtTime(0, currentTime)
    gainNode.gain.linearRampToValueAtTime(1, currentTime + _fadeTime)
    gainNode.gain.linearRampToValueAtTime(0, currentTime + duration - _fadeTime)
  }

  _updateSrc(_src, num = this._current) {
    this._tracks[ num ].src = _src
  }

  stop() {
    const { src } = this._tracks[ this._current ]

    cancelAnimationFrame(this._watchId)
    src.stop()
    this._playbackStartTime = 0
    this._nowPlaying = false
    this._watchId = null
  }

  _watch() {
    const {
      _tracks,
      _fadeTime,
      _current,
      _playbackStartTime,
      _nowPlaying,
    } = this
    const track = _tracks[ _current ]
    const canStartFading = ctx.currentTime - _playbackStartTime + _fadeTime > track.buffer.duration
    const isEnd = ctx.currentTime - _playbackStartTime > track.buffer.duration
    const hasNext = _tracks.length > _current + 1

    if (_nowPlaying && canStartFading && hasNext) {
      this._current++
      this.play()
    } else if (!hasNext && isEnd) {
      this.stop()
      return
    }

    this.analyser.update()
    this._watchId = requestAnimationFrame(::this._watch)
  }
}
