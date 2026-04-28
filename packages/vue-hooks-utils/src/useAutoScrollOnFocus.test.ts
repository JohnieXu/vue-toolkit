import { createApp, type App } from 'vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useAutoScrollOnFocus } from './useAutoScrollOnFocus'

const mountHook = (hook: () => void) => {
  const root = document.createElement('div')
  document.body.appendChild(root)
  const app = createApp({
    setup() {
      hook()
      return () => null
    },
  })
  app.mount(root)
  return {
    app,
    root,
  }
}

const setReadonlyValue = <T extends object, K extends keyof T>(target: T, key: K, value: T[K]) => {
  Object.defineProperty(target, key, {
    configurable: true,
    value,
  })
}

const createInput = () => {
  const input = document.createElement('input')
  document.body.appendChild(input)
  return input
}

const cleanupApp = (app: App, root: HTMLElement) => {
  app.unmount()
  root.remove()
}

describe('useAutoScrollOnFocus', () => {
  afterEach(() => {
    vi.useRealTimers()
    vi.unstubAllGlobals()
    document.body.innerHTML = ''
  })

  it('scrolls input into view on non-iOS devices after focus', () => {
    vi.useFakeTimers()
    vi.stubGlobal('navigator', {
      userAgent: 'Android',
      maxTouchPoints: 1,
    })
    setReadonlyValue(window, 'innerHeight', 600)

    const input = createInput()
    input.getBoundingClientRect = vi.fn(() => ({
      top: 700,
      bottom: 740,
      left: 0,
      right: 100,
      width: 100,
      height: 40,
      x: 0,
      y: 700,
      toJSON: () => ({}),
    }))
    input.scrollIntoView = vi.fn()

    const { app, root } = mountHook(() => {
      useAutoScrollOnFocus({
        defaultDelay: 500,
      })
    })

    input.dispatchEvent(new FocusEvent('focusin', { bubbles: true }))
    vi.advanceTimersByTime(499)
    expect(input.scrollIntoView).not.toHaveBeenCalled()

    vi.advanceTimersByTime(1)
    expect(input.scrollIntoView).toHaveBeenCalledWith({
      behavior: 'smooth',
      block: 'center',
    })

    cleanupApp(app, root)
  })

  it('uses fixed selector height as bottom offset', () => {
    vi.useFakeTimers()
    vi.stubGlobal('navigator', {
      userAgent: 'Android',
      maxTouchPoints: 1,
    })
    setReadonlyValue(window, 'innerHeight', 600)

    const fixed = document.createElement('div')
    fixed.className = 'bottom-bar'
    setReadonlyValue(fixed, 'offsetHeight', 120)
    document.body.appendChild(fixed)

    const input = createInput()
    input.getBoundingClientRect = vi.fn(() => ({
      top: 500,
      bottom: 540,
      left: 0,
      right: 100,
      width: 100,
      height: 40,
      x: 0,
      y: 500,
      toJSON: () => ({}),
    }))
    input.scrollIntoView = vi.fn()

    const { app, root } = mountHook(() => {
      useAutoScrollOnFocus({
        fixedSelector: '.bottom-bar',
      })
    })

    input.dispatchEvent(new FocusEvent('focusin', { bubbles: true }))
    vi.advanceTimersByTime(500)

    expect(input.scrollIntoView).toHaveBeenCalled()

    cleanupApp(app, root)
  })

  it('scrolls the nearest scrollable container on iOS', () => {
    vi.useFakeTimers()
    vi.stubGlobal('navigator', {
      userAgent: 'iPhone',
      maxTouchPoints: 1,
    })
    setReadonlyValue(window, 'innerHeight', 800)

    const container = document.createElement('div')
    container.style.overflowY = 'auto'
    container.scrollTop = 20
    setReadonlyValue(container, 'scrollHeight', 2000)
    setReadonlyValue(container, 'clientHeight', 600)
    container.getBoundingClientRect = vi.fn(() => ({
      top: 0,
      bottom: 600,
      left: 0,
      right: 375,
      width: 375,
      height: 600,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    }))
    container.scrollTo = vi.fn()

    const input = document.createElement('input')
    input.getBoundingClientRect = vi.fn(() => ({
      top: 700,
      bottom: 740,
      left: 0,
      right: 100,
      width: 100,
      height: 40,
      x: 0,
      y: 700,
      toJSON: () => ({}),
    }))
    container.appendChild(input)
    document.body.appendChild(container)

    const { app, root } = mountHook(() => {
      useAutoScrollOnFocus({
        topOffset: 100,
      })
    })

    input.dispatchEvent(new FocusEvent('focusin', { bubbles: true }))
    vi.advanceTimersByTime(300)

    expect(container.scrollTo).toHaveBeenCalledWith({
      top: 620,
      behavior: 'smooth',
    })

    cleanupApp(app, root)
  })

  it('clears pending scroll timers on unmount', () => {
    vi.useFakeTimers()
    vi.stubGlobal('navigator', {
      userAgent: 'Android',
      maxTouchPoints: 1,
    })
    setReadonlyValue(window, 'innerHeight', 600)

    const input = createInput()
    input.getBoundingClientRect = vi.fn(() => ({
      top: 700,
      bottom: 740,
      left: 0,
      right: 100,
      width: 100,
      height: 40,
      x: 0,
      y: 700,
      toJSON: () => ({}),
    }))
    input.scrollIntoView = vi.fn()

    const { app, root } = mountHook(() => {
      useAutoScrollOnFocus()
    })

    input.dispatchEvent(new FocusEvent('focusin', { bubbles: true }))
    cleanupApp(app, root)
    vi.runAllTimers()

    expect(input.scrollIntoView).not.toHaveBeenCalled()
  })
})
