import { forEach, keys } from "ramda"
import mockery from "mockery"

function resetAll(obj) {
  forEach((prop) => {
    if (typeof obj[prop] === "function" && obj[prop].reset) {
      obj[prop].reset()
    }
  })(keys(obj))
}

// e.g. (this, [[global, "window", windowMock]])
export function mockReplacing(context, replacementsArr) {
  forEach((replacement) => {
    context[`previous_${replacement[1]}`] = replacement[0][replacement[1]]
    replacement[0][replacement[1]] = replacement[2]
  })(replacementsArr)

  const restoreFn = () => {
    forEach((replacement) => {
      replacement[0][replacement[1]] = context[`previous_${replacement[1]}`]
    })(replacementsArr)
  }

  return restoreFn
}

// e.g. (require.resolve('../index.js'), [["./helpers", helpersMock]])
export function mockWithMockery(resolvedModule, mocksArr) {
  mockery.enable({
    warnOnReplace: false,
    warnOnUnregistered: false,
  })
  const cachedModule = require.cache[resolvedModule]

  delete require.cache[resolvedModule]
  forEach((mock) => {
    mockery.registerMock(mock[0], mock[1])
  })(mocksArr)

  return () => {
    mockery.disable()
    require.cache[resolvedModule] = cachedModule
  }
}

export default {
  mockReplacing,
  mockWithMockery,
  resetAll,
}
