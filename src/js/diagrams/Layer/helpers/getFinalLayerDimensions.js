import getConfigHandler from './getConfigHandler'

export default (layer) => {
  const config = getConfigHandler().get()
  const height = layer.height * config.heightSize - config.depthHeightFactor * layer.depth * 2
  const width = layer.width * config.widthSize - config.depthWidthFactor * layer.depth * 2
  const transform = `translate(${config.depthWidthFactor * layer.depth},`
    + `${config.depthHeightFactor * layer.depth})`
  const fill = `url(#color-${String(layer.depth - 1)})`
  const dimensions = { fill, height, transform, width }


  if (config.showNumbersAll === true || (layer.containerData
    && layer.containerData.showNumbers === true)) {
    dimensions.numberTransform = `translate(`
      + `${String(width - 15 + config.depthWidthFactor * layer.depth)},`
      + `${String(config.depthHeightFactor * layer.depth + height + 0)})`
  }

  return dimensions
}
