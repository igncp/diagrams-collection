const editedDescriptionToken = "::DIAGRAMS-EDITED::"

export default {
  getEditedDescriptionToken: () => editedDescriptionToken,
  removeEditedDescriptionToken: (text) => {
    return text ? text.replace(new RegExp(editedDescriptionToken, "gm"), "")
    : text
  },
  startsWithEditedDescriptionToken(text) {
    return text.substr(0, editedDescriptionToken.length) === editedDescriptionToken
  },
}
