import doWithMinIdAndMaxIdOfLinkNodes from './doWithMinIdAndMaxIdOfLinkNodes'
import linksNumberMapHandler from './linksNumberMapHandler'

const { isUndefined } = _

export default (link) => {
  doWithMinIdAndMaxIdOfLinkNodes(link, (minIndex, maxIndex) => {
    const linksNumberMap = linksNumberMapHandler().get()

    if (isUndefined(linksNumberMap[minIndex])) linksNumberMap[minIndex] = {}

    if (isUndefined(linksNumberMap[minIndex][maxIndex])) {
      linksNumberMap[minIndex][maxIndex] = 1
    } else linksNumberMap[minIndex][maxIndex] += 1
  })
}
