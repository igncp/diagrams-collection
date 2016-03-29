import getFinalLayerDimensions from "../getFinalLayerDimensions"
import getConfigHandler from "../getConfigHandler"

describeStd(__filename, () => {
  it("Returns the expected values. (f4ac86)", () => {
    const config = getConfigHandler().get()
    const layer = { depth: 2, height: 1, width: 1 }
    const height = layer.height * config.heightSize - config.depthHeightFactor * layer.depth * 2
    const width = layer.width * config.widthSize - config.depthWidthFactor * layer.depth * 2
    const transform = `translate(${config.depthWidthFactor * layer.depth},`
      + `${config.depthHeightFactor * layer.depth})`
    const fill = `url(#color-${layer.depth - 1})`
    const expected = { fill, height, transform, width }
    const actual = getFinalLayerDimensions(layer)

    expect(actual).to.eql(expected)
  })

  it("Returns the expected values. (284a00)", () => {
    const config = getConfigHandler().get()
    const layer = { containerData: { showNumbers: true }, depth: 2, height: 1, width: 2 }
    const width = layer.width * config.widthSize - config.depthWidthFactor * layer.depth * 2
    const height = layer.height * config.heightSize - config.depthHeightFactor * layer.depth * 2
    const expected = `translate(`
      + `${String(width - 15 + config.depthWidthFactor * layer.depth)},`
      + `${String(config.depthHeightFactor * layer.depth + height + 0)})`
    const actual = getFinalLayerDimensions(layer).numberTransform

    expect(actual).to.eql(expected)
  })

  it("Returns the expected values. (c724c5)", () => {
    const config = getConfigHandler().get()

    config.showNumbersAll = true
    const layer = { depth: 2, height: 1, width: 2 }
    const width = layer.width * config.widthSize - config.depthWidthFactor * layer.depth * 2
    const height = layer.height * config.heightSize - config.depthHeightFactor * layer.depth * 2
    const expected = `translate(`
      + `${String(width - 15 + config.depthWidthFactor * layer.depth)},`
      + `${String(config.depthHeightFactor * layer.depth + height + 0)})`
    const actual = getFinalLayerDimensions(layer).numberTransform

    getConfigHandler().setDefault()

    expect(actual).to.eql(expected)
  })
})
