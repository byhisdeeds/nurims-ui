import React from "react";

export const UserDebugContext = React.createContext({debug: false, user: {}});

export const ConsoleLog = (module, func, ...messages) => {
  console.log(`${module}.${func}`, ...messages);
}