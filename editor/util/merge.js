/**
 * Deeply merges the objects provided as arguments, returning a new object. Properties on objects
 * earlier in the list overwrite properties with the same key on objects later in the list. Note
 * that this ordering is _opposite_ that of Object.assign and lodash.merge. When values from
 * different objects sharing the same key are compared, the values are merged only if both are plain
 * objects. Otherwise the one value overwrites the other. Arrays are therefore not concatenated.
 */
function merge(...objs) {
  const { length } = objs;
  switch (length) {
    case 0: return undefined;
    case 1: return objs[0];
    default: return objs.reduce(mergeTwoValues);
  }
}

function mergeTwoValues(src, dest) {
  if (!isObject(src) || !isObject(dest)) {
    return src;
  }
  const output = Object.assign({}, dest);
  for (const key of Object.keys(src)) {
    output[key] = mergeTwoValues(src[key], dest[key]);
  }
  return output;
}

function isObject(val) {
  return typeof val === 'object' && !Array.isArray(val) && val !== null;
}

module.exports = merge;
