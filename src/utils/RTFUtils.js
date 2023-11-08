
export function plainText2RichText(paragraphs, content) {
  paragraphs.length = 0;
  // split on newline
  const lines = content.split("\n");
  for (const line of lines) {
    paragraphs.push({
      type: "paragraph",
      children: [
        {
          text: line,
        }
      ]
    })
  }
}
