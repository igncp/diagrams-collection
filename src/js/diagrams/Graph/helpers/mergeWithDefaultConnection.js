import { defaults } from "lodash"

export default (connection) => {
  const defaultConnection = {
    direction: 'out',
    line: 'plain',
    symbol: 'arrow',
  }

  return defaults(connection, defaultConnection)
}
