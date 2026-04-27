import { describe, expect, it, vi } from 'vitest'
import { createNotifier } from './notifier'

describe('createNotifier', () => {
  it('dispatches payload and returns dispatch result', () => {
    const dispatch = vi.fn(() => 'ok')
    const notifier = createNotifier(dispatch, { enableConsoleLog: false })

    const result = notifier.notify('hello', { type: 'success' })

    expect(result).toBe('ok')
    expect(dispatch).toHaveBeenCalledWith('hello', { type: 'success' })
  })

  it('logs resolved messages when console logging is enabled', () => {
    const logger = vi.fn()
    const notifier = createNotifier(vi.fn(), { logger, logPrefix: '[test]' })

    notifier.notify({ message: 'saved' }, { duration: 1000 })

    expect(logger).toHaveBeenCalledWith('[test]', 'saved', {
      payload: { message: 'saved' },
      options: { duration: 1000 },
    })
  })

  it('lets notify options override runtime logging config', () => {
    const logger = vi.fn()
    const notifier = createNotifier(vi.fn(), {
      enableConsoleLog: true,
      logger,
    })

    notifier.notify('hidden', { enableConsoleLog: false })

    expect(logger).not.toHaveBeenCalled()
  })

  it('updates and snapshots runtime config', () => {
    const notifier = createNotifier(vi.fn(), {
      enableConsoleLog: false,
      logPrefix: '[initial]',
    })

    notifier.setConfig({ enableConsoleLog: true, logPrefix: '[next]' })
    const config = notifier.getConfig()
    config.logPrefix = '[mutated]'

    expect(notifier.getConfig()).toEqual({
      enableConsoleLog: true,
      logPrefix: '[next]',
    })
  })
})
