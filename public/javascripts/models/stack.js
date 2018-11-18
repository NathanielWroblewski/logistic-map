class Stack {
  constructor (attrs = {}) {
    this.stack = attrs.stack || []
    this._on = {}
  }

  push (state) {
    this.stack.push(state)

    this.trigger('change')
  }

  pop () {
    this.stack.pop()

    this.trigger('change')
  }

  peek () {
    return this.stack[this.stack.length - 1]
  }

  size () {
    return this.stack.length
  }

  on (event, callback) {
    this._on[event] = callback
  }

  trigger (event) {
    const callback = this._on[event]

    if (callback) {
      callback(this.peek())
    }
  }
}

export default Stack
