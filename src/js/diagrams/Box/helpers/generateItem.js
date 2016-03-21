import { merge } from "ramda"

import { defaultOptions } from "../constants"
import parseItemGenerationOptions from './parseItemGenerationOptions'

export default ({ description = null, items = [], options = {}, text }) => {
  const optionsObj = parseItemGenerationOptions(options)

  return merge({
    items,
    options: merge(defaultOptions, optionsObj),
    text,
  }, (description ? { description } : {}))
}
