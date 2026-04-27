import { defineComponent, h } from 'vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { mountComponent } from './index'

const TestComponent = defineComponent({
  setup() {
    return () => h('div', { class: 'mounted-content' }, 'mounted')
  },
})

describe('mountComponent', () => {
  afterEach(() => {
    vi.useRealTimers()
    document.body.innerHTML = ''
  })

  it('mounts a component into document body by default', () => {
    const result = mountComponent(TestComponent)

    expect(document.body.contains(result.container)).toBe(true)
    expect(result.container.querySelector('.mounted-content')?.textContent).toBe('mounted')

    result.unmount()
  })

  it('mounts a component into a custom parent', () => {
    const parent = document.createElement('section')
    document.body.appendChild(parent)

    const result = mountComponent(TestComponent, { parent })

    expect(parent.contains(result.container)).toBe(true)
    expect(document.body.contains(result.container)).toBe(true)

    result.unmount()
  })

  it('unmounts immediately and calls onDone', () => {
    const onDone = vi.fn()
    const result = mountComponent(TestComponent)

    result.unmount(onDone)

    expect(document.body.contains(result.container)).toBe(false)
    expect(onDone).toHaveBeenCalledTimes(1)
  })

  it('delays unmount when unmountDelay is configured', () => {
    vi.useFakeTimers()
    const onDone = vi.fn()
    const result = mountComponent(TestComponent, { unmountDelay: 300 })

    result.unmount(onDone)

    expect(document.body.contains(result.container)).toBe(true)
    expect(onDone).not.toHaveBeenCalled()

    vi.advanceTimersByTime(300)

    expect(document.body.contains(result.container)).toBe(false)
    expect(onDone).toHaveBeenCalledTimes(1)
  })
})
