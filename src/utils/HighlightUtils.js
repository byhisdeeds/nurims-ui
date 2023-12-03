import {convertHtmlToReact} from "@hedgedoc/html-to-react";

export const HIGHLIGHT_DEFN = {
  // logs: RegExp(/\[(.*?)\]/,'g'),
  logs: RegExp(/(\[(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|1[0-9]|2[0-9]|3[0-1]) ([0-5][0-9]):([0-5][0-9]):([0-5][0-9])\])|(\[WARN\])/,'g'),
  files: RegExp(/([\w\d\-.]+\.[a-zA-Z0-9]+)/,'g'),
}

function render_highlight(text, regex, classname) {
  const indexPairs = [];
  let matchArr = regex.exec(text);
  while (matchArr) {
    indexPairs.push({start: matchArr.index, end: regex.lastIndex, text: matchArr[0]});
    matchArr = regex.exec(text);
  }
  let __text = "";
  if (indexPairs.length > 0) {
    let end = 0; //indexPairs[0][0];
    for (const pair of indexPairs) {
      if (pair.start > end) {
        __text += text.substring(end, pair.start);
      }
      __text += `<div class="${classname}">${pair.text}</div>`;
      end = pair.end;
    }
    if (indexPairs.length > 0) {
      __text += text.substr(end);
    }
    return __text;
  }
  return text;
}

function render_highlight_with_warn(text, regex, classname, warn_classname) {
  const indexPairs = [];
  let matchArr = regex.exec(text);
  while (matchArr) {
    indexPairs.push({start: matchArr.index, end: regex.lastIndex, text: matchArr[0]});
    matchArr = regex.exec(text);
  }
  let __text = "";
  if (indexPairs.length > 0) {
    let end = 0; //indexPairs[0][0];
    for (const pair of indexPairs) {
      if (pair.start > end) {
        __text += text.substring(end, pair.start);
      }
      __text += pair.text === "[WARN]" ? `<div class="${warn_classname}">${pair.text}</div>` :
        `<div class="${classname}">${pair.text}</div>`;
      end = pair.end;
    }
    if (indexPairs.length > 0) {
      __text += text.substr(end);
    }
    return __text;
  }
  return text;
}

export function highlight(text, regex, classname) {

  return convertHtmlToReact(render_highlight(text, regex, classname))
}

export function highlight_logs(text) {

  return convertHtmlToReact(render_highlight_with_warn(text, HIGHLIGHT_DEFN.logs,
    "hl-window token-timestamp", "hl-window token-warn"))
}