import path from "path"
const JS_DIR = path.resolve(path.join(__dirname, "..", "src", "js"))

import mocks from "./mocks"
import helpers from "./helpers"

import { addPath } from "app-module-path"

addPath(JS_DIR)

import { compose, replace } from "ramda"
import chai from "chai"
import { stub, spy } from "sinon"

chai.use(require('sinon-chai'))
global.expect = chai.expect
global.stub = stub
global.spy = spy
global.localStorage = {}
const store = {}
const ls = global.localStorage

ls.getItem = function (key) {
  return store[key]
}
ls.set = function (key, value) {
  return store[key] = `${value}`
}

const getDescribeText = (filename) => {
  return compose(
    // Can't name index.js to a textfile because of webpack
    replace("index_.js", "index.js"),
    replace(path.sep, ""),
    replace(`__tests__${path.sep}`, ""),
    replace(JS_DIR, "")
  )(filename)
}

global.describeStd = (filename, fn) => {
  describe(getDescribeText(filename), fn)
}

global.testsMocks = mocks
global.testsHelpers = helpers
