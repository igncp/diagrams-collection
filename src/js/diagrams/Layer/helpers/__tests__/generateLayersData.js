import generateLayersData from "../generateLayersData"

const diagram = { maxUnityWidth: 10 }

describeStd(__filename, () => {
  it("Mutates the layers recursively as expected. (161e9a)", () => {
    const layers = []
    const expected = []

    generateLayersData(diagram, layers, 0)
    expect(layers).to.eql(expected)
  })

  it("Mutates the layers recursively as expected. (d46945)", () => {
    const layers = [{ items: [] }]
    const expected = [{
      connectionsAlreadyProcessed: [], depth: 1, height: 1, items: [], width: 1,
    }]

    generateLayersData(diagram, layers, 0)
    expect(layers).to.eql(expected)
  })

  it("Mutates the layers recursively as expected. (001747)", () => {
    const layers = [
      { items: [], text: "foo" },
      { items: [{ items: [], text: "baz" }], text: "bar" },
    ]
    const expected = [
      { connectionsAlreadyProcessed: [], depth: 1, height: 1, items: [], text: "foo", width: 1 },
      {
        connectionsAlreadyProcessed: [], depth: 1, height: 2,
        items: [{
          connectionsAlreadyProcessed: [], depth: 2, height: 1, items: [],
          text: "baz", width: 1, x: 0, y: 0,
        }], text: "bar", width: 1, x: 0, y: 0,
      },
    ]

    generateLayersData(diagram, layers, 0)
    expect(layers).to.eql(expected)
  })

  it("Mutates the layers recursively as expected. (001747)", () => {
    const layers = [
      { items: [
        { items: [], text: "bar" },
        { items: [{ items: [], text: "bam" }], text: "baz" },
      ], text: "foo" },
    ]
    const expected = [
      {
        connectionsAlreadyProcessed: [], depth: 1, height: 4,
        items: [{
          connectionsAlreadyProcessed: [], depth: 2, height: 1, items: [],
          text: "bar", width: 1, x: 0, y: 0,
        }, {
          connectionsAlreadyProcessed: [], depth: 2, height: 2, items: [{
            connectionsAlreadyProcessed: [], depth: 3, height: 1, items: [],
            text: "bam", width: 1, x: 0, y: 0,
          }], text: "baz", width: 1, x: 0, y: 1,
        }], text: "foo", width: 1, x: 0, y: 0,
      },
    ]

    generateLayersData(diagram, layers, 0)
    expect(layers).to.eql(expected)
  })
})

