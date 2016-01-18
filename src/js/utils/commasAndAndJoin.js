import _, { partial } from "lodash"
import joinWithLastDifferent from "./joinWithLastDifferent"

export default partial(joinWithLastDifferent, _, ', ', ' and ')
