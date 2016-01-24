import formatTextFragment from "../formatTextFragment"

describe("formatTextFragment", () => {
  it("formats the text as expected", () => {
    const text = "::DIAGRAMS-EDITED::A{diagrams-classed-div}1diagrams-box-ado"
      + "{:diagrams-classed-div}"
      + "1{diagrams-classed-div}2diagrams-box-ado-section{:diagrams-classed-div}2{diagrams"
      + "-classed-div}3diagrams-box-ado-section-header{:diagrams-classed-div}3Advantages{:"
      + ":diagrams-classed-div}3:{diagrams-classed-div}3diagrams-box-ado-row{:diagrams-cla"
      + "ssed-div}3  - f{::diagrams-classed-div}3{diagrams-classed-div}3diagrams-box-ado-r"
      + "ow{:diagrams-classed-div}3  - o{::diagrams-classed-div}3{diagrams-classed-div}3di"
      + "agrams-box-ado-row{:diagrams-classed-div}3  - o{::diagrams-classed-div}3{::diagra"
      + "ms-classed-div}2{diagrams-classed-div}2diagrams-box-ado-section{:diagrams-classed"
      + "-div}2{diagrams-classed-div}3diagrams-box-ado-section-header{:diagrams-classed-di"
      + "v}3Drawbacks{::diagrams-classed-div}3:{diagrams-classed-div}3diagrams-box-ado-row"
      + "{:diagrams-classed-div}3  - b{::diagrams-classed-div}3{diagrams-classed-div}3diag"
      + "rams-box-ado-row{:diagrams-classed-div}3  - a{::diagrams-classed-div}3{diagrams-c"
      + "lassed-div}3diagrams-box-ado-row{:diagrams-classed-div}3  - r{::diagrams-classed-"
      + "div}3{::diagrams-classed-div}2{diagrams-classed-div}2diagrams-box-ado-section{:di"
      + "agrams-classed-div}2{diagrams-classed-div}3diagrams-box-ado-section-header{:diagr"
      + "ams-classed-div}3Other{::diagrams-classed-div}3:{diagrams-classed-div}3diagrams-b"
      + "ox-ado-row{:diagrams-classed-div}3  - b{::diagrams-classed-div}3{diagrams-classed"
      + "-div}3diagrams-box-ado-row{:diagrams-classed-div}3  - a{::diagrams-classed-div}3{"
      + "diagrams-classed-div}3diagrams-box-ado-row{:diagrams-classed-div}3  - z{::diagram"
      + "s-classed-div}3{::diagrams-classed-div}2{::diagrams-classed-div}1"

    const expectedResult = `A<div class="diagrams-box-ado"><div class="diagrams-box-ado-`
      + `section"><div class="diagrams-box-ado-section-header">Advantages</div`
      + `>:<div class="diagrams-box-ado-row">  - f</div><div class="diagrams-b`
      + `ox-ado-row">  - o</div><div class="diagrams-box-ado-row">  - o</div><`
      + `/div><div class="diagrams-box-ado-section"><div class="diagrams-box-a`
      + `do-section-header">Drawbacks</div>:<div class="diagrams-box-ado-row">`
      + `  - b</div><div class="diagrams-box-ado-row">  - a</div><div class="d`
      + `iagrams-box-ado-row">  - r</div></div><div class="diagrams-box-ado-se`
      + `ction"><div class="diagrams-box-ado-section-header">Other</div>:<div `
      + `class="diagrams-box-ado-row">  - b</div><div class="diagrams-box-ado-`
      + `row">  - a</div><div class="diagrams-box-ado-row">  - z</div></div></`
      + `div>`

    const result = formatTextFragment(text)

    expect(result).to.equal(expectedResult)
  })
})
