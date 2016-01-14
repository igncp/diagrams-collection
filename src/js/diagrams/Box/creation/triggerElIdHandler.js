let triggerElId

const handler = {
  get: () => triggerElId,
  increase() {
    triggerElId += 1
  },
  reset() {
    triggerElId = 0
  },
}

export default handler
