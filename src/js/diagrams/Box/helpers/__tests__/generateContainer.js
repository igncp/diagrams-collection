import generateContainer from "../generateContainer"

describeStd(__filename, () => {
  it("Generates the expected item. (9c8662)", () => {
    const init = ["foo", ["bar"]]
    const expected = {
      items: ["bar"],
      options: {
        isLink: false,
        notCompleted: false,
      },
      text: "foo",
    }
    const actual = generateContainer(...init)

    expect(actual).to.eql(expected)
  })

  it("Generates the expected item. (01a4cf)", () => {
    const init = ["foo", "baz", ["bar"]]
    const expected = {
      description: "baz",
      items: ["bar"],
      options: {
        isLink: false,
        notCompleted: false,
      },
      text: "foo",
    }
    const actual = generateContainer(...init)

    expect(actual).to.eql(expected)
  })

  it("Generates the expected item. (08313a)", () => {
    const init = ["foo", "baz"]
    const expected = {
      description: "baz",
      items: [],
      options: {
        isLink: false,
        notCompleted: false,
      },
      text: "foo",
    }
    const actual = generateContainer(...init)

    expect(actual).to.eql(expected)
  })

  it("Generates the expected item. (425d49)", () => {
    const init = ["foo"]
    const expected = {
      items: [],
      options: {
        isLink: false,
        notCompleted: false,
      },
      text: "foo",
    }
    const actual = generateContainer(...init)

    expect(actual).to.eql(expected)
  })
})
