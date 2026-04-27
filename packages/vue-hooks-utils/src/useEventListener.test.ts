import { mount } from '@vue/test-utils'
import { defineComponent, h, nextTick, ref, shallowRef } from 'vue'
import { describe, expect, it, vi } from 'vitest'
import { resolveMaybeRefTarget, useEventListener, type EventTargetLike } from './useEventListener'

const createTarget = () => ({
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
})

describe('resolveMaybeRefTarget', () => {
  it('resolves plain values, refs and getters', () => {
    const target = createTarget()
    const targetRef = shallowRef<EventTargetLike | null>(target)

    expect(resolveMaybeRefTarget(target)).toBe(target)
    expect(resolveMaybeRefTarget(targetRef)).toBe(target)
    expect(resolveMaybeRefTarget(() => target)).toBe(target)
  })
})

describe('useEventListener', () => {
  it('registers and removes a listener with a plain target', () => {
    const target = createTarget()
    const handler = vi.fn()
    const options = { passive: true }
    const wrapper = mount(
      defineComponent({
        setup() {
          useEventListener(target, 'click', handler, options)
          return () => h('div')
        },
      })
    )

    expect(target.addEventListener).toHaveBeenCalledWith('click', handler, options)

    wrapper.unmount()

    expect(target.removeEventListener).toHaveBeenCalledWith('click', handler, options)
  })

  it('moves the listener when a ref target changes', async () => {
    const firstTarget = createTarget()
    const secondTarget = createTarget()
    const currentTarget = ref<EventTargetLike | null>(firstTarget)
    const handler = vi.fn()

    const wrapper = mount(
      defineComponent({
        setup() {
          useEventListener(currentTarget, 'scroll', handler)
          return () => h('div')
        },
      })
    )

    expect(firstTarget.addEventListener).toHaveBeenCalledWith('scroll', handler, undefined)

    currentTarget.value = secondTarget
    await nextTick()

    expect(firstTarget.removeEventListener).toHaveBeenCalledWith('scroll', handler, undefined)
    expect(secondTarget.addEventListener).toHaveBeenCalledWith('scroll', handler, undefined)

    wrapper.unmount()
  })

  it('returns a stop function for manual cleanup', () => {
    const target = createTarget()
    let stop: () => void = () => {}
    const wrapper = mount(
      defineComponent({
        setup() {
          stop = useEventListener(target, 'resize', vi.fn())
          return () => h('div')
        },
      })
    )

    stop()

    expect(target.removeEventListener).toHaveBeenCalledTimes(1)
    wrapper.unmount()
  })
})
