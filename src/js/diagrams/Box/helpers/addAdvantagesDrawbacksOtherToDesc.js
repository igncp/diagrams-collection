import { forEach } from "ramda"

const formatSection = (sectionHeader, sectionContent) => {
  let section = `<br>${sectionHeader}:`

  forEach((sectionContentRow) => {
    section += `<br>  - ${sectionContentRow}`
  })(sectionContent)

  return section
}

const aADO = (description, ADO) => {
  let finalDescription = description

  finalDescription += formatSection('Advantages', ADO[0])
  finalDescription += formatSection('Drawbacks', ADO[1])
  finalDescription += formatSection('Other', ADO[2])

  return finalDescription
}

export default aADO
