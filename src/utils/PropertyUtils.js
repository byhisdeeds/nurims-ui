export function getPropertyValue(properties, key, missingValue) {
  if (Array.isArray(properties)) {
    for (const property of properties) {
      if (property.hasOwnProperty("name") && property.name === key) {
        if (property.hasOwnProperty("value")) {
          return property.value;
        }
      }
    }
  }
  return missingValue;
}


export function setPropertyValue(properties, key, value) {
  if (Array.isArray(properties)) {
    for (const property of properties) {
      console.log("---", property)
      if (property.hasOwnProperty("name") && property.name === key) {
        property["value"] = value;
        return;
      }
    }
    properties.push({
      name: key,
      value: value,
    });
  }
}
