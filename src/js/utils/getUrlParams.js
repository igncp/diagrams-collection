import { append, assoc, reduce } from "ramda"

export default () => {
  const query = window.location.search.substring(1)
  const pairsStrings = query ? query.split("&") : []

  const urlParams = reduce((tempUrlParams, pairString) => {
    const pair = pairString.split("=")
    const pairKey = pair[0]
    const pairValue = pair[1]
    const previousValue = tempUrlParams[pairKey]

    if (typeof previousValue === "undefined") {
      return assoc(pairKey, decodeURIComponent(pairValue), tempUrlParams)
    } else if (typeof previousValue === "string") {
      const arr = [previousValue, decodeURIComponent(pairValue)]

      return assoc(pairKey, arr, tempUrlParams)
    } else {
      return assoc(
        pairKey, append(decodeURIComponent(pairValue), previousValue), tempUrlParams
      )
    }
  }, {}, pairsStrings)

  return urlParams
}
