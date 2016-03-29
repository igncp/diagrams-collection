import { merge } from "ramda"

const defaultConfig = {
  depthHeightFactor: 2,
  depthWidthFactor: 4,
  heightSize: 60,
  showNumbersAll: false,
  widthSize: 350,
}
let config

const handler = {
  get: () => config,
  setDefault: () => config = merge({}, defaultConfig),
}

handler.setDefault()

export default () => handler
