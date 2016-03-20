import { concat, compose, flip, reduce } from "ramda"

import { editedDescriptionTokenHandler, getClassedDivTokens } from "../../../utils"

const prependStr = flip(concat)
const { lvl1Tkns, lvl2Tkns, lvl3Tkns } = getClassedDivTokens()
const { getEditedDescriptionToken } = editedDescriptionTokenHandler

const formatSectionRow = (acc, sectionContentRow) => {
  return compose(
    prependStr(`  - ${sectionContentRow}${lvl3Tkns.thirdToken}`),
    prependStr(`${lvl3Tkns.firstToken}diagrams-box-ado-row${lvl3Tkns.secondToken}`)
  )(acc)
}

const formatSection = (sectionHeader, sectionContent) => {
  return compose(
    prependStr(`${lvl2Tkns.thirdToken}`),
    prependStr(reduce(formatSectionRow, "", sectionContent)),
    prependStr(`${lvl3Tkns.secondToken}${sectionHeader}${lvl3Tkns.thirdToken}:`),
    prependStr(`${lvl2Tkns.secondToken}${lvl3Tkns.firstToken}diagrams-box-ado-section-header`),
    prependStr(`${lvl2Tkns.firstToken}diagrams-box-ado-section`)
  )("")
}

const aADO = (description, ADO) => {
  return compose(
    concat(getEditedDescriptionToken()),
    prependStr(lvl1Tkns.thirdToken),
    prependStr(formatSection('Other', ADO[2])),
    prependStr(formatSection('Drawbacks', ADO[1])),
    prependStr(formatSection('Advantages', ADO[0])),
    prependStr(`${lvl1Tkns.firstToken}diagrams-box-ado${lvl1Tkns.secondToken}`)
  )(description)
}

export default aADO
