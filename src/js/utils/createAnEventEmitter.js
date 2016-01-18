import composeWithEventEmitter from "./composeWithEventEmitter"

export default () => {
  const constructor = function EventEmitter() {}

  composeWithEventEmitter(constructor)

  return new constructor()
}
