const { isArray, map } = _

export default (baseFn, changedProp, changedVal) => {
  return () => {
    const connection = baseFn(...arguments)
    const setVal = (singleConnection) => {
      singleConnection[changedProp] = changedVal

      return connection
    }

    return (isArray(connection)) ? map(connection, setVal) : setVal(connection)
  }
}
