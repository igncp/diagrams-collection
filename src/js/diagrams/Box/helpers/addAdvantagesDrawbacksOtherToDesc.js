import { forEach } from "ramda"

import d from "diagrams"

const tokens = d.utils.getClassedDivTokens()
const { lvl1Tkns, lvl2Tkns, lvl3Tkns } = tokens

const formatSection = (sectionHeader, sectionContent) => {

  let section = `${lvl2Tkns.firstToken}diagrams-box-ado-section`
    + `${lvl2Tkns.secondToken}${lvl3Tkns.firstToken}diagrams-box-ado-section-header`
    + `${lvl3Tkns.secondToken}${sectionHeader}${lvl3Tkns.thirdToken}:`

  forEach((sectionContentRow) => {
    section += `${lvl3Tkns.firstToken}diagrams-box-ado-row${lvl3Tkns.secondToken}`
      + `  - ${sectionContentRow}${lvl3Tkns.thirdToken}`
  })(sectionContent)

  section += `${lvl2Tkns.thirdToken}`

  return section
}

const aADO = (description, ADO) => {
  let finalDescription = description

  finalDescription += `${lvl1Tkns.firstToken}diagrams-box-ado${lvl1Tkns.secondToken}`
  finalDescription += formatSection('Advantages', ADO[0])
  finalDescription += formatSection('Drawbacks', ADO[1])
  finalDescription += formatSection('Other', ADO[2])
  finalDescription += lvl1Tkns.thirdToken

  return finalDescription
}

export default aADO
