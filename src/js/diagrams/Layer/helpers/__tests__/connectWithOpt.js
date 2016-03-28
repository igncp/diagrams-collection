import connectWithOpt from "../connectWithOpt"

import { defaultConnectionType } from "../../constants"

describeStd(__filename, () => {
  it("Mutates item adding the expected connectWith option. (c8c1fc)", () => {
    const item = {}

    connectWithOpt(1, item)
    expect(item.connectedTo).to.eql([{
      id: "layer-1-custom",
      type: defaultConnectionType,
    }])
  })

  it("Mutates item adding the expected connectWith option. (f8d960)", () => {
    const item = {}

    connectWithOpt(1, item, "foo")
    expect(item.connectedTo).to.eql([{
      id: "layer-1-custom",
      type: "foo",
    }])
  })

  it("Mutates item adding the expected connectWith option. (9dfdde)", () => {
    const item = {}

    connectWithOpt([1, 2, 3], item)
    expect(item.connectedTo).to.eql([{
      id: "layer-1-custom",
      type: defaultConnectionType,
    }, {
      id: "layer-2-custom",
      type: defaultConnectionType,
    }, {
      id: "layer-3-custom",
      type: defaultConnectionType,
    }])
  })

  it("Mutates item adding the expected connectWith option. (cb92b2)", () => {
    const item = { connectedTo: ["foo"] }

    connectWithOpt(1, item)
    expect(item.connectedTo).to.eql(["foo", {
      id: "layer-1-custom",
      type: defaultConnectionType,
    }])
  })
})
