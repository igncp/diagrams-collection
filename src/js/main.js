import d from "diagrams"
import includeBuiltInDiagrams from "./includeBuiltInDiagrams"

includeBuiltInDiagrams()

if (window) {
  window.diagrams = d
} else {
  module.exports = d
}
