import { compose, forEach, keys } from "ramda"

let store

function throwIfSharedMethodAlreadyExists(newKey) {
  if (shared[methodsVarName].indexOf(newKey) > -1) {
    throw new Error(`The key already exists: ${newKey}`)
  }
}

const resetStore = () => store = {}

const shared = {
  get(key) {
    throwIfSharedMethodAlreadyExists(key)

    return store[key]
  },

  getWithStartingBreakLine: (...args) => `<br>${shared.get(...args)}`,

  reset() {
    resetStore()
  },

  set(data) {
    shared.throwIfSharedMethodsAlreadyExists(data)
    for (const prop in data) {
      store[prop] = data[prop]
    }
  },

  throwIfSharedMethodsAlreadyExists(keyValueObj) {
    compose(
      forEach(throwIfSharedMethodAlreadyExists),
      keys
    )(keyValueObj)
  },
}

const methodsVarName = 'builtInMethods'

shared[methodsVarName] = keys(shared).concat(methodsVarName)
resetStore()

export default shared
