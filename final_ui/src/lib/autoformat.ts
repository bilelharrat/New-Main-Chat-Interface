export function autoformatHtml(html: string): string {
  return html
    .replace(/ -- /g, ' — ')
    .replace(/\\"/g, '"')
    .replace(/\\'/g, "'")
    .replace(/\.\.\./g, '…')
    .replace(/\s+/g, ' ')
    .trim();
}

export function autoformatText(text: string): string {
  return text
    .replace(/ -- /g, ' — ')
    .replace(/"/g, '"')
    .replace(/'/g, "'")
    .replace(/\.\.\./g, '…')
    .replace(/\s+/g, ' ')
    .trim();
}
