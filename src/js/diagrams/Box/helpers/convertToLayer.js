export default (origConf) => {
  const convertDataToLayers = (items) => {
    _.each(items, (item, index) => {
      if (_.isString(item)) {
        item = items[index] = {
          text: item,
        }
      }

      if (item.description) item.text += `: ${item.description}`

      if (item.items) convertDataToLayers(item.items)
      else item.items = []
    })
  }
  const createLayers = () => {
    const svg = d3.select('svg')

    d3.selectAll('input.diagrams-diagram-button').remove()

    svg.remove()
    d.layer(layersData)
  }
  const layersData = []

  layersData.push({
    items: origConf.body,
    text: origConf.name,
  })
  convertDataToLayers(layersData[0].items)
  createLayers()
}
