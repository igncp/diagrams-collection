import { defaults } from "lodash"

import parseItemGenerationOptions from './parseItemGenerationOptions'

const defaultOptions = {
  isLink: false,
  notCompleted: false,
}

export default ({ description = null, items = [], options = {}, text }) => {
  options = parseItemGenerationOptions(options)

  return {
    description,
    items,
    options: defaults(options, defaultOptions),
    text,
  }
}
