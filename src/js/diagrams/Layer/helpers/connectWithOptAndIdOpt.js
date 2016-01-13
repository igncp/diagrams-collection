import d from "diagrams"

const { extend } = _

export default (ids, id) => {
  const connectWithOpt = d.layer.connectWithOpt(ids)
  const idOpt = d.layer.idOpt(id)

  return extend(connectWithOpt, idOpt)
}
