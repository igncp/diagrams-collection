const shapes = {
  hexagon(opts) {
    const halfHeight = opts.height / 2
    const halfWidth = opts.width / 2
    const gap = opts.widthPercent ?
      (1 - (opts.widthPercent / 100)) * opts.width : (opts.width - opts.height) / 2
    const center = opts.center || [halfWidth, halfHeight]
    const [cx, cy] = center

    return `M${cx - halfWidth},${cy}`
      + `L${cx - halfWidth + gap},${cy + halfHeight}`
      + `L${cx + halfWidth - gap},${cy + halfHeight}`
      + `L${cx + halfWidth},${cy}`
      + `L${cx + halfWidth - gap},${cy - halfHeight}`
      + `L${cx - halfWidth + gap},${cy - halfHeight}`
      + 'Z'
  },
}

export default shapes
