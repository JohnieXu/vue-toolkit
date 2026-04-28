import { createApp, nextTick, type App } from 'vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  type UseSoftKeyboardVisibilityOptions,
  type UseSoftKeyboardVisibilityResult,
  useSoftKeyboardVisibility,
} from './useSoftKeyboardVisibility'

const mountHook = (options: UseSoftKeyboardVisibilityOptions = {}) => {
  let result: UseSoftKeyboardVisibilityResult | undefined
  const root = document.createElement('div')
  document.body.appendChild(root)
  const app = createApp({
    setup() {
      result = useSoftKeyboardVisibility(options)
      return () => null
    },
  })
  app.mount(root)
  return {
    app,
    root,
    result: result as UseSoftKeyboardVisibilityResult,
  }
}

const cleanupApp = (app: App, root: HTMLElement) => {
  app.unmount()
  root.remove()
}

const setReadonlyValue = <T extends object, K extends keyof T>(target: T, key: K, value: T[K]) => {
  Object.defineProperty(target, key, {
    configurable: true,
    value,
  })
}

const createVisualViewport = (height: number) => {
  const viewport = new EventTarget() as VisualViewport
  setReadonlyValue(viewport, 'height', height)
  return viewport
}

describe('useSoftKeyboardVisibility', () => {
  afterEach(() => {
    vi.useRealTimers()
    vi.unstubAllGlobals()
    document.body.innerHTML = ''
    setReadonlyValue(window, 'visualViewport', null)
  })

  it('detects keyboard visibility from visualViewport height diff', () => {
    setReadonlyValue(window, 'innerHeight', 700)
    const visualViewport = createVisualViewport(700)
    setReadonlyValue(window, 'visualViewport', visualViewport)

    const onChange = vi.fn()
    const { app, root, result } = mountHook({
      threshold: 100,
      onChange,
    })

    setReadonlyValue(visualViewport, 'height', 520)
    visualViewport.dispatchEvent(new Event('resize'))

    expect(result.isKeyboardVisible.value).toBe(true)
    expect(result.keyboardHeight.value).toBe(180)
    expect(result.viewportHeight.value).toBe(520)
    expect(onChange).toHaveBeenCalledWith({
      isKeyboardVisible: true,
      keyboardHeight: 180,
      viewportHeight: 520,
      baselineHeight: 700,
    })

    cleanupApp(app, root)
  })

  it('falls back to window resize when visualViewport is unavailable', () => {
    setReadonlyValue(window, 'visualViewport', null)
    setReadonlyValue(window, 'innerHeight', 700)

    const { app, root, result } = mountHook({
      threshold: 100,
    })

    setReadonlyValue(window, 'innerHeight', 560)
    window.dispatchEvent(new Event('resize'))

    expect(result.isKeyboardVisible.value).toBe(true)
    expect(result.keyboardHeight.value).toBe(140)
    expect(result.viewportHeight.value).toBe(560)

    cleanupApp(app, root)
  })

  it('updates after editable element focus', async () => {
    vi.useFakeTimers()
    setReadonlyValue(window, 'innerHeight', 700)
    const visualViewport = createVisualViewport(700)
    setReadonlyValue(window, 'visualViewport', visualViewport)

    const input = document.createElement('input')
    document.body.appendChild(input)

    const { app, root, result } = mountHook({
      focusDelay: 80,
    })

    setReadonlyValue(visualViewport, 'height', 500)
    input.dispatchEvent(new FocusEvent('focusin', { bubbles: true }))
    vi.advanceTimersByTime(79)
    expect(result.isKeyboardVisible.value).toBe(false)

    vi.advanceTimersByTime(1)
    await nextTick()
    expect(result.isKeyboardVisible.value).toBe(true)
    expect(result.keyboardHeight.value).toBe(200)

    cleanupApp(app, root)
  })

  it('resets baseline height manually', () => {
    setReadonlyValue(window, 'visualViewport', null)
    setReadonlyValue(window, 'innerHeight', 700)

    const { app, root, result } = mountHook()

    setReadonlyValue(window, 'innerHeight', 540)
    window.dispatchEvent(new Event('resize'))
    expect(result.isKeyboardVisible.value).toBe(true)

    result.reset()
    expect(result.baselineHeight.value).toBe(540)
    expect(result.isKeyboardVisible.value).toBe(false)
    expect(result.keyboardHeight.value).toBe(0)

    cleanupApp(app, root)
  })

  it('clears delayed focus updates on unmount', () => {
    vi.useFakeTimers()
    setReadonlyValue(window, 'innerHeight', 700)
    const visualViewport = createVisualViewport(700)
    setReadonlyValue(window, 'visualViewport', visualViewport)

    const input = document.createElement('input')
    document.body.appendChild(input)

    const onChange = vi.fn()
    const { app, root } = mountHook({
      onChange,
      focusDelay: 80,
    })

    setReadonlyValue(visualViewport, 'height', 500)
    input.dispatchEvent(new FocusEvent('focusin', { bubbles: true }))
    cleanupApp(app, root)
    vi.runAllTimers()

    expect(onChange).not.toHaveBeenCalled()
  })
})
