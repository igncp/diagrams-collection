export default (generalData) => {
  const finalData = d.utils.dataFromGeneralToSpecificForATreeStructureType(generalData)

  finalData.name = finalData.text
  finalData.body = finalData.items

  delete finalData.items
  delete finalData.text

  return finalData
}
