import defaults from '../constants/defaults.js'

class Parameters {
  constructor (attrs = {}) {
    this._on = {}
    this.update(attrs)
  }

  update (attrs = {}) {
    this.x = attrs.x || this.x || defaults.timeseries.x
    this.r = attrs.r || this.r || defaults.timeseries.r

    this.trigger('change')
  }

  on (event, callback) {
    this._on[event] = callback
  }

  trigger (event) {
    const callback = this._on[event]

    if (callback) {
      callback(this)
    }
  }

  toJS () {
    const { x, r } = this

    return { x, r }
  }
}

export default Parameters
