import {convertHtmlToReact} from "@hedgedoc/html-to-react";

export const HIGHLIGHT_DEFN = {
  logs: RegExp(/\[(.*?)\]/,'g'),
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

export function highlight(text, regex, classname) {

  return convertHtmlToReact(render_highlight(text, regex, classname))
}