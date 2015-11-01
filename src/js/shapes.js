const shapes = {};

shapes.hexagon = function(opts) {
  var halfHeight = opts.height / 2,
    halfWidth = opts.width / 2,
    gap = opts.widthPercent ? (1 - (opts.widthPercent / 100)) * opts.width : (opts.width - opts.height) / 2,
    result = '',
    center, cx, cy;

  center = opts.center || [halfWidth, halfHeight];
  cx = center[0];
  cy = center[1];

  result += 'M' + (cx - halfWidth) + ',' + cy;
  result += 'L' + (cx - halfWidth + gap) + ',' + (cy + halfHeight);
  result += 'L' + (cx + halfWidth - gap) + ',' + (cy + halfHeight);
  result += 'L' + (cx + halfWidth) + ',' + cy;
  result += 'L' + (cx + halfWidth - gap) + ',' + (cy - halfHeight);
  result += 'L' + (cx - halfWidth + gap) + ',' + (cy - halfHeight);
  result += 'Z';

  return result;
};

export default shapes;
