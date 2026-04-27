import { afterEach, describe, expect, it, vi } from 'vitest'
import { decodeHtmlEntities } from './decodeHtmlEntities'

describe('decodeHtmlEntities', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('decodes html entities with the browser document', () => {
    expect(decodeHtmlEntities('&lt;span&gt;Hi&nbsp;&amp;&nbsp;Bye&lt;/span&gt;')).toBe(
      '<span>Hi\u00a0&\u00a0Bye</span>'
    )
  })

  it('returns an empty string for empty values', () => {
    expect(decodeHtmlEntities('')).toBe('')
    expect(decodeHtmlEntities(null)).toBe('')
    expect(decodeHtmlEntities(undefined)).toBe('')
  })

  it('returns the source string when document is unavailable', () => {
    vi.stubGlobal('document', undefined)

    expect(decodeHtmlEntities('&lt;strong&gt;raw&lt;/strong&gt;')).toBe('&lt;strong&gt;raw&lt;/strong&gt;')
  })
})
