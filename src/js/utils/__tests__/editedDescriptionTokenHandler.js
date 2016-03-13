import editedDescriptionTokenHandler from "../editedDescriptionTokenHandler"

describeStd(__filename, () => {
  it("Provides the editedDescriptionToken.", () => {
    const actual = editedDescriptionTokenHandler.getEditedDescriptionToken()

    expect(actual).to.be.a("string")
  })

  it("Removes the Provides the editedDescriptionToken from a text.", () => {
    const editedDescriptionToken = editedDescriptionTokenHandler.getEditedDescriptionToken()

    const init = `foo${editedDescriptionToken}bar`
    const expected = "foobar"
    const actual = editedDescriptionTokenHandler.removeEditedDescriptionToken(init)

    expect(actual).to.eql(expected)
  })

  it("Removes the Provides the editedDescriptionToken from a text. (a0e8bc)", () => {
    const init = "foobaz"
    const expected = "foobaz"
    const actual = editedDescriptionTokenHandler.removeEditedDescriptionToken(init)

    expect(actual).to.eql(expected)
  })

  it("Checks that a string starts with the editedDescriptionToken. (4ab8f9)", () => {
    const editedDescriptionToken = editedDescriptionTokenHandler.getEditedDescriptionToken()

    const init = `${editedDescriptionToken}foobar`
    const expected = true
    const actual = editedDescriptionTokenHandler.startsWithEditedDescriptionToken(init)

    expect(actual).to.eql(expected)
  })

  it("Checks that a string starts with the editedDescriptionToken. (8d5844)", () => {
    const editedDescriptionToken = editedDescriptionTokenHandler.getEditedDescriptionToken()

    const init = `foo${editedDescriptionToken}bar`
    const expected = false
    const actual = editedDescriptionTokenHandler.startsWithEditedDescriptionToken(init)

    expect(actual).to.eql(expected)
  })

  it("Checks that a string starts with the editedDescriptionToken. (8743e4)", () => {
    const init = "foobaz"
    const expected = false
    const actual = editedDescriptionTokenHandler.startsWithEditedDescriptionToken(init)

    expect(actual).to.eql(expected)
  })
})
