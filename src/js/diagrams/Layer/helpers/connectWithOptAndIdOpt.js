import { extend } from "lodash"

import d from "diagrams"

export default (ids, id) => {
  const connectWithOpt = d.layer.connectWithOpt(ids)
  const idOpt = d.layer.idOpt(id)

  return extend(connectWithOpt, idOpt)
}
