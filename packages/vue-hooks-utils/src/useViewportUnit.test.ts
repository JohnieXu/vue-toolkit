import { describe, expect, it } from 'vitest'
import { pxToViewportUnit, useViewportUnit } from './useViewportUnit'

describe('pxToViewportUnit', () => {
  it('converts px numbers to vw with the default design size', () => {
    expect(pxToViewportUnit(37.5)).toBe('10vw')
  })

  it('supports custom design size, unit and precision', () => {
    expect(pxToViewportUnit(108, { designSize: 1080, unit: 'vh', precision: 2 })).toBe('10vh')
    expect(pxToViewportUnit(1, { designWidth: 3, precision: 3 })).toBe('33.333vw')
  })

  it('passes through string values by default', () => {
    expect(pxToViewportUnit('clamp(12px, 3vw, 24px)')).toBe('clamp(12px, 3vw, 24px)')
  })

  it('can convert numeric strings when passthroughString is disabled', () => {
    expect(pxToViewportUnit('75', { passthroughString: false })).toBe('20vw')
  })

  it('returns fallback value for non-finite values', () => {
    expect(pxToViewportUnit(undefined)).toBe('0vw')
    expect(pxToViewportUnit('abc', { passthroughString: false, fallbackValue: 'auto' })).toBe('auto')
  })
})

describe('useViewportUnit', () => {
  it('applies default options and lets each call override them', () => {
    const viewportUnit = useViewportUnit({ designSize: 750, precision: 1, unit: 'vh' })

    expect(viewportUnit.pxToViewportUnit(75)).toBe('10vh')
    expect(viewportUnit.pxToViewportUnit(75, { unit: 'vmin' })).toBe('10vmin')
    expect(viewportUnit.pxToVw(75)).toBe('10vw')
  })
})
