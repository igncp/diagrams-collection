import { spy } from "sinon"

const d3ElMock = {
  append: spy(function() {
    return this
  }),
  attr: spy(function() {
    return this
  }),
  on: spy(function() {
    return this
  }),
  select: spy(function() {
    return this
  }),
  text: spy(function() {
    return this
  }),
}

export default {
  d3ElMock,
}
