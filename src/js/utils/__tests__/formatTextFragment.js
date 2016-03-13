import formatTextFragment from "../formatTextFragment"

describeStd(__filename, () => {
  it("Formats the text as expected. (bbb980)", () => {
    const init = "::DIAGRAMS-EDITED::A{diagrams-classed-div}1diagrams-box-ado"
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

    const expected = `A<div class="diagrams-box-ado"><div class="diagrams-box-ado-`
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

    const actual = formatTextFragment(init)

    expect(actual).to.equal(expected)
  })

  it("Formats the text as expected. (6faa5e)", () => {
    const init = "foo"
    const expected = "foo"
    const actual = formatTextFragment(init)

    expect(actual).to.equal(expected)
  })

  it("Formats the text as expected. (20a965)", () => {
    const init = "foo"
    const expected = "foo"
    const actual = formatTextFragment(init)

    expect(actual).to.equal(expected)
  })

  it("Formats the text as expected. (9562cd)", () => {
    const init = "<p>Foo</p>"
    const expected = "<p>Foo</p>"
    const actual = formatTextFragment(init)

    expect(actual).to.equal(expected)
  })

  it("Formats the text as expected. (bf390a)", () => {
    const init = "<h1>Foo</h1>"
    const expected = "&lt;h1&gt;Foo&lt;/h1&gt;"
    const actual = formatTextFragment(init)

    expect(actual).to.equal(expected)
  })
})
