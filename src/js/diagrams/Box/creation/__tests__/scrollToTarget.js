import scrollToTarget from "../scrollToTarget"

const { mockReplacing } = testsHelpers

const windowMock = {
  pageYOffset: 0,
  scrollTo: spy(),
}

const getBoundingClientRectStub = stub().returns({ top: null })
const textGMock = [[{ getBoundingClientRect: getBoundingClientRectStub }]]

const documentMock = {
  documentElement: {
    clientTop: 0,
    scrollTop: 0,
  },
}
const setTimeoutMock = (fn) => fn()

describeStd(__filename, () => {
  beforeEach(function() {
    this.restoreFn = mockReplacing(this, [
      [global, "window", windowMock],
      [global, "document", documentMock],
      [global, "setTimeout", setTimeoutMock],
    ])
  })
  afterEach(function() {
    this.restoreFn()
    windowMock.scrollTo.reset()
    getBoundingClientRectStub.reset()
  })
  it("Doesn't call scrollTo if the target does not match any text", () => {
    const target = "foo"
    const conf = {
      body: [{ text: "bar" }],
    }

    scrollToTarget(target, conf)
    expect(windowMock.scrollTo).to.not.have.been.called
  })

  it("Calls scrollTo if the target matches a text", () => {
    const target = "bar"
    const conf = {
      body: [{ text: "bar", textG: textGMock }],
    }

    scrollToTarget(target, conf)
    expect(windowMock.scrollTo).to.have.been.calledOnce
  })
})
