import { url } from "../../common/helpers"

export default {
  "Demo test Google"(client) {
    client
      .url(`${url}/box/basic`)
      .waitForElementVisible('body', 1000)

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

    client.end()
  },
}
