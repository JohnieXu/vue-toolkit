/**
 * 将 HTML 实体字符串解码为普通文本。
 *
 * @param html - 含 HTML 实体的字符串。
 * @returns 解码后的字符串。
 * @public
 */
export function decodeHtmlEntities(html: unknown): string {
  if (!html) return ''
  const source = String(html)
  if (typeof document === 'undefined') return source
  const textArea = document.createElement('textarea')
  textArea.innerHTML = source
  return textArea.value
}
