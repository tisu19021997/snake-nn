/**
 * Find the intersection point of two lines
 * 
 * @param {p5.Vector|Object} a1 - First point of line 1
 * @param {p5.Vector|Object} b1 - Second point of line 1
 * @param {p5.Vector|Object} a2 - First point of line 2
 * @param {p5.Vector|Object} b2 - Second point of line 2
 */
function findLinesIntersectionPoint(a1, b1, a2, b2) {
  const {
    x: x1,
    y: y1
  } = a1;
  const {
    x: x2,
    y: y2
  } = b1;
  const {
    x: x3,
    y: y3
  } = a2;
  const {
    x: x4,
    y: y4
  } = b2;

  const denominator = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);

  if (denominator === 0) {
    return false;
  }

  const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denominator;
  const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / denominator;

  if (t > 0 && t < 1 && u > 0) {
    const intersectionPointX = x1 + t * (x2 - x1);
    const intersectionPointY = y1 + t * (y2 - y1);

    return createVector(intersectionPointX, intersectionPointY);
  }

  return false;
}

function isPointOnLine(targetPoint, pointA, pointB) {
  const {
    x: xTarget,
    y: yTarget
  } = targetPoint;

  const {
    x: xA,
    y: yA
  } = pointA;

  const {
    x: xB,
    y: yB
  } = pointB;

  const slope = (yA - yB) / (xA - xB);
  const intercept = yA - slope * xA;

  return slope * xTarget + intercept === yTarget;
}