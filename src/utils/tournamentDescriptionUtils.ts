import DOMPurify from 'dompurify';

const BLOCK_ELEMENT_TYPES = ['P', 'LI', 'DIV', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'OL', 'UL'];
const NODE_TYPE_ELEMENT = 1;
const NODE_TYPE_TEXT = 3;

function sanitizeAndParseHtml(html: string): Document {
  const parser = new DOMParser();
  return parser.parseFromString(DOMPurify.sanitize(html), 'text/html');
}

/**
 * Generates a preview HTML string from the provided HTML input, limited to a maximum number of block elements or text nodes.
 *
 * The function parses and sanitizes the input HTML, then iterates over the direct children of the document body.
 * For each child node:
 *   - If it is a block-level element (e.g., P, LI, DIV, H1-H6, OL, UL), its outer HTML is included in the preview.
 *   - If it is a non-empty text node, its text content is included in the preview.
 *   - Other node types or empty text nodes are ignored.
 * The process stops once the specified maximum number of blocks (`maxBlocks`) is reached.
 *
 * @param {string} html - The input HTML string to generate a preview from.
 * @param {number} maxBlocks - The maximum number of block elements or text nodes to include in the preview.
 * @returns {string} A sanitized HTML string containing up to `maxBlocks` block elements or text nodes from the input.
 *                   Returns an empty string if the input is empty or contains no valid blocks.
 */
export function getPreviewHtml(html: string, maxBlocks: number): string {
  if (!html) return '';
  const doc = sanitizeAndParseHtml(html);
  let count = 0;
  let previewHtml = '';
  for (const child of Array.from(doc.body.childNodes)) {
    if (count >= maxBlocks) break;
    if (
      child.nodeType === NODE_TYPE_ELEMENT && // Element node
      BLOCK_ELEMENT_TYPES.includes(child.nodeName)
    ) {
      previewHtml += (child as HTMLElement).outerHTML;
      count++;
    } else if (child.nodeType === NODE_TYPE_TEXT && (child as Text).textContent?.trim()) {
      // Text node
      previewHtml += (child as Text).textContent;
      count++;
    }
  }
  return previewHtml;
}

/**
 * Counts the number of "blocks" in the given HTML string.
 *
 * A "block" is defined as either:
 *   - An element node whose tag name is included in the BLOCK_ELEMENT_TYPES array
 *     (e.g., P, LI, DIV, H1-H6, OL, UL), or
 *   - A non-empty text node (i.e., a text node whose trimmed content is not empty).
 *
 * The function parses the HTML, iterates over the direct children of the <body> element,
 * and increments the count for each qualifying node as described above.
 *
 * @param html - The HTML string to analyze.
 * @returns The number of blocks found in the HTML.
 */
export function countBlocks(html: string): number {
  if (!html) return 0;
  const doc = sanitizeAndParseHtml(html);
  let count = 0;
  for (const child of Array.from(doc.body.childNodes)) {
    if (child.nodeType === NODE_TYPE_ELEMENT && BLOCK_ELEMENT_TYPES.includes(child.nodeName)) {
      count++;
    } else if (child.nodeType === NODE_TYPE_TEXT && (child as Text).textContent?.trim()) {
      count++;
    }
  }
  return count;
}
