import getUrlParams from "../getUrlParams"

describeStd(__filename, () => {
  before(function() {
    this.previousWindow = global.window
    global.window = {
      location: {
        search: null,
      },
    }
  })
  after(function() {
    global.window = this.previousWindow
  })

  it("Finds the url params with one param in the query string", () => {
    global.window.location.search = "?foo=bar"
    const expected = {
      foo: "bar",
    }
    const actual = getUrlParams()

    expect(actual).to.eql(expected)
  })

  it("Finds the url params with several params in the query string", () => {
    global.window.location.search = "?foo=bar&baz=bam&a=b"
    const expected = {
      a: "b",
      baz: "bam",
      foo: "bar",
    }
    const actual = getUrlParams()

    expect(actual).to.eql(expected)
  })

  it("Finds the url params with no params in the query string", () => {
    global.window.location.search = ""
    const expected = {}
    const actual = getUrlParams()

    expect(actual).to.eql(expected)
  })

  it("Finds the url params with repeated params. (58525a)", () => {
    global.window.location.search = "?foo=bar&foo=bar"
    const expected = { foo: ["bar", "bar"] }
    const actual = getUrlParams()

    expect(actual).to.eql(expected)
  })

  it("Finds the url params with repeated params. (dc70de)", () => {
    global.window.location.search = "?foo=bar&foo=bar&foo=bar"
    const expected = { foo: ["bar", "bar", "bar"] }
    const actual = getUrlParams()

    expect(actual).to.eql(expected)
  })
})
