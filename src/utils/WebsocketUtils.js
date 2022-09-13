
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
