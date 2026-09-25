export interface MarkdownStats {
  words: number;
  charsWithSpaces: number;
  charsWithoutSpaces: number;
  lines: number;
  paragraphs: number;
  readingTimeMinutes: number;
  headings: {
    h1: number;
    h2: number;
    h3: number;
    total: number;
  };
}

export function calculateMarkdownStats(text: string): MarkdownStats {
  if (!text || text.trim().length === 0) {
    return {
      words: 0,
      charsWithSpaces: 0,
      charsWithoutSpaces: 0,
      lines: 0,
      paragraphs: 0,
      readingTimeMinutes: 0,
      headings: { h1: 0, h2: 0, h3: 0, total: 0 },
    };
  }

  const charsWithSpaces = text.length;
  const charsWithoutSpaces = text.replace(/\s/g, '').length;

  // Words count
  const wordsArray = text
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 0);
  const words = wordsArray.length;

  // Lines count
  const linesArray = text.split('\n');
  const lines = linesArray.length;

  // Paragraphs count (blocks of non-empty text separated by empty lines)
  const paragraphs = text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0).length;

  // Reading time: standard 200 words per minute
  const readingTimeMinutes = Math.max(1, Math.ceil(words / 200));

  // Headings analysis
  let h1 = 0;
  let h2 = 0;
  let h3 = 0;

  for (const line of linesArray) {
    const trimmed = line.trim();
    if (trimmed.startsWith('# ') && !trimmed.startsWith('## ')) h1++;
    else if (trimmed.startsWith('## ') && !trimmed.startsWith('### ')) h2++;
    else if (trimmed.startsWith('### ') && !trimmed.startsWith('#### ')) h3++;
  }

  return {
    words,
    charsWithSpaces,
    charsWithoutSpaces,
    lines,
    paragraphs,
    readingTimeMinutes: words === 0 ? 0 : readingTimeMinutes,
    headings: {
      h1,
      h2,
      h3,
      total: h1 + h2 + h3,
    },
  };
}

/**
 * Inserts markdown syntax around the current selection or at cursor position.
 */
export function insertMarkdownSyntax(
  textarea: HTMLTextAreaElement,
  prefix: string,
  suffix: string = '',
  defaultText: string = 'text'
): { newText: string; newCursorStart: number; newCursorEnd: number } {
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const fullText = textarea.value;
  const selectedText = fullText.substring(start, end);

  let replacement = '';
  let newStart = start;
  let newEnd = end;

  if (selectedText.length > 0) {
    replacement = `${prefix}${selectedText}${suffix}`;
    newStart = start + prefix.length;
    newEnd = newStart + selectedText.length;
  } else {
    replacement = `${prefix}${defaultText}${suffix}`;
    newStart = start + prefix.length;
    newEnd = newStart + defaultText.length;
  }

  const newText =
    fullText.substring(0, start) + replacement + fullText.substring(end);

  return {
    newText,
    newCursorStart: newStart,
    newCursorEnd: newEnd,
  };
}

/**
 * Inserts block syntax (e.g. lists, blockquotes, headers) at line start
 */
export function insertLinePrefix(
  textarea: HTMLTextAreaElement,
  linePrefix: string
): { newText: string; newCursorStart: number; newCursorEnd: number } {
  const start = textarea.selectionStart;
  const fullText = textarea.value;

  // Find start of current line
  const lastNewline = fullText.lastIndexOf('\n', start - 1);
  const lineStart = lastNewline === -1 ? 0 : lastNewline + 1;

  const newText =
    fullText.substring(0, lineStart) +
    linePrefix +
    fullText.substring(lineStart);

  const newCursor = start + linePrefix.length;

  return {
    newText,
    newCursorStart: newCursor,
    newCursorEnd: newCursor,
  };
}

/**
 * Downloads text as a file in browser
 */
export function downloadFile(content: string, filename: string, mimeType: string = 'text/markdown;charset=utf-8') {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename.endsWith('.md') ? filename : `${filename}.md`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}
