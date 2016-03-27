import calculateLayerWithChildrenDimensions from "../calculateLayerWithChildrenDimensions"

const diagram = { maxUnityWidth: 100 }

describeStd(__filename, () => {
  it("The layer must have items and they must have dimensions.", () => {
    const layerA = { items: [] }
    const layerB = { items: [{}] }
    const layerC = { items: [{ height: 1, width: 2 }] }

    expect(() => calculateLayerWithChildrenDimensions(diagram, layerA)).to.throw(Error)
    expect(() => calculateLayerWithChildrenDimensions(diagram, layerB)).to.throw(Error)
    expect(() => calculateLayerWithChildrenDimensions(diagram, layerC)).not.to.throw(Error)
  })

  it("Mutates the layer using its direct children dimensions. (040439)", () => {
    const layer = { items: [{ height: 2, width: 2 }] }

    calculateLayerWithChildrenDimensions(diagram, layer)

    expect(layer.height).to.eql(3)
    expect(layer.width).to.eql(2)
  })

  it("Mutates the layer using its direct children dimensions. (302bb6)", () => {
    const layer = { items: [{ height: 3, width: 70 }, { height: 2, width: 70 }] }

    calculateLayerWithChildrenDimensions(diagram, layer)

    expect(layer.height).to.eql(6)
    expect(layer.width).to.eql(70)
  })
})
