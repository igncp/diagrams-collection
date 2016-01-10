let fn = null

/**
 * Provides a placeholder to set the refresh function of the diagram
 */
export default {
  get: () => fn,
  set: newFn => fn = newFn,
}
