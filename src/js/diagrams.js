// This is the object exposed by the library.
// Each new diagram factory is attached as a property later.

import utils from "./utils/index"
import events from "./events"
import shared from "./shared"
import svg from "./svg"
import { Diagram } from "./diagram"

export default {
  Diagram, events, shared,
  svg, utils,
}
