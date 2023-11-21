import React from "react";
import {deviceDetect} from "react-device-detect";
import {nanoid} from "nanoid";

export const UserContext = React.createContext({debug: false, user: {}});

export const UUID = (renew) => {
  if (renew) {
    localStorage.removeItem("uuid");
  }
  let uuid = localStorage.getItem("uuid");
  if (uuid === null) {
    uuid = `${deviceDetect()["browserName"].toLowerCase()}-${nanoid()}`;
    localStorage.setItem("uuid", uuid);
    console.log("App.constructor creating uuid:", uuid);
  } else {
    console.log("App.constructor reusing uuid:", uuid);
  }

  return uuid;
}

export const ConsoleLog = (module, func, ...messages) => {
  console.log(`${module}.${func}`, ...messages);
}