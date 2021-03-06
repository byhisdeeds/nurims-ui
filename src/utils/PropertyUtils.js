import {NURIMS_AMP_AGEING_MECHANISM} from "./constants";
import MenuItem from "@mui/material/MenuItem";
import React from "react";

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


export function getPropertyAsMenuitems(properties, key) {
  const items = getPropertyValue(properties, key, "").split('|');
  return (
    items.map((item) => {
      const t = item.split(',');
      if (t.length === 2) {
        return (
          <MenuItem value={t[0]}>{t[1]}</MenuItem>
        )
      }
    }))
}
