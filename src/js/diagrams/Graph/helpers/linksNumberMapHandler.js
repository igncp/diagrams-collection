let linksNumberMap = {}

const handler = {
  get: () => linksNumberMap,
  reset: () => linksNumberMap = {},
}

export default () => handler
