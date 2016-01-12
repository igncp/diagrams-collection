import doWithMinIdAndMaxIdOfLinkNodes from './doWithMinIdAndMaxIdOfLinkNodes'
import linksNumberMapHandler from './linksNumberMapHandler'

export default (link) => {
  return doWithMinIdAndMaxIdOfLinkNodes(link, (minIndex, maxIndex) => {
    return linksNumberMapHandler().get()[minIndex][maxIndex]
  })
}
