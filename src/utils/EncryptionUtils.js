
export function encryptText(pubKey, text) {
  const jsEncrypt = new window.JSEncrypt();
  jsEncrypt.setPublicKey(pubKey);
  return jsEncrypt.encrypt(text);
}