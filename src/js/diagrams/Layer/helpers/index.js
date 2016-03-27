import { merge, reduce } from "ramda"

import _getMethodsWithCode from "./_getMethodsWithCode"

import Grid from "./Grid"
import calculateLayerWithChildrenDimensions from "./calculateLayerWithChildrenDimensions"
import connectWithOpt from "./connectWithOpt"
import connectWithOptAndIdOpt from "./connectWithOptAndIdOpt"
import dataFromGeneralToSpecific from "./dataFromGeneralToSpecific"
import dataFromSpecificToGeneral from "./dataFromSpecificToGeneral"
import extendOpts from "./extendOpts"
import generateLayersData from "./generateLayersData"
import getConfigHandler from "./getConfigHandler"
import getFinalLayerDimensions from "./getFinalLayerDimensions"
import getStaticOptsLetters from "./getStaticOptsLetters"
import handleConnectedToNextCaseIfNecessary from "./handleConnectedToNextCaseIfNecessary"
import idOpt from "./idOpt"
import idsHandler from "./idsHandler"
import newLayer from "./newLayer"
import newLayerConnectedToNext from "./newLayerConnectedToNext"
import shouldItemsOfLayerBeSorted from "./shouldItemsOfLayerBeSorted"

const fileHelpers = {
  Grid,
  calculateLayerWithChildrenDimensions,
  connectWithOpt,
  connectWithOptAndIdOpt,
  dataFromGeneralToSpecific,
  dataFromSpecificToGeneral,
  extendOpts,
  generateLayersData,
  getConfigHandler,
  getFinalLayerDimensions,
  getStaticOptsLetters,
  handleConnectedToNextCaseIfNecessary,
  idOpt,
  idsHandler,
  newLayer,
  newLayerConnectedToNext,
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
