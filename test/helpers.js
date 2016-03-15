import { forEach, keys } from "ramda"

function resetAll(obj) {
  forEach((prop) => {
    if (typeof obj[prop] === "function" && obj[prop].reset) {
      obj[prop].reset()
    }
  })(keys(obj))
}

export default {
  resetAll,
}
