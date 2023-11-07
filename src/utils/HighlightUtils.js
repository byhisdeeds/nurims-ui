
export function highlight(text) {
  const regex = RegExp(
    /\b\d{4}[-/]\d{2}[-/]\d{2}(?:T(?=\d{1,2}:)|(?=\s\d{1,2}:))/.source +
    '|' +
    /\b\d{1,4}[-/ ](?:\d{1,2}|Apr|Aug|Dec|Feb|Jan|Jul|Jun|Mar|May|Nov|Oct|Sep)[-/ ]\d{2,4}T?\b/
      .source +
    '|' +
    /\b(?:(?:Fri|Mon|Sat|Sun|Thu|Tue|Wed)(?:\s{1,2}(?:Apr|Aug|Dec|Feb|Jan|Jul|Jun|Mar|May|Nov|Oct|Sep))?|Apr|Aug|Dec|Feb|Jan|Jul|Jun|Mar|May|Nov|Oct|Sep)\s{1,2}\d{1,2}\b/
      .source,
    'i'
  )
  const result = text.replace(regex, function (m) {
    return '<div style={"color": "#ff0000">' + m + '</div>'
  });
  console.log("]]]]", result)

  return <div style={{color: "red"}}>{text}</div>
}