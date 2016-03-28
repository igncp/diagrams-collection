import { merge, reduce } from "ramda"

import _getMethodsWithCode from "./_getMethodsWithCode"

import Grid from "./Grid"
import calculateLayerWithChildrenDimensions from "./calculateLayerWithChildrenDimensions"
import connectWithOpt from "./connectWithOpt"
import dataFromGeneralToSpecific from "./dataFromGeneralToSpecific"
import dataFromSpecificToGeneral from "./dataFromSpecificToGeneral"
import generateLayersData from "./generateLayersData"
import getConfigHandler from "./getConfigHandler"
import getFinalLayerDimensions from "./getFinalLayerDimensions"
import getStaticOptsLetters from "./getStaticOptsLetters"
import handleConnectedToNextCaseIfNecessary from "./handleConnectedToNextCaseIfNecessary"
import idOpt from "./idOpt"
import idsHandler from "./idsHandler"
import newLayer from "./newLayer"
import newLayerConnectedToNext from "./newLayerConnectedToNext"
import parseOptsString from "./parseOptsString"
import shouldItemsOfLayerBeSorted from "./shouldItemsOfLayerBeSorted"

const fileHelpers = {
  Grid,
  calculateLayerWithChildrenDimensions,
  connectWithOpt,
  dataFromGeneralToSpecific,
  dataFromSpecificToGeneral,
  generateLayersData,
  getConfigHandler,
  getFinalLayerDimensions,
  getStaticOptsLetters,
  handleConnectedToNextCaseIfNecessary,
  idOpt,
  idsHandler,
  newLayer,
  newLayerConnectedToNext,
  parseOptsString,
  shouldItemsOfLayerBeSorted,
}

const totalHelpers = reduce((acc, newHelpersMethod) => {
  const newMethods = _getMethodsWithCode(acc, newHelpersMethod)

  return merge(acc, newMethods)
}, fileHelpers, [
  'newLayer',
  'newLayerConnectedToNext',
])

export default totalHelpers
