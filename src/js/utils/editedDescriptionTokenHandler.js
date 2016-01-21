const editedDescriptionToken = "::DIAGRAMS-EDITED::"

export default {
  getEditedDescriptionToken: () => editedDescriptionToken,
  removeEditedDescriptionToken: text => text.replace(new RegExp(editedDescriptionToken, "gm"), ""),
  startsWithEditedDescriptionToken(text) {
    return text.substr(0, editedDescriptionToken.length) === editedDescriptionToken
  },
}
