import runWhenReady from "../runWhenReady"

describeStd(__filename, () => {
  before(function() {
    this.previousDocument = global.document
    this.previousWindow = global.window
  })
  after(function() {
    global.document = this.previousDocument
    global.window = this.previousWindow
  })
  beforeEach(() => {
    global.document = {}
    global.window = {}
  })
  it("Sets onload if readyState is not complete", () => {
    global.document.readyState = "foo"
    const init = spy()

    runWhenReady(init)

    expect(global.window.onload === init).to.be.ok
  })
  it("Runs the function if readyState is complete", () => {
    global.document.readyState = "complete"
    const init = spy()

    runWhenReady(init)

    expect(global.window.onload === init).to.be.falsy
    expect(init).have.been.calledOnce
  })
})
