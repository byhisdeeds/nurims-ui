export function getGlossaryValue(obj, key, missingValue) {
  return obj.hasOwnProperty(key) ? obj[key] : missingValue;
}