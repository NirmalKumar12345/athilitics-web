// Utility to convert HTML to plain text
export function htmlToText(html: string): string {
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html || '';
  return tempDiv.textContent || '';
}
