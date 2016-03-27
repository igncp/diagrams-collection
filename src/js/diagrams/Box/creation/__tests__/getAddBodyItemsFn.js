import "../getAddBodyItemsFn"

const { mockReplacing, mockWithMockery, resetAll } = testsHelpers
const { d3ElMock } = testsMocks

const windowMock = {
  scrollTo: spy(),
}
const documentMock = {
  documentElement: {},
}
const diagramMock = {
  emit: spy(),
  setRelationships: spy(),
}
const svgMock = {
  updateHeigthOfElWithOtherEl: spy(),
}

const conf = {}

describeStd(__filename, () => {
  let getAddBodyItemsFn

  beforeEach(function() {
    this.restoreFn = mockReplacing(this, [
      [global, "window", windowMock],
      [global, "document", documentMock],
    ])
    this.resetMockery = mockWithMockery(require.resolve("../getAddBodyItemsFn"), [
      ["../../../svg", svgMock],
    ])
    getAddBodyItemsFn = require("../getAddBodyItemsFn")
  })
  afterEach(function() {
    this.resetMockery()
    this.restoreFn()

    resetAll([
      diagramMock, windowMock, diagramMock,
      svgMock, d3ElMock,
    ])
  })

  it("Returns a function.", () => {
    const addBodyItems = getAddBodyItemsFn({})

    expect(addBodyItems).to.be.a("function")
  })

  describe("addBodyItems", () => {
    beforeEach(function() {
      const addBodyItems = getAddBodyItemsFn({
        boxG: d3ElMock,
        conf,
        diagram: diagramMock,
        svg: d3ElMock,
      })

      addBodyItems()
    })
    it("Emits `item-rendered`.", () => {
      expect(diagramMock.emit).to.have.been.calledWith("items-rendered")
    })

    it("Calls the expected external functions.", () => {
      expect(windowMock.scrollTo).to.have.been.calledOnce
      expect(diagramMock.emit).to.have.been.calledOnce
      expect(svgMock.updateHeigthOfElWithOtherEl).to.have.been.calledTwice
    })
  })
})
