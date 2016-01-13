import _methodsWithCode from "./_methodsWithCode"

import Grid from "./Grid"
import calculateLayerWithChildrenDimensions from "./calculateLayerWithChildrenDimensions"
import connectWithOpt from "./connectWithOpt"
import connectWithOptAndIdOpt from "./connectWithOptAndIdOpt"
import dataFromGeneralToSpecific from "./dataFromGeneralToSpecific"
import dataFromSpecificToGeneral from "./dataFromSpecificToGeneral"
import extendOpts from "./extendOpts"
import generateLayersData from "./generateLayersData"
import getConfig from "./getConfig"
import getFinalLayerDimensions from "./getFinalLayerDimensions"
import getStaticOptsLetters from "./getStaticOptsLetters"
import handleConnectedToNextCaseIfNecessary from "./handleConnectedToNextCaseIfNecessary"
import idOpt from "./idOpt"
import idsHandler from "./idsHandler"
import itemsOfLayerShouldBeSorted from "./itemsOfLayerShouldBeSorted"
import newLayer from "./newLayer"
import newLayerConnectedToNext from "./newLayerConnectedToNext"

const { each } = _

const helpers = {
  Grid,
  calculateLayerWithChildrenDimensions,
  connectWithOpt,
  connectWithOptAndIdOpt,
  dataFromGeneralToSpecific,
  dataFromSpecificToGeneral,
  extendOpts,
  generateLayersData,
  getConfig,
  getFinalLayerDimensions,
  getStaticOptsLetters,
  handleConnectedToNextCaseIfNecessary,
  idOpt,
  idsHandler,
  itemsOfLayerShouldBeSorted,
  newLayer,
  newLayerConnectedToNext,
}

each([
  'newLayer',
  'newLayerConnectedToNext',
], (helpersMethod) => _methodsWithCode(helpers, helpersMethod))

export default helpers
