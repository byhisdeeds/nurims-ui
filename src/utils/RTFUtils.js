
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

// {
//     type: 'paragraph',
//     children: [
//       { text: 'This is editable ' },
//       { text: 'rich', bold: true },
//       { text: ' text, ' },
//       { text: 'much', italic: true },
//       { text: ' better than a ' },
//       { text: '<textarea>', code: true },
//       { text: '!' },
//     ],
//   },