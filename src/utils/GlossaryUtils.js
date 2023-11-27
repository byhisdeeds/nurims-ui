

export function setGlossaryTerms(glossary, terms) {
  if (Array.isArray(terms)) {
    for (const term of terms) {
      glossary[term.name] = term.value;
    }
  }
}
