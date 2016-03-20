import aADO from "../addAdvantagesDrawbacksOtherToDesc"

describeStd(__filename, () => {
  it("Returns the expected string.", () => {
    const init = ["foo", ["bar", "baz", "bam"]]
    const expected = "::DIAGRAMS-EDITED::foo{diagrams-classed-div}1diagrams-box-ado{"
      + ":diagrams-classed-div}1{diagrams-classed-div}2diagrams-box-ado-section{:diagr"
      + "ams-classed-div}2{diagrams-classed-div}3diagrams-box-ado-section-header{:diag"
      + "rams-classed-div}3Advantages{::diagrams-classed-div}3:{diagrams-classed-div}3"
      + "diagrams-box-ado-row{:diagrams-classed-div}3  - b{::diagrams-classed-div}3{di"
      + "agrams-classed-div}3diagrams-box-ado-row{:diagrams-classed-div}3  - a{::diagr"
      + "ams-classed-div}3{diagrams-classed-div}3diagrams-box-ado-row{:diagrams-classe"
      + "d-div}3  - r{::diagrams-classed-div}3{::diagrams-classed-div}2{diagrams-class"
      + "ed-div}2diagrams-box-ado-section{:diagrams-classed-div}2{diagrams-classed-div"
      + "}3diagrams-box-ado-section-header{:diagrams-classed-div}3Drawbacks{::diagrams"
      + "-classed-div}3:{diagrams-classed-div}3diagrams-box-ado-row{:diagrams-classed-"
      + "div}3  - b{::diagrams-classed-div}3{diagrams-classed-div}3diagrams-box-ado-ro"
      + "w{:diagrams-classed-div}3  - a{::diagrams-classed-div}3{diagrams-classed-div}"
      + "3diagrams-box-ado-row{:diagrams-classed-div}3  - z{::diagrams-classed-div}3{:"
      + ":diagrams-classed-div}2{diagrams-classed-div}2diagrams-box-ado-section{:diagr"
      + "ams-classed-div}2{diagrams-classed-div}3diagrams-box-ado-section-header{:diag"
      + "rams-classed-div}3Other{::diagrams-classed-div}3:{diagrams-classed-div}3diagr"
      + "ams-box-ado-row{:diagrams-classed-div}3  - b{::diagrams-classed-div}3{diagram"
      + "s-classed-div}3diagrams-box-ado-row{:diagrams-classed-div}3  - a{::diagrams-c"
      + "lassed-div}3{diagrams-classed-div}3diagrams-box-ado-row{:diagrams-classed-div"
      + "}3  - m{::diagrams-classed-div}3{::diagrams-classed-div}2{::diagrams-classed-"
      + "div}1"
    const actual = aADO(...init)

    expect(actual).to.eql(expected)
  })
})
