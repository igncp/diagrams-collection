import { curry } from "ramda"
import { url } from "../../common/helpers"

function runBoxDiagramSpecs(client) {
  client.expect.element(".box-diagram").to.be.visible
  client.expect.element(".collapsible-trigger").to.be.visible
  client.expect.element(".diagrams-box-collapse-all-button").to.be.visible
  client.expect.element(".diagrams-box-expand-all-button").to.be.visible
  client.expect.element(".diagrams-box-conversion-button").to.be.visible
  client.elements("css selector", ".diagrams-box-conversion-button", (els) => {
    client.expect(els.value.length).to.equal(2)
  })

  client.expect.element(".box-diagram").text.to.contain("bam")
  client.click(".collapsible-trigger")
  client.expect.element(".box-diagram").text.not.to.contain("bam")
  client.click(".diagrams-box-expand-all-button")
  client.expect.element(".box-diagram").text.to.contain("bam")
  client.click(".diagrams-box-collapse-all-button")
  client.expect.element(".box-diagram").text.not.to.contain("bam")
  client.click(".diagrams-box-expand-all-button")
}

const clickConversionButtonByIndex = curry((index, client) => {
  client.elements("css selector", ".diagrams-box-conversion-button", (els) => {
    client.elementIdClick(els.value[index].ELEMENT)
  })
})

const convertToGraphFromBox = clickConversionButtonByIndex(0)
const convertToLayerFromBox = clickConversionButtonByIndex(1)
const convertToBoxFromLayer = clickConversionButtonByIndex(0)

function runConvertedLayerSpecs(client) {
  client.expect.element(".layers-diagram").to.be.visible
  client.expect.element("#diagrams-layer-g-3").text.to.contain("bam")
}

function runGraphDiagramSpecs() {
  console.log('runGraphDiagramSpecs pending')
}

export default {
  "Demo test Google"(client) {
    client
      .url(`${url}/box/basic`)
      .waitForElementVisible('body', 1000)

    runBoxDiagramSpecs(client)
    convertToLayerFromBox(client)
    runConvertedLayerSpecs(client)
    convertToBoxFromLayer(client)
    runBoxDiagramSpecs(client)
    convertToGraphFromBox(client)
    runGraphDiagramSpecs(client)

    client.end()
  },
}
