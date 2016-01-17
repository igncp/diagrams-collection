import { each, isObject, isString, keys } from "lodash"

const shared = {
  get(key) {
    shared.throwIfSharedMethodAlreadyExists(key)

    return shared[key]
  },

  getWithStartingBreakLine: () => `<br>${shared.get(...arguments)}`,

  set(data) {
    shared.throwIfSharedMethodAlreadyExists(data)

    for (const prop in data) {
      if (data.hasOwnProperty(prop)) shared[prop] = data[prop]
    }
  },

  throwIfSharedMethodAlreadyExists(data) {
    let sharedKeys

    if (isObject(data)) {
      sharedKeys = Object.keys(data)
      each(sharedKeys, shared.throwIfSharedMethodAlreadyExists)
    } else if (isString(data)) {
      if (shared[methodsVarName].indexOf(data) > 0) throw new Error(`Reserved keyword: ${data}`)
    }
  },
}

const methodsVarName = 'builtInMethods'

shared[methodsVarName] = keys(shared).concat(methodsVarName)

export default shared
