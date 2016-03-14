import d from "diagrams"
import includeBuiltinDiagrams from "./includeBuiltinDiagrams"

includeBuiltinDiagrams()

if (window) {
  window.diagrams = d
} else {
  module.exports = d
}
