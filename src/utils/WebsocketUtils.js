
export function messageHasData(message) {
  return message.data;
}

export function messageHasResponse(message) {
  return message.hasOwnProperty("response");
}

export function messageStatusOk(message) {
  return messageHasResponse(message) && message.response.hasOwnProperty("status") && message.response.status === 0;
}

export function isCommandResponse(message, command) {
  return message.hasOwnProperty("cmd") && message.cmd === command;
}

export function messageHasMetadata(message) {
  return message.hasOwnProperty("include.metadata") && message["include.metadata"] === "true";
}

export function isModuleMessage(data) {
  return data.hasOwnProperty("module");
}

export function getMatchingResponseObject(data, pobject, key, key_value, missingValue) {
  let d = data;
  for (const f of pobject.split(".")) {
    if (d.hasOwnProperty(f)) {
      d = d[f];
    } else {
      return missingValue || {};
    }
  }
  if (Array.isArray(d)) {
    for (const i of d) {
      if (i.hasOwnProperty(key) && i[key] === key_value) {
        return i;
      }
    }
  } else {
    if (d.hasOwnProperty(key) && d[key] === key_value) {
      return d;
    }
  }
  return missingValue;
}