const { isNumber, max, min } = _

export default (link, cb) => {
  const getIndex = (item) => {
    return (isNumber(item)) ? item : item.index
  }
  const ids = [getIndex(link.source), getIndex(link.target)]
  const minIndex = min(ids)
  const maxIndex = max(ids)

  return cb(minIndex, maxIndex)
}
