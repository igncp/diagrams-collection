import { isArray, map } from "lodash"

const getSetValFn = ({ changedProp, changedVal, connection }) => {
  return (singleConnection) => {
    singleConnection[changedProp] = changedVal

    return connection
  }
}

export default (baseFn, changedProp, changedVal) => {
  return () => {
    const connection = baseFn(...arguments)
    const setVal = getSetValFn({ changedProp, changedVal, connection })

    return (isArray(connection)) ? map(connection, setVal) : setVal(connection)
  }
}
