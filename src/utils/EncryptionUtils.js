import {JSEncrypt} from "jsencrypt";

export function encryptText(pubKey, text) {
  const jsEncrypt = new JSEncrypt();
  jsEncrypt.setPublicKey(pubKey);
  return jsEncrypt.encrypt(text);
}