import {JSEncrypt} from "jsencrypt";

export function encryptMessage(pubKey, text) {
  const jsEncrypt = new JSEncrypt();
  jsEncrypt.setPublicKey(pubKey);
  return jsEncrypt.encrypt(text);
}

export function isValidMessageSignature(message) {
  return message.hasOwnProperty("cmd") && message.hasOwnProperty("response");
}

export function isModuleMessage(message) {
  return message.hasOwnProperty("module");
}

export function messageHasResponse(message) {
  return message.hasOwnProperty("response");
}

export function messageHasResponseObject(message, responseObject) {
  return message.hasOwnProperty("response") && message.response.hasOwnProperty(responseObject);
}

export function messageResponseStatusOk(message) {
  return messageHasResponse(message) && message.response.hasOwnProperty("status") && message.response.status === 0;
}

export function isCommandResponse(message, command) {
  if (message.hasOwnProperty("cmd")) {
    if (Array.isArray(command)) {
      for (const c of command) {
        if (message.cmd === c) {
          return true;
        }
      }
    } else {
      return message.cmd === command;
    }
  }
  return false;
}

export function messageHasMetadata(message) {
  return message.hasOwnProperty("include.metadata") && message["include.metadata"] === "true";
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

export function getErrorMessage(code) {
  switch (code) {
    case 1005:
      return "(1005) No error specified.";
    case 1001:
      return "(1001) Indicates an endpoint is being removed. Either the server or client will become unavailable.";
    case 1011:
      return "(1011) The connection will be closed by the server because of an error on the server.";
    case 1003:
      return "(1003) The client or server is terminating the connection because it cannot accept the data type it received.";
    case 1007:
      return "(1007) The client or server is terminating the connection because it has received data inconsistent with the message type.";
    case 1010:
      return "(1010) The client is terminating the connection because it expected the server to negotiate an extension.";
    case 1009:
      return "(1009) The client or server is terminating the connection because it has received a message that is too big for it to process.";
    case 1000:
      return "(1000) The connection has closed after the request was fulfilled.";
    case 1008:
      return "(1008) The connection will be closed because an endpoint has received a message that violates its policy.";
    case 1002:
      return "(1002) The client or server is terminating the connection because of a protocol error.";
    default:
      return `(${code}) unknown error code.`;
  }
}