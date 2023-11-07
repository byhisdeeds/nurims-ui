import {convertHtmlToReact} from "@hedgedoc/html-to-react";

const HIGHLIGHT_DEFN = {

}

export function highlight(text) {
  const regex = RegExp(/\[(.*?)\]/,'g')
  // const result = text.replace(regex, function (m) {
  //   return '<div style={"color": "#ff0000">' + m + '</div>'
  // });
  // console.log("]]]]", result)


  const _text = text.replace(regex, (m, $1) => {
    console.log("+++", m, m[0], m[1],  $1)
    return <div style={{"color": "#ff0000"}}> + $1 + </div>
  });

  console.log("====_text", _text)

  const indexPairs = [];
  let matchArr = regex.exec(text);
  while (matchArr) {
    indexPairs.push({start: matchArr.index, end: regex.lastIndex, text: matchArr[0]});
    matchArr = regex.exec(text);
  }

  console.log("INDEX-PAIRS", indexPairs); // output: [9, 12], [19, 22], [29, 32]
  const __text = [];
  if (indexPairs.length > 0) {
    // let start = indexPairs[0][0];
    let end = indexPairs[0][0];
    for (const pair of indexPairs) {
      console.log("---------->", pair)
      if (pair.start > end) {
        console.log("PUSHING => ", text.substring(end, pair.start))
        __text.push(text.substring(end, pair.start));
      }
      console.log("PUSHING => ", "opening div");
      // __text.concat(<div style="{color: 'green'}">);
      __text.push(`<div class="hl-editor token-timestamp">${pair.text}</div>`);
      console.log('PUSHING => ', 'closing div>')
      // __text.concat(</div>);
      end = pair.end;
    }
    if (indexPairs.length > 0) {
      __text.push(text.substr(end));
    }
    // convertHtmlToReact(html)
  }
  console.log("************", __text.join(""))

  // return _text
  return convertHtmlToReact(__text.join(""));
}