import { afterEach, describe, expect, it } from 'vitest'
import { parseAnimationDuration, resolveAnimationDuration } from './animationDuration'

describe('parseAnimationDuration', () => {
  it('parses numbers and numeric strings as milliseconds', () => {
    expect(parseAnimationDuration(120.6)).toBe(121)
    expect(parseAnimationDuration('240')).toBe(240)
  })

  it('parses ms and s units', () => {
    expect(parseAnimationDuration('180ms')).toBe(180)
    expect(parseAnimationDuration('0.2s')).toBe(200)
  })

  it('uses the first duration from comma-separated values', () => {
    expect(parseAnimationDuration('150ms, 300ms')).toBe(150)
  })

  it('clamps negative durations and rejects invalid values', () => {
    expect(parseAnimationDuration('-1s')).toBe(0)
    expect(parseAnimationDuration('fast')).toBeNull()
    expect(parseAnimationDuration(undefined)).toBeNull()
  })
})

describe('resolveAnimationDuration', () => {
  afterEach(() => {
    document.documentElement.style.removeProperty('--van-duration-base')
    document.documentElement.style.removeProperty('--van-animation-duration-base')
  })

  it('prefers call options over global config and css variables', () => {
    document.documentElement.style.setProperty('--van-duration-base', '500ms')

    expect(resolveAnimationDuration({ animationDuration: '120ms' }, { animationDuration: '240ms' })).toBe(120)
  })

  it('falls back to global config when call options are invalid', () => {
    expect(resolveAnimationDuration({ animationDuration: 'invalid' }, { animationDuration: '0.4s' })).toBe(400)
  })

  it('falls back to Vant css variables before the default duration', () => {
    document.documentElement.style.setProperty('--van-duration-base', '360ms')

    expect(resolveAnimationDuration()).toBe(360)
  })

  it('uses the secondary Vant css variable and then default duration', () => {
    document.documentElement.style.setProperty('--van-duration-base', 'invalid')
    document.documentElement.style.setProperty('--van-animation-duration-base', '0.18s')

    expect(resolveAnimationDuration()).toBe(180)

    document.documentElement.style.setProperty('--van-animation-duration-base', 'invalid')

    expect(resolveAnimationDuration()).toBe(300)
  })
})
