import { expect } from "chai"

global.expect = expect
global.localStorage = {}
const store = {}
const ls = global.localStorage

ls.getItem = function (key) {
  return store[key]
}
ls.set = function (key, value) {
  return store[key] = `${value}`
}

require("main")

const testsContext = require
  .context(`${__dirname}/../src/js/`, true, /__tests__\/.*\.js$/)

testsContext.keys().forEach(testsContext)
