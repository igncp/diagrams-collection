import boxDiagramFactoryCreator from "../index"

describeStd(__filename, () => {
  it("It is a (factory-creation) function.", () => {
    expect(boxDiagramFactoryCreator).to.be.a("function")
  })
})
