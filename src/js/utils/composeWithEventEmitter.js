import { Subject } from "rx"

export default (constructor) => {
  let _subjects = {}
  const createName = name => `$${name}`
  const dispose = (prop) => {
    if ({}.hasOwnProperty.call(_subjects, prop)) {
      _subjects[prop].dispose()
      _subjects[prop] = null
    }
  }

  constructor.prototype.emit = function(name, data) {
    const fnName = createName(name)

    _subjects[fnName] = _subjects[fnName] || new Subject()
    _subjects[fnName].onNext(data)
  }

  constructor.prototype.listen = function(name, handler) {
    const fnName = createName(name)

    _subjects[fnName] = _subjects[fnName] || new Subject()

    return _subjects[fnName].subscribe(handler)
  }

  constructor.prototype.unlisten = function(name) {
    const fnName = createName(name)

    dispose(fnName)
  }

  constructor.prototype.dispose = function() {
    for (const prop in _subjects) dispose(prop)

    _subjects = {}
  }
}
