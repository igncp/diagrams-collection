import { isArray, map } from "lodash"

const getSetValFn = ({ changedProp, changedVal, connection }) => {
  return (singleConnection) => {
    singleConnection[changedProp] = changedVal

    return connection
  }
}

export default (baseFn, changedProp, changedVal) => {
  return (...args) => {
    const connection = baseFn(...args)
    const setVal = getSetValFn({ changedProp, changedVal, connection })

    return (isArray(connection)) ? map(connection, setVal) : setVal(connection)
  }
}
