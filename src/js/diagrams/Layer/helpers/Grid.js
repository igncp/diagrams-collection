import { isUndefined } from "lodash"

export default class Grid {
  constructor(fixedWidth) {
    this.position = {
      x: 0,
      y: 0,
    }
    this.width = fixedWidth
    this.cells = []
  }
  addItemAtNewRow(item) {
    let counter = 0

    this.position.x = 0
    while (counter < 1000) {
      this.position.y += 1

      if (this.itemFitsAtCurrentPos(item)) break
      counter++
    }
    this.addItemAtCurrentPos(item)
  }
  addItemAtCurrentPos(item) {
    addItemAtPos(this, item, this.position)
  }
  itemFitsAtCurrentPos(item) {
    return itemFitsAtPos(this, item, this.position)
  }
  movePositionToNextRow() {
    this.position.y++
    this.position.x = 0
    createRowIfNecessary(this, this.position.y)
  }
  getSize() {
    return {
      height: getGridHeight(this),
      width: this.width,
    }
  }
}

function getGridHeight(grid) {
  const rows = grid.cells.length

  if (rows === 0) return 0

  return (lastRowIsEmpty(grid)) ? rows - 1 : rows
}

function addItemAtPos(grid, item, pos) {
  let row

  item.x = pos.x
  item.y = pos.y

  for (let i = 0; i < item.height; i++) {
    createRowIfNecessary(grid, i + pos.y)
    row = grid.cells[i + pos.y]

    for (let j = 0; j < item.width; j++) {
      row[j + pos.x] = true
    }
  }
  updatePosition(grid)
}

function createRowIfNecessary(grid, posY) {
  if (isUndefined(grid.cells[posY])) grid.cells[posY] = []
}

function lastRowIsEmpty(grid) {
  const rows = grid.cells.length

  for (let i = 0; i < grid.width; i++) {
    if (grid.cells[rows - 1][i] === true) return false
  }

  return true
}

function updatePosition(grid) {
  let counter = 0

  while (counter < 1000) {
    grid.position.x += 1

    if (grid.position.x === grid.width) {
      grid.position.x = -1
      grid.position.y += 1
      createRowIfNecessary(grid, grid.position.y)
    } else if (grid.cells[grid.position.y][grid.position.x] !== true) {
      break
    }
    counter++
  }
}

function itemFitsAtPos(grid, item, pos) {
  let row

  for (let i = 0; i < item.height; i++) {
    row = grid.cells[i + pos.y]

    if (isUndefined(row)) return true

    for (let j = 0; j < item.width; j++) {
      if (row[j + pos.x] === true) return false

      if ((j + pos.x + 1) > grid.width) return false
    }
  }

  return true
}
